<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { cn } from '../../utils/cn.js';

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
	/** Visual connection mode for segmented-style groups. */
	connected?: boolean;
	class?: string;
	children?: Snippet;
	/** Accessible name for the group. */
	label?: string;
}

let { connected = true, class: className, children, label, ...rest }: Props = $props();
</script>

<div
	class={cn('m3-btn-group', connected && 'connected', className)}
	role="group"
	aria-label={label}
	{...rest}
>
	{@render children?.()}
</div>

<style>
	.m3-btn-group {
		display: inline-flex;
		align-items: center;
	}

	.m3-btn-group.connected {
		display: inline-grid;
		grid-auto-flow: column;
		gap: 0.125rem;
		background: var(--m3-sys-outline-variant);
		border-radius: var(--m3-sys-shape-full);
		overflow: hidden;
	}

	.m3-btn-group.connected :global(.m3-btn) {
		border-radius: 0;
		box-shadow: none;
	}

	/* Stack vertically on compact widths when the group is wide */
	@media (max-width: 599px) {
		.m3-btn-group:global(.stack-compact) {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>
