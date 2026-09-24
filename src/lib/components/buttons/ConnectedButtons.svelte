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

	.m3-btn-group.connected :global(.m3-btn) {
		border-radius: 0;
		box-shadow: none;
	}

	.m3-btn-group.connected :global(.m3-btn:first-child) {
		border-start-start-radius: var(--m3-sys-shape-full);
		border-end-start-radius: var(--m3-sys-shape-full);
	}

	.m3-btn-group.connected :global(.m3-btn:last-child) {
		border-start-end-radius: var(--m3-sys-shape-full);
		border-end-end-radius: var(--m3-sys-shape-full);
	}

	.m3-btn-group.connected :global(.m3-btn + .m3-btn) {
		box-shadow: inset 1px 0 0 0 var(--m3-sys-outline-variant);
	}

	/* Stack vertically on compact widths when the group is wide */
	@media (max-width: 599px) {
		.m3-btn-group:global(.stack-compact) {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>
