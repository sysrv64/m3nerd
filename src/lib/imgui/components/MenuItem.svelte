<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	let {
		disabled = false,
		selected = false,
		shortcut = '',
		onclick,
		leading,
		children,
		class: className = '',
		...rest
	}: {
		disabled?: boolean;
		selected?: boolean;
		shortcut?: string;
		onclick?: MouseEventHandler<HTMLButtonElement>;
		leading?: Snippet;
		children?: Snippet;
		class?: string;
		[key: string]: unknown;
	} = $props();
</script>

<button
	type="button"
	role="menuitem"
	class="ig-menu-item ig-focus {selected ? 'selected' : ''} {className}"
	{disabled}
	data-selected={selected || undefined}
	{...rest}
	onclick={onclick}
>
	{#if leading}
		<span class="ig-menu-item-leading">{@render leading()}</span>
	{/if}
	<span class="ig-menu-item-label">{@render children?.()}</span>
	{#if shortcut}
		<span class="ig-menu-item-shortcut">{shortcut}</span>
	{/if}
</button>

<style>
	.ig-menu-item {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		min-height: var(--ig-frame-height);
		margin: 0;
		padding: 4px 12px;
		background: transparent;
		border: none;
		border-radius: var(--ig-frame-rounding);
		color: var(--ig-text);
		font-family: inherit;
		font-size: inherit;
		line-height: var(--ig-line-height);
		text-align: left;
		cursor: pointer;
		box-sizing: border-box;
		transition:
			background-color 120ms linear,
			color 120ms linear,
			opacity 120ms linear;
	}

	.ig-menu-item:hover:not(:disabled) {
		background: var(--ig-header);
	}

	.ig-menu-item.selected {
		color: var(--ig-text);
	}

	.ig-menu-item.selected::before {
		content: '✓';
		flex-shrink: 0;
		width: 1em;
		color: var(--ig-check-mark);
		font-size: var(--ig-font-size-sm);
		line-height: 1;
		text-align: center;
	}

	.ig-menu-item:disabled {
		color: var(--ig-text-disabled);
		cursor: default;
		opacity: var(--ig-disabled-alpha);
	}

	.ig-menu-item-leading {
		display: inline-flex;
		align-items: center;
		flex-shrink: 0;
	}

	.ig-menu-item-label {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.ig-menu-item-shortcut {
		margin-left: auto;
		flex-shrink: 0;
		color: var(--ig-text-disabled);
		font-family: var(--ig-font-mono);
		font-size: var(--ig-font-size-sm);
		line-height: var(--ig-line-height);
	}
</style>
