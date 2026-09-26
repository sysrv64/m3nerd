<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import { igSetActive, igSetHover } from '../runtime.svelte.js';

	let {
		variant = 'default',
		arrow,
		selected = false,
		disabled = false,
		onclick,
		class: className = '',
		children,
		...rest
	}: {
		variant?: 'default' | 'small';
		arrow?: 'up' | 'down' | 'left' | 'right';
		selected?: boolean;
		disabled?: boolean;
		onclick?: MouseEventHandler<HTMLButtonElement>;
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	} = $props();

	const id = $props.id();

	const arrowGlyph = $derived(
		arrow === 'up' ? '▲' : arrow === 'down' ? '▼' : arrow === 'left' ? '◀' : arrow === 'right' ? '▶' : ''
	);

	function handleEnter() {
		igSetHover(id);
	}

	function handleLeave() {
		igSetHover(null);
	}

	function handleDown() {
		if (disabled) return;
		igSetActive(id);
	}

	function handleUp() {
		igSetActive(null);
	}
</script>

<button
	type="button"
	class="ig-button ig-focus {variant === 'small' ? 'small' : ''} {selected ? 'selected' : ''} {className}"
	disabled={disabled}
	{...rest}
	onclick={onclick}
	onpointerenter={handleEnter}
	onpointerleave={handleLeave}
	onpointerdown={handleDown}
	onpointerup={handleUp}
	onpointerupcapture={handleUp}
	onpointercancel={handleUp}
>
	{#if arrow}
		<span class="arrow" aria-hidden="true">{arrowGlyph}</span>
	{/if}
	{@render children?.()}
</button>

<style>
	.ig-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--ig-item-inner-spacing);
		min-height: var(--ig-frame-height);
		padding: 4px 10px;
		background: var(--ig-button);
		color: var(--ig-text);
		border: 1px solid var(--ig-border);
		border-radius: var(--ig-frame-rounding);
		font-family: inherit;
		font-size: var(--ig-font-size);
		line-height: var(--ig-line-height);
		cursor: pointer;
		user-select: none;
		transition:
			background-color 120ms linear,
			color 120ms linear,
			border-color 120ms linear,
			opacity 120ms linear;
	}

	.ig-button:hover:not(:disabled) {
		background: var(--ig-button-hovered);
	}

	.ig-button:active:not(:disabled),
	.ig-button.selected {
		background: var(--ig-button-active);
	}

	.ig-button:disabled {
		opacity: var(--ig-disabled-alpha);
		cursor: default;
	}

	.ig-button.small {
		min-height: 0;
		padding: 1px 6px;
		font-size: var(--ig-font-size-sm);
	}

	.arrow {
		display: inline-block;
		line-height: 1;
		font-size: var(--ig-font-size-sm);
	}
</style>
