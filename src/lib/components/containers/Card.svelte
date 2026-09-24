<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { cn } from '../../utils/cn.js';

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
	variant?: 'elevated' | 'filled' | 'outlined' | 'tonal';
	/** Renders interactive card when provided (whole-card click target). */
	onclick?: (e: MouseEvent) => void;
	/** Heading level for semantic cards with headings. */
	as?: 'div' | 'article' | 'a' | 'button';
	href?: string;
	class?: string;
	children?: Snippet;
}

let {
	variant = 'elevated',
	onclick,
	as,
	href,
	class: className,
	children,
	...rest
}: Props = $props();

const tag = $derived(as ?? (href ? 'a' : onclick ? 'button' : 'div'));
const interactive = $derived(tag === 'button' || tag === 'a' || Boolean(onclick));
</script>

<svelte:element
	this={tag}
	class={cn('m3-card', `v-${variant}`, interactive && 'interactive', interactive && 'm3-layer', className)}
	{href}
	onclick={tag === 'button' || tag === 'a' ? undefined : onclick}
	type={tag === 'button' ? 'button' : undefined}
	{...rest}
>
	{@render children?.()}
</svelte:element>

<style>
	.m3-card {
		--_shape: var(--m3-sys-shape-medium);
		--_bg: var(--m3-sys-surface-container-low);
		--_fg: var(--m3-sys-on-surface);
		position: relative;
		display: block;
		width: 100%;
		padding: 0;
		border: none;
		border-radius: var(--_shape);
		background: var(--_bg);
		color: var(--_fg);
		text-align: start;
		text-decoration: none;
		transition: transform var(--m3-motion-spatial-fast);
	}

	.v-elevated {
		box-shadow: var(--m3-sys-elevation-1);
	}
	.v-filled {
		--_bg: var(--m3-sys-surface-container-highest);
		--_fg: var(--m3-sys-on-surface);
	}
	.v-outlined {
		--_bg: var(--m3-sys-surface);
		box-shadow: inset 0 0 0 1px var(--m3-sys-outline-variant);
	}
	.v-tonal {
		--_bg: var(--m3-sys-surface-container-highest);
		--_fg: var(--m3-sys-on-surface);
	}

	.interactive {
		cursor: pointer;
	}
	.v-elevated.interactive:hover {
		box-shadow: var(--m3-sys-elevation-2);
	}
	.interactive:active {
		transform: scale(0.985);
	}
</style>
