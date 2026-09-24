<script lang="ts">
import type { HTMLButtonAttributes } from 'svelte/elements';
import { tick } from 'svelte';
import { cn } from '../../utils/cn.js';
import { placeNear } from '../../utils/anchor.js';

type Variant = 'filled' | 'outlined';

export interface SelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

interface Props extends Omit<HTMLButtonAttributes, 'class' | 'children' | 'value'> {
	value?: string;
	options?: SelectOption[];
	label?: string;
	disabled?: boolean;
	invalid?: boolean;
	variant?: Variant;
	class?: string;
}

let instanceCounter = 0;

let {
	value = $bindable(''),
	options = [],
	label = '',
	disabled = false,
	invalid = false,
	variant = 'outlined',
	class: className,
	...rest
}: Props = $props();

const uid = ++instanceCounter;
const listboxId = `m3-select-list-${uid}`;
const optionId = (index: number) => `m3-select-opt-${uid}-${index}`;

let open = $state(false);
let triggerEl: HTMLButtonElement | undefined = $state();
let listEl: HTMLDivElement | undefined = $state();
let activeIndex = $state(-1);
let pos = $state.raw<{ top: number; left: number; maxHeight: number } | null>(null);

const selectedIndex = $derived(options.findIndex((o) => o.value === value));
const selectedOption = $derived(selectedIndex >= 0 ? options[selectedIndex] : undefined);
const floating = $derived(open || value.length > 0);

const enabledIndexes = $derived(options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0));

async function measure() {
	if (!triggerEl || !listEl) return;
	const trigger = triggerEl.getBoundingClientRect();
	const panel = listEl.getBoundingClientRect();
	listEl.style.width = `${Math.max(trigger.width, panel.width)}px`;
	pos = placeNear(
		trigger,
		{ width: listEl.getBoundingClientRect().width, height: panel.height },
		{ width: window.innerWidth, height: window.innerHeight },
		'bottom-start'
	);
}

async function openList() {
	if (disabled || options.length === 0) return;
	open = true;
	activeIndex = selectedIndex >= 0 ? selectedIndex : (enabledIndexes[0] ?? -1);
	pos = null;
	await tick();
	await measure();
	focusActive();
}

function close(restoreFocus = false) {
	open = false;
	pos = null;
	if (restoreFocus) triggerEl?.focus();
}

function focusActive() {
	if (!listEl || activeIndex < 0) return;
	listEl.querySelector<HTMLElement>(`#${CSS.escape(optionId(activeIndex))}`)?.focus();
}

function selectIndex(index: number) {
	const option = options[index];
	if (!option || option.disabled) return;
	value = option.value;
	close(true);
}

function moveActive(delta: number) {
	if (enabledIndexes.length === 0) return;
	const current = enabledIndexes.indexOf(activeIndex);
	let next: number;
	if (current === -1) {
		next = enabledIndexes[delta > 0 ? 0 : enabledIndexes.length - 1] ?? activeIndex;
	} else {
		next = enabledIndexes[(current + delta + enabledIndexes.length) % enabledIndexes.length] ?? activeIndex;
	}
	activeIndex = next;
	focusActive();
}

function onTriggerClick(event: MouseEvent) {
	rest.onclick?.(
		event as MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
	);
	if (disabled) return;
	if (open) close(true);
	else void openList();
}

function onTriggerKeydown(event: KeyboardEvent) {
	rest.onkeydown?.(
		event as KeyboardEvent & { currentTarget: EventTarget & HTMLButtonElement }
	);
	if (disabled) return;
	if (!open) {
		if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			void openList();
		}
		return;
	}
	switch (event.key) {
		case 'Escape':
			event.preventDefault();
			close(true);
			break;
		case 'ArrowDown':
			event.preventDefault();
			moveActive(1);
			break;
		case 'ArrowUp':
			event.preventDefault();
			moveActive(-1);
			break;
		case 'Home':
			event.preventDefault();
			activeIndex = enabledIndexes[0] ?? activeIndex;
			focusActive();
			break;
		case 'End':
			event.preventDefault();
			activeIndex = enabledIndexes[enabledIndexes.length - 1] ?? activeIndex;
			focusActive();
			break;
		case 'Enter':
		case ' ': {
			event.preventDefault();
			if (activeIndex >= 0) selectIndex(activeIndex);
			break;
		}
		case 'Tab':
			close(true);
			break;
	}
}

function onListKeydown(event: KeyboardEvent) {
	switch (event.key) {
		case 'Escape':
			event.preventDefault();
			close(true);
			break;
		case 'ArrowDown':
			event.preventDefault();
			moveActive(1);
			break;
		case 'ArrowUp':
			event.preventDefault();
			moveActive(-1);
			break;
		case 'Home':
			event.preventDefault();
			activeIndex = enabledIndexes[0] ?? activeIndex;
			focusActive();
			break;
		case 'End':
			event.preventDefault();
			activeIndex = enabledIndexes[enabledIndexes.length - 1] ?? activeIndex;
			focusActive();
			break;
		case 'Enter':
		case ' ': {
			event.preventDefault();
			const el = document.activeElement;
			const index = options.findIndex((_, i) => optionId(i) === el?.id);
			if (index >= 0) selectIndex(index);
			break;
		}
		case 'Tab':
			close(true);
			break;
	}
}

$effect(() => {
	if (!open) return;
	const onPointerDown = (event: PointerEvent) => {
		const target = event.target as Node;
		if (triggerEl?.contains(target) || listEl?.contains(target)) return;
		close();
	};
	document.addEventListener('pointerdown', onPointerDown, true);
	return () => document.removeEventListener('pointerdown', onPointerDown, true);
});
</script>

<div class={cn('m3-select', `v-${variant}`, invalid && 'invalid', disabled && 'disabled', className)}>
	<button
		bind:this={triggerEl}
		class="m3-select__trigger"
		type="button"
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-controls={open ? listboxId : undefined}
		disabled={disabled || undefined}
		{...rest}
		onclick={onTriggerClick}
		onkeydown={onTriggerKeydown}
	>
		{#if label}
			<span class={cn('m3-select__label', floating && 'floating')}>{label}</span>
		{/if}
		<span class="m3-select__value">{selectedOption?.label ?? ''}</span>
		<span class="m3-select__arrow" aria-hidden="true">
			<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
				<path d="M12 15.5 5.5 9l1.06-1.06L12 13.38l5.44-5.44L18.5 9 12 15.5Z" />
			</svg>
		</span>
	</button>
	{#if open}
		<div
			bind:this={listEl}
			class="m3-select__popup"
			id={listboxId}
			role="listbox"
			aria-label={label || undefined}
			tabindex="-1"
			style:top={pos ? `${pos.top}px` : '-9999px'}
			style:left={pos ? `${pos.left}px` : '-9999px'}
			style:max-height={pos ? `${pos.maxHeight}px` : undefined}
		>
			{#each options as option, i (option.value)}
				<div
					id={optionId(i)}
					tabindex="-1"
					class={cn(
						'm3-select__option',
						option.value === value && 'selected',
						i === activeIndex && 'active',
						option.disabled && 'disabled'
					)}
					role="option"
					aria-selected={option.value === value}
					aria-disabled={option.disabled || undefined}
					onpointerenter={() => !option.disabled && (activeIndex = i)}
					onkeydown={onListKeydown}
					onclick={() => selectIndex(i)}
				>
					<span class="m3-select__option-label">{option.label}</span>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.m3-select {
		--_outline-rest: var(--m3-sys-outline-variant);
		--_outline-active: var(--m3-sys-primary);
		--_label-color: var(--m3-sys-on-surface-variant);
		--_label-y: calc(28px * var(--m3-density-scale));
		position: relative;
		display: block;
		min-width: 0;
		color: var(--m3-sys-on-surface);
		font: var(--m3-sys-typescale-body-large-weight) var(--m3-sys-typescale-body-large) /
			var(--m3-sys-typescale-body-large-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-body-large-tracking);
	}

	.m3-select.invalid {
		--_outline-rest: var(--m3-sys-error);
		--_outline-active: var(--m3-sys-error);
		--_label-color: var(--m3-sys-error);
	}

	.m3-select.disabled {
		opacity: 0.38;
		pointer-events: none;
	}

	.m3-select__trigger {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		min-height: calc(56px * var(--m3-density-scale));
		margin: 0;
		border: none;
		background: transparent;
		color: inherit;
		font: inherit;
		letter-spacing: inherit;
		text-align: start;
		cursor: pointer;
		padding: 16px;
		transition: background-color var(--m3-motion-fast);
		-webkit-tap-highlight-color: transparent;
	}

	.m3-select__trigger:focus-visible {
		outline: none;
	}

	.m3-select__trigger:focus-visible::after {
		content: '';
		position: absolute;
		inset: 0;
		border: 2px solid var(--_outline-active);
		border-radius: inherit;
		pointer-events: none;
	}

	.m3-select__label {
		position: absolute;
		z-index: 1;
		inset-inline-start: 16px;
		top: var(--_label-y);
		max-width: calc(100% - 72px);
		color: var(--_label-color);
		pointer-events: none;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		transform: translateY(-50%) scale(1);
		transform-origin: left center;
		transition:
			transform var(--m3-motion-fast),
			color var(--m3-motion-fast);
	}

	.m3-select__label.floating {
		transform: translateY(calc(-50% + var(--_label-float-y, 0px) - var(--_label-y))) scale(0.75);
	}

	.m3-select__value {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.m3-select__arrow {
		display: inline-flex;
		flex-shrink: 0;
		margin-inline-start: 12px;
		color: var(--m3-sys-on-surface-variant);
		transform: rotate(0deg);
		transition: transform var(--m3-motion-spatial-fast);
	}

	.m3-select__trigger[aria-expanded='true'] .m3-select__arrow {
		transform: rotate(180deg);
	}

	/* Outlined */
	.v-outlined .m3-select__trigger {
		border-radius: var(--m3-sys-shape-medium);
		box-shadow: inset 0 0 0 1px var(--_outline-rest);
		transition: background-color var(--m3-motion-fast);
	}

	.v-outlined .m3-select__trigger:focus-visible {
		box-shadow: inset 0 0 0 1px transparent;
	}

	.v-outlined .m3-select__label {
		background: var(--m3-field-label-bg, var(--m3-sys-surface));
		padding-inline: 4px;
		inset-inline-start: 12px;
	}

	/* Filled */
	.v-filled {
		--_label-float-y: 8px;
	}

	.v-filled .m3-select__trigger {
		border-radius: var(--m3-sys-shape-extra-small) var(--m3-sys-shape-extra-small) 0 0;
		background: var(--m3-sys-surface-container-highest);
		box-shadow: inset 0 -1px 0 0 var(--m3-sys-on-surface-variant);
	}

	.v-filled .m3-select__trigger:focus-visible {
		background: var(--m3-sys-surface-container-highest);
		box-shadow: inset 0 -2px 0 0 var(--_outline-active);
	}

	.v-filled .m3-select__trigger:focus-visible::after {
		display: none;
	}

	.v-filled.invalid .m3-select__trigger {
		box-shadow: inset 0 -1px 0 0 var(--m3-sys-error);
	}

	.v-filled .m3-select__label {
		inset-inline-start: 16px;
	}

	/* Popup */
	.m3-select__popup {
		position: fixed;
		z-index: 1000;
		min-width: 112px;
		max-width: calc(100vw - 16px);
		overflow-y: auto;
		padding: 8px 0;
		border-radius: var(--m3-sys-shape-extra-small);
		background: var(--m3-sys-surface-container);
		color: var(--m3-sys-on-surface);
		box-shadow: var(--m3-sys-elevation-2);
		outline: none;
	}

	.m3-select__option {
		position: relative;
		display: flex;
		align-items: center;
		min-height: 48px;
		padding: 0 16px;
		cursor: pointer;
		user-select: none;
		transition:
			background-color var(--m3-motion-fast),
			color var(--m3-motion-fast);
	}

	.m3-select__option:hover:not(.disabled),
	.m3-select__option.active:not(.disabled) {
		background: var(--m3-sys-surface-container-high);
	}

	.m3-select__option.selected {
		background: var(--m3-sys-primary-container);
		color: var(--m3-sys-on-primary-container);
		font-weight: 500;
	}

	.m3-select__option.disabled {
		opacity: 0.38;
		pointer-events: none;
	}

	.m3-select__option:focus-visible {
		outline: 3px solid var(--m3-sys-primary);
		outline-offset: -3px;
	}

	.m3-select__option-label {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	@media (forced-colors: active) {
		.v-outlined .m3-select__trigger {
			box-shadow: inset 0 0 0 1px CanvasText;
		}
		.m3-select__trigger:focus-visible::after {
			border-color: Highlight;
		}
		.m3-select__popup {
			border: 1px solid CanvasText;
			background: Canvas;
			color: CanvasText;
		}
		.m3-select__option.selected {
			background: Highlight;
			color: HighlightText;
		}
	}
</style>
