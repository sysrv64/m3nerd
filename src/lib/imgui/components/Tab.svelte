<script lang="ts">
	import { getContext } from 'svelte';

	interface IgTabsContext {
		getActiveId: () => string;
		setActive: (id: string) => void;
	}

	let {
		id,
		label,
		disabled = false,
		class: className = ''
	}: {
		id: string;
		label: string;
		disabled?: boolean;
		class?: string;
	} = $props();

	const ctx = getContext<IgTabsContext | undefined>('ig-tabs');
	if (!ctx) {
		throw new Error('IgTab must be rendered inside IgTabBar');
	}
	const tabs = ctx;

	const isActive = $derived(tabs.getActiveId() === id);

	function select() {
		if (disabled) return;
		tabs.setActive(id);
	}
</script>

<button
	type="button"
	class="ig-tab ig-focus {className}"
	class:active={isActive}
	disabled={disabled}
	role="tab"
	aria-selected={isActive}
	aria-controls={`ig-tabpanel-${id}`}
	onclick={select}
>
	{label}
</button>

<style>
	.ig-tab {
		flex-shrink: 0;
		padding: 6px 12px;
		border: none;
		border-bottom: 2px solid transparent;
		border-radius: var(--ig-tab-rounding) var(--ig-tab-rounding) 0 0;
		background: var(--ig-tab-unactive);
		color: var(--ig-text);
		font-family: inherit;
		font-size: var(--ig-font-size-sm);
		line-height: var(--ig-line-height);
		white-space: nowrap;
		cursor: pointer;
		transition:
			background-color 120ms linear,
			border-color 120ms linear,
			color 120ms linear;
	}

	.ig-tab:hover:not(:disabled) {
		background: var(--ig-tab-hovered);
	}

	.ig-tab.active {
		background: var(--ig-tab-active);
		border-bottom-color: var(--ig-nav-cursor);
		color: var(--ig-text);
	}

	.ig-tab:disabled {
		color: var(--ig-text-disabled);
		cursor: default;
		opacity: var(--ig-disabled-alpha);
	}
</style>
