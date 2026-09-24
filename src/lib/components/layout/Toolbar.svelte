<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { cn } from '../../utils/cn.js';

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
	fixed?: 'top' | 'bottom' | false;
	elevated?: boolean;
	dense?: boolean;
	collapseCenter?: boolean;
	leading?: Snippet;
	center?: Snippet;
	trailing?: Snippet;
	children?: Snippet;
	class?: string;
}

let {
	fixed = false,
	elevated = false,
	dense = false,
	collapseCenter = true,
	leading,
	center,
	trailing,
	children,
	class: className,
	...rest
}: Props = $props();
</script>

<div
	class={cn(
		'm3-toolbar',
		dense && 'dense',
		elevated && 'elevated',
		collapseCenter && 'collapse-center',
		fixed && `fixed-${fixed}`,
		className
	)}
	{...rest}
>
	<div class="toolbar-leading">
		{@render leading?.()}
		{@render children?.()}
	</div>
	<div class="toolbar-center">{@render center?.()}</div>
	<div class="toolbar-trailing">{@render trailing?.()}</div>
</div>

<style>
	.m3-toolbar {
		display: flex;
		align-items: center;
		gap: 12px;
		height: 64px;
		padding-inline: 16px;
		background: var(--m3-sys-surface-container);
		color: var(--m3-sys-on-surface);
	}

	.m3-toolbar.dense {
		height: 52px;
		padding-inline: 16px;
		gap: 8px;
	}

	.m3-toolbar.elevated {
		box-shadow: var(--m3-sys-elevation-1);
	}

	.m3-toolbar.fixed-top {
		position: sticky;
		top: 0;
		z-index: 20;
	}

	.m3-toolbar.fixed-bottom {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 20;
	}

	.toolbar-leading {
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 0;
	}

	.toolbar-center {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 0;
	}

	.toolbar-trailing {
		display: flex;
		align-items: center;
		gap: 4px;
		margin-inline-start: auto;
	}

	@media (max-width: 599px) {
		.m3-toolbar.collapse-center .toolbar-center {
			display: none;
		}
	}
</style>
