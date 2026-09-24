<script lang="ts">
import type { HTMLInputAttributes } from 'svelte/elements';
import { tick } from 'svelte';
import { cn } from '../../utils/cn.js';
import { placeNear } from '../../utils/anchor.js';
import DatePickerDocked from './DatePickerDocked.svelte';
import { parseISODate, toISODate } from './_picker/dateUtils.js';

interface Props extends Omit<HTMLInputAttributes, 'class' | 'children' | 'value' | 'type'> {
	value?: string;
	minDate?: Date | null;
	maxDate?: Date | null;
	disabled?: boolean;
	invalid?: boolean;
	class?: string;
	type?: string;
}

let {
	value = $bindable(''),
	minDate = null,
	maxDate = null,
	disabled = false,
	invalid = false,
	class: className,
	type = 'text',
	...rest
}: Props = $props();

let open = $state(false);
let parseInvalid = $state(false);
let inputEl: HTMLInputElement | undefined = $state();
let popEl: HTMLDivElement | undefined = $state();
let pos = $state.raw<{ top: number; left: number; maxHeight: number } | null>(null);
let picked = $state<Date | null>(null);

const isInvalid = $derived(invalid || parseInvalid);
const selectedDate = $derived(parseISODate(value));

$effect(() => {
	picked = selectedDate;
});

$effect(() => {
	if (picked) {
		const iso = toISODate(picked);
		if (iso !== value) value = iso;
	}
});

async function measure() {
	if (!inputEl || !popEl) return;
	const trigger = inputEl.getBoundingClientRect();
	const panel = popEl.getBoundingClientRect();
	pos = placeNear(
		trigger,
		{ width: panel.width, height: panel.height },
		{ width: window.innerWidth, height: window.innerHeight },
		'bottom-start'
	);
}

async function openPicker() {
	if (disabled) return;
	open = true;
	pos = null;
	await tick();
	await measure();
}

function close() {
	open = false;
	pos = null;
}

function onInputBlur(event: FocusEvent) {
	const trimmed = value.trim();
	const parsed = parseISODate(trimmed);
	parseInvalid = trimmed.length > 0 && parsed === null;
	if (parsed) value = toISODate(parsed);
	else if (!parseInvalid) value = trimmed;

	(rest.onblur as unknown as ((e: Event) => void) | null | undefined)?.(event);

	const next = event.relatedTarget;
	if (next instanceof Node && popEl?.contains(next)) return;
	if (next instanceof Node && inputEl?.contains(next)) return;
}

function openFromEvent(event: Event) {
	(rest.onfocus as unknown as ((e: Event) => void) | null | undefined)?.(event);
	void openPicker();
}

function onClick(event: MouseEvent) {
	(rest.onclick as unknown as ((e: Event) => void) | null | undefined)?.(event);
	void openPicker();
}

function onInputKeydown(event: KeyboardEvent) {
	(rest.onkeydown as unknown as ((e: Event) => void) | null | undefined)?.(event);
	if (event.key === 'Escape' && open) {
		event.preventDefault();
		close();
	}
}

function onInput(event: Event) {
	parseInvalid = false;
	(rest.oninput as unknown as ((e: Event) => void) | null | undefined)?.(event);
}

$effect(() => {
	if (!open) return;
	const onPointerDown = (event: PointerEvent) => {
		const target = event.target as Node;
		if (inputEl?.contains(target) || popEl?.contains(target)) return;
		close();
	};
	document.addEventListener('pointerdown', onPointerDown, true);
	return () => document.removeEventListener('pointerdown', onPointerDown, true);
});
</script>

<div class={cn('m3-date-field', isInvalid && 'invalid', disabled && 'disabled', className)}>
	<div class="m3-date-field__control">
		<input
			bind:this={inputEl}
			class="m3-date-field__input"
			{type}
			inputmode="numeric"
			placeholder="yyyy-MM-dd"
			autocomplete="off"
			bind:value
			{disabled}
			aria-label="Date"
			aria-invalid={isInvalid || undefined}
			aria-haspopup="dialog"
			aria-expanded={open}
			{...rest}
			onclick={onClick}
			onfocus={openFromEvent}
			onblur={onInputBlur}
			onkeydown={onInputKeydown}
			oninput={onInput}
		/>
	</div>
	{#if open}
		<div
			bind:this={popEl}
			class="m3-date-field__pop"
			role="dialog"
			aria-label="Choose date"
			style:top={pos ? `${pos.top}px` : '-9999px'}
			style:left={pos ? `${pos.left}px` : '-9999px'}
			style:max-height={pos ? `${pos.maxHeight}px` : undefined}
		>
			<DatePickerDocked bind:selected={picked} {minDate} {maxDate} />
		</div>
	{/if}
</div>

<style>
	.m3-date-field {
		--_outline-rest: var(--m3-sys-outline-variant);
		--_outline-active: var(--m3-sys-primary);
		position: relative;
		display: block;
		min-width: 0;
		color: var(--m3-sys-on-surface);
		font: var(--m3-sys-typescale-body-large-weight) var(--m3-sys-typescale-body-large) /
			var(--m3-sys-typescale-body-large-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-body-large-tracking);
	}

	.m3-date-field.invalid {
		--_outline-rest: var(--m3-sys-error);
		--_outline-active: var(--m3-sys-error);
	}

	.m3-date-field.disabled {
		opacity: 0.38;
		pointer-events: none;
	}

	.m3-date-field__control {
		position: relative;
		display: flex;
		align-items: center;
		min-height: calc(56px * var(--m3-density-scale));
		padding: 16px;
		border-radius: var(--m3-sys-shape-medium);
		box-shadow: inset 0 0 0 1px var(--_outline-rest);
		background: transparent;
	}

	.m3-date-field__control:focus-within {
		box-shadow: inset 0 0 0 2px var(--_outline-active);
	}

	.m3-date-field__input {
		flex: 1;
		min-width: 0;
		margin: 0;
		border: none;
		background: transparent;
		color: inherit;
		font: inherit;
		letter-spacing: inherit;
		outline: none;
		padding: 0;
	}

	.m3-date-field__input::placeholder {
		color: var(--m3-sys-on-surface-variant);
		opacity: 1;
	}

	.m3-date-field__pop {
		position: fixed;
		z-index: 1000;
		outline: none;
	}

	.m3-date-field__pop :global(.m3-date-picker) {
		box-shadow: var(--m3-sys-elevation-3);
		max-width: calc(100vw - 16px);
		overflow-y: auto;
		max-height: inherit;
	}

	@media (forced-colors: active) {
		.m3-date-field__control {
			box-shadow: inset 0 0 0 1px CanvasText;
		}
		.m3-date-field__control:focus-within {
			box-shadow: inset 0 0 0 2px Highlight;
		}
	}
</style>
