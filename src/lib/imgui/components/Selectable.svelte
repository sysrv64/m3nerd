<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import { igSetActive, igSetHover } from '../runtime.svelte.js';

	let {
		selected = $bindable(false),
		disabled = false,
		onclick,
		class: className = '',
		children,
		...rest
	}: {
		selected?: boolean;
		disabled?: boolean;
		onclick?: MouseEventHandler<HTMLButtonElement>;
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	} = $props();

	const id = $props.id();

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

	function handleClick(e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		if (disabled) return;
		if (!onclick) selected = !selected;
		onclick?.(e);
	}
</script>

<button
	type="button"
	class="ig-selectable ig-focus {selected ? 'selected' : ''} {className}"
	disabled={disabled}
	aria-pressed={selected}
	{...rest}
	onclick={handleClick}
	onpointerenter={handleEnter}
	onpointerleave={handleLeave}
	onpointerdown={handleDown}
	onpointerup={handleUp}
	onpointerupcapture={handleUp}
	onpointercancel={handleUp}
>
	{@render children?.()}
</button>

<style>
	.ig-selectable {
		display: flex;
		width: 100%;
		text-align: left;
		padding: 4px 8px;
		min-height: var(--ig-frame-height);
		background: transparent;
		border: none;
		color: var(--ig-text);
		font-family: inherit;
		font-size: var(--ig-font-size);
		line-height: var(--ig-line-height);
		cursor: pointer;
		align-items: center;
		box-sizing: border-box;
		transition:
			background-color 120ms linear,
			color 120ms linear,
			opacity 120ms linear;
	}

	.ig-selectable:hover:not(:disabled):not(.selected) {
		background: var(--ig-header-hovered);
	}

	.ig-selectable.selected {
		background: var(--ig-header);
	}

	.ig-selectable:active:not(:disabled) {
		background: var(--ig-header-active);
	}

	.ig-selectable:disabled {
		opacity: var(--ig-disabled-alpha);
		cursor: default;
	}
</style>
