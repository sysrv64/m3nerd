<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title = '',
		open = $bindable(true),
		collapsible = true,
		collapsed = $bindable(false),
		glass = true,
		width,
		height,
		class: className = '',
		children,
		actions,
		...rest
	}: {
		title?: string;
		open?: boolean;
		collapsible?: boolean;
		collapsed?: boolean;
		glass?: boolean;
		width?: string | number;
		height?: string | number;
		class?: string;
		children?: Snippet;
		actions?: Snippet;
		[key: string]: unknown;
	} = $props();

	const isVisible = $derived(open && !collapsed);

	function toggle() {
		collapsed = !collapsed;
	}

	function dim(v: string | number | undefined): string | undefined {
		if (v === undefined) return undefined;
		return typeof v === 'number' ? `${v}px` : v;
	}
</script>

{#if open}
	<div
		class="ig-window {glass ? 'ig-glass' : ''} {className}"
		style:width={dim(width)}
		style:height={dim(height)}
		{...rest}
	>
	<div class="ig-titlebar">
		{#if collapsible}
			<button
				type="button"
				class="ig-collapse ig-focus"
				aria-expanded={!collapsed}
				aria-label={collapsed ? 'Expand' : 'Collapse'}
				onclick={toggle}
			>
				<span class="glyph" class:open={!collapsed} aria-hidden="true">▸</span>
			</button>
		{/if}
		<span class="ig-title">{title}</span>
		{#if actions}
			<div class="ig-actions">
				{@render actions()}
			</div>
		{/if}
	</div>
	{#if isVisible}
		<div class="ig-body">
			{@render children?.()}
		</div>
	{/if}
	</div>
{/if}

<style>
	.ig-window {
		border: 1px solid var(--ig-border);
		display: flex;
		flex-direction: column;
		max-width: 100%;
		border-radius: var(--ig-window-rounding);
		overflow: hidden;
		color: var(--ig-text);
	}

	.ig-titlebar {
		height: var(--ig-title-height);
		background: var(--ig-title-bg-active);
		display: flex;
		align-items: center;
		padding: 0 8px;
		gap: 8px;
		border-bottom: 1px solid var(--ig-border);
		flex-shrink: 0;
	}

	.ig-collapse {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		padding: 0;
		border: none;
		background: transparent;
		color: var(--ig-text);
		cursor: pointer;
		flex-shrink: 0;
	}

	.ig-collapse:hover {
		color: var(--ig-nav-cursor);
	}

	.glyph {
		display: inline-block;
		transform: rotate(90deg);
		transition: transform 120ms linear;
		font-size: var(--ig-font-size-sm);
		line-height: 1;
	}

	.glyph.open {
		transform: rotate(90deg);
	}

	.ig-title {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: var(--ig-font-size-sm);
	}

	.ig-actions {
		display: flex;
		align-items: center;
		gap: var(--ig-item-spacing-x);
		flex-shrink: 0;
		min-width: 0;
		max-width: 100%;
		overflow: hidden;
	}

	.ig-body {
		padding: var(--ig-window-padding);
		overflow: auto;
		flex: 1;
		min-height: 0;
	}
</style>
