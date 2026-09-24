<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements';
import { cn } from '../../utils/cn.js';

interface TabItem {
	id: string;
	label: string;
	disabled?: boolean;
	count?: number;
}

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'onchange'> {
	tabs: TabItem[];
	activeId?: string;
	variant?: 'primary' | 'secondary';
	onchange?: (id: string) => void;
	label?: string;
	class?: string;
}

let {
	tabs,
	activeId = $bindable(tabs[0]?.id ?? ''),
	variant = 'primary',
	onchange,
	label,
	class: className,
	...rest
}: Props = $props();

let listEl: HTMLDivElement | undefined = $state();
let indicatorX = $state(0);
let indicatorW = $state(0);

const activeTab = $derived(tabs.find((t) => t.id === activeId));

function measure() {
	if (!listEl || !activeTab) return;
	const el = listEl.querySelector<HTMLElement>("[data-active='true']");
	if (!el) return;
	const r = el.getBoundingClientRect();
	const lr = listEl.getBoundingClientRect();
	const inset = variant === 'primary' ? 2 : 0;
	indicatorX = r.left - lr.left + listEl.scrollLeft + inset;
	indicatorW = Math.max(r.width - inset * 2, 0);
}

$effect(() => {
	activeId;
	variant;
	tabs;
	listEl;
	measure();
});

function focusTab(id: string) {
	const nodes = listEl?.querySelectorAll<HTMLElement>('[role="tab"]');
	nodes?.forEach((node) => {
		if (node.dataset.tabId === id) node.focus();
	});
}

function select(id: string, moveFocus = false) {
	const tab = tabs.find((t) => t.id === id);
	if (!tab || tab.disabled) return;
	if (tab.id !== activeId) {
		activeId = tab.id;
		onchange?.(tab.id);
	}
	if (moveFocus) focusTab(tab.id);
}

function onKeydown(e: KeyboardEvent) {
	const enabled = tabs.filter((t) => !t.disabled);
	if (enabled.length === 0) return;
	const cur = enabled.findIndex((t) => t.id === activeId);
	let nextIdx = -1;
	switch (e.key) {
		case 'ArrowRight':
		case 'ArrowDown':
			nextIdx = cur < 0 ? 0 : (cur + 1) % enabled.length;
			break;
		case 'ArrowLeft':
		case 'ArrowUp':
			nextIdx = cur < 0 ? enabled.length - 1 : (cur - 1 + enabled.length) % enabled.length;
			break;
		case 'Home':
			nextIdx = 0;
			break;
		case 'End':
			nextIdx = enabled.length - 1;
			break;
		default:
			return;
	}
	e.preventDefault();
	const next = enabled[nextIdx];
	if (next) select(next.id, true);
}
</script>

<div class={cn('m3-tabs', `v-${variant}`, className)} {...rest}>
	<div
		class="scroller"
		bind:this={listEl}
		role="tablist"
		aria-label={label}
		tabindex="-1"
		onkeydown={onKeydown}
	>
		{#if activeTab}
			<span
				class="indicator"
				aria-hidden="true"
				style="width: {indicatorW}px; transform: translateX({indicatorX}px)"
			></span>
		{/if}
		{#each tabs as tab (tab.id)}
			<button
				type="button"
				role="tab"
				id="tab-{tab.id}"
				aria-controls="tabpanel-{tab.id}"
				aria-selected={tab.id === activeId}
				tabindex={tab.id === activeId ? 0 : -1}
				disabled={tab.disabled}
				data-active={tab.id === activeId}
				data-tab-id={tab.id}
				class="tab m3-layer"
				onclick={() => select(tab.id)}
			>
				<span class="tab-label">{tab.label}</span>
				{#if tab.count != null}
					<span class="tab-count">{tab.count}</span>
				{/if}
			</button>
		{/each}
	</div>
</div>

<style>
	.m3-tabs {
		position: relative;
		width: 100%;
		min-width: 0;
		background: var(--m3-sys-surface);
	}

	.scroller {
		position: relative;
		display: flex;
		align-items: stretch;
		gap: 0;
		overflow-x: auto;
		scrollbar-width: none;
	}

	.scroller::-webkit-scrollbar {
		display: none;
	}

	.v-secondary .scroller {
		border-bottom: 1px solid var(--m3-sys-outline-variant);
		-webkit-mask-image: linear-gradient(
			to right,
			transparent 0,
			#000 16px,
			#000 calc(100% - 16px),
			transparent 100%
		);
		mask-image: linear-gradient(
			to right,
			transparent 0,
			#000 16px,
			#000 calc(100% - 16px),
			transparent 100%
		);
	}

	.indicator {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 3px;
		border-radius: var(--m3-sys-shape-full) var(--m3-sys-shape-full) 0 0;
		background: var(--m3-sys-primary);
		pointer-events: none;
		transition: transform var(--m3-motion-default);
		will-change: transform;
	}

	.v-secondary .indicator {
		height: 2px;
	}

	.tab {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		flex-shrink: 0;
		min-height: 48px;
		padding: 0 16px;
		border: none;
		background: transparent;
		color: var(--m3-sys-on-surface-variant);
		cursor: pointer;
		white-space: nowrap;
		user-select: none;
		font: var(--m3-sys-typescale-title-small-weight) var(--m3-sys-typescale-title-small) /
			var(--m3-sys-typescale-title-small-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-title-small-tracking);
		transition:
			color var(--m3-motion-fast),
			background-color var(--m3-motion-fast);
		-webkit-tap-highlight-color: transparent;
	}

	.v-secondary .tab {
		font: var(--m3-sys-typescale-label-large-weight) var(--m3-sys-typescale-label-large) /
			var(--m3-sys-typescale-label-large-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-label-large-tracking);
	}

	.tab:disabled {
		opacity: 0.38;
		cursor: default;
	}

	.tab[data-active='true'] {
		color: var(--m3-sys-primary);
		font-weight: calc(
			var(--m3-sys-typescale-title-small-weight) +
				var(--m3-sys-typescale-emphasized-weight-delta)
		);
	}

	.v-secondary .tab[data-active='true'] {
		color: var(--m3-sys-on-surface);
		font-weight: calc(
			var(--m3-sys-typescale-label-large-weight) +
				var(--m3-sys-typescale-emphasized-weight-delta)
		);
	}

	.tab-count {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 16px;
		height: 16px;
		padding-inline: 4px;
		border-radius: var(--m3-sys-shape-full);
		background: var(--m3-sys-surface-container-highest);
		color: var(--m3-sys-on-surface-variant);
		font: var(--m3-sys-typescale-label-small-weight) var(--m3-sys-typescale-label-small) /
			var(--m3-sys-typescale-label-small-line) var(--m3-sys-font);
	}

	.tab[data-active='true'] .tab-count {
		background: var(--m3-sys-primary-container);
		color: var(--m3-sys-on-primary-container);
	}
</style>
