<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface TreeNode {
		id: string;
		label: string;
		icon?: string;
		children?: TreeNode[];
		disabled?: boolean;
	}

	let {
		items = [],
		defaultOpen = [],
		class: className = '',
		onselect,
		selected = undefined,
		children
	}: {
		items?: TreeNode[];
		defaultOpen?: string[];
		class?: string;
		onselect?: (id: string) => void;
		selected?: string;
		children?: Snippet;
	} = $props();

	// svelte-ignore state_referenced_locally -- open set is intentionally seeded once from defaults
	let open = $state(new Set<string>(defaultOpen));

	function activate(node: TreeNode) {
		if (node.disabled) return;
		if (node.children?.length) {
			if (open.has(node.id)) open.delete(node.id);
			else open.add(node.id);
			open = new Set(open);
			return;
		}
		onselect?.(node.id);
	}
</script>

{#snippet renderNode(node: TreeNode, depth: number)}
	<div class="ig-tree-node" style="padding-inline-start: calc(var(--ig-indent) * {depth})">
		<button
			type="button"
			class="ig-tree-row ig-focus"
			class:open={!!node.children?.length && open.has(node.id)}
			class:selected={selected === node.id}
			class:leaf={!node.children?.length}
			disabled={node.disabled}
			aria-expanded={node.children?.length ? open.has(node.id) : undefined}
			onclick={() => activate(node)}
		>
			<span class="ig-tree-arrow" aria-hidden="true">
				{#if node.children?.length}▾{/if}
			</span>
			{#if node.icon}
				<span class="ig-tree-icon" aria-hidden="true">{node.icon}</span>
			{/if}
			<span class="ig-tree-label">{node.label}</span>
		</button>
		{#if node.children?.length && open.has(node.id)}
			<div class="ig-tree-children">
				{#each node.children as child (child.id)}
					{@render renderNode(child, depth + 1)}
				{/each}
			</div>
		{/if}
	</div>
{/snippet}

<div class="ig-tree {className}">
	{#if items.length}
		{#each items as item (item.id)}
			{@render renderNode(item, 0)}
		{/each}
	{:else}
		{@render children?.()}
	{/if}
</div>

<style>
	.ig-tree {
		display: flex;
		flex-direction: column;
		gap: 0;
		min-width: 0;
	}

	.ig-tree-node {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.ig-tree-children {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.ig-tree-row {
		display: flex;
		align-items: center;
		gap: var(--ig-item-inner-spacing);
		width: 100%;
		min-height: var(--ig-hit-min);
		padding:
			var(--ig-frame-padding-y)
			var(--ig-frame-padding-x);
		border: none;
		border-radius: var(--ig-frame-rounding);
		background: transparent;
		color: var(--ig-text);
		font-family: inherit;
		font-size: inherit;
		line-height: inherit;
		text-align: start;
		cursor: pointer;
		transition: background-color 120ms linear, color 120ms linear;
	}

	.ig-tree-row:hover:not(:disabled) {
		background: var(--ig-header-hovered);
	}

	.ig-tree-row:active:not(:disabled) {
		background: var(--ig-header-active);
	}

	.ig-tree-row.selected {
		background: var(--ig-header);
	}

	.ig-tree-row.selected:hover:not(:disabled) {
		background: var(--ig-header-hovered);
	}

	.ig-tree-row:disabled {
		color: var(--ig-text-disabled);
		cursor: default;
		opacity: var(--ig-disabled-alpha);
	}

	.ig-tree-arrow {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 1em;
		transform: rotate(-90deg);
		transition: transform 120ms linear;
	}

	.ig-tree-row.open .ig-tree-arrow {
		transform: rotate(0deg);
	}

	.ig-tree-icon {
		display: inline-flex;
		flex-shrink: 0;
		font-size: var(--ig-font-size-sm);
		opacity: 0.9;
	}

	.ig-tree-label {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
