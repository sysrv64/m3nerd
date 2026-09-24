<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { cn } from '../../utils/cn.js';

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
	/** true = inset from list edges; false = full-bleed (default). */
	inset?: boolean;
	class?: string;
	children?: Snippet;
	/** Text alternative for the separator. */
	label?: string;
}

let { inset = false, class: className, children, label, ...rest }: Props = $props();
</script>

<div
	class={cn('m3-divider', inset && 'inset', className)}
	role="separator"
	aria-label={label}
	aria-orientation="horizontal"
	{...rest}
></div>

<style>
	.m3-divider {
		height: 1px;
		background: var(--m3-sys-outline-variant);
		border: none;
		flex-shrink: 0;
	}
	.inset {
		margin-inline: var(--m3-sys-space-4);
		width: auto;
	}
</style>
