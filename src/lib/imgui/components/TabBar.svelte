<script lang="ts">
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';

	interface IgTabsContext {
		getActiveId: () => string;
		setActive: (id: string) => void;
	}

	let {
		activeId = $bindable(''),
		onchange,
		class: className = '',
		children,
		content
	}: {
		activeId?: string;
		onchange?: (id: string) => void;
		class?: string;
		children?: Snippet;
		content?: Snippet;
	} = $props();

	function setActive(id: string) {
		if (id === activeId) return;
		activeId = id;
		onchange?.(id);
	}

	setContext<IgTabsContext>('ig-tabs', {
		getActiveId: () => activeId,
		setActive
	});
</script>

<div class="ig-tabbar {className}">
	<div class="ig-tab-strip" role="tablist">
		{@render children?.()}
	</div>
	{#if content}
		<div class="ig-tab-panels" role="tabpanel" id={activeId ? `ig-tabpanel-${activeId}` : undefined}>
			{@render content()}
		</div>
	{/if}
</div>

<style>
	.ig-tabbar {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.ig-tab-strip {
		display: flex;
		align-items: stretch;
		gap: 2px;
		overflow-x: auto;
		border-bottom: var(--ig-border-size) solid var(--ig-border);
		background: transparent;
		scrollbar-width: thin;
		scrollbar-color: var(--ig-scrollbar-grab) var(--ig-scrollbar-bg);
	}

	.ig-tab-strip::-webkit-scrollbar {
		height: 8px;
	}

	.ig-tab-strip::-webkit-scrollbar-track {
		background: var(--ig-scrollbar-bg);
	}

	.ig-tab-strip::-webkit-scrollbar-thumb {
		background: var(--ig-scrollbar-grab);
	}

	.ig-tab-panels {
		padding: var(--ig-window-padding);
		border: var(--ig-border-size) solid var(--ig-border);
		border-top: none;
		background: transparent;
	}
</style>
