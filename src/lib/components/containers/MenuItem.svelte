<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { getContext } from 'svelte';
	import { cn } from '../../utils/cn.js';

	interface Props extends Omit<HTMLButtonAttributes, 'class' | 'children' | 'onselect'> {
		disabled?: boolean;
		selected?: boolean;
		onselect?: (e: MouseEvent) => void;
		leading?: Snippet;
		trailing?: Snippet;
		children?: Snippet;
		class?: string;
	}

	let {
		disabled = false,
		selected = false,
		onselect,
		leading,
		trailing,
		children,
		class: className,
		type = 'button',
		onclick,
		...rest
	}: Props = $props();

	const menu = getContext<{ close: () => void } | undefined>('m3-menu');

	function handleClick(e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		(onclick as ((e: MouseEvent) => void) | undefined)?.(e);
		onselect?.(e);
		menu?.close();
	}
</script>

<button
	role="menuitem"
	class={cn('m3-menu-item', 'm3-layer', 'm3-focus-inward', selected && 'selected', className)}
	{type}
	{disabled}
	data-selected={selected || undefined}
	{...rest}
	onclick={handleClick}
>
	{#if leading}
		<span class="m3-menu-item__leading">{@render leading()}</span>
	{/if}
	<span class="m3-menu-item__label">{@render children?.()}</span>
	{#if trailing}
		<span class="m3-menu-item__trailing">{@render trailing()}</span>
	{/if}
</button>

<style>
	.m3-menu-item {
		display: flex;
		align-items: center;
		gap: var(--m3-sys-space-3);
		width: 100%;
		height: 48px;
		padding-inline: var(--m3-sys-space-3);
		border: none;
		border-radius: 0;
		background: transparent;
		color: inherit;
		font: var(--m3-sys-typescale-label-large-weight) var(--m3-sys-typescale-label-large) /
			var(--m3-sys-typescale-label-large-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-label-large-tracking);
		text-align: start;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	.m3-menu-item:disabled {
		opacity: 0.38;
		cursor: default;
		pointer-events: none;
	}

	.m3-menu-item.selected {
		color: var(--m3-sys-primary);
	}

	.m3-menu-item__leading,
	.m3-menu-item__trailing {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		flex-shrink: 0;
	}

	.m3-menu-item__label {
		position: relative;
		z-index: 1;
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
