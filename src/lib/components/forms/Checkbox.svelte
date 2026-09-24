<script lang="ts">
import type { HTMLInputAttributes } from 'svelte/elements';
import { cn } from '../../utils/cn.js';

interface Props extends Omit<HTMLInputAttributes, 'class' | 'children' | 'type' | 'checked'> {
	checked?: boolean;
	label?: string;
	disabled?: boolean;
	indeterminate?: boolean;
	class?: string;
	name?: string;
}

let {
	checked = $bindable(false),
	label,
	disabled = false,
	indeterminate = false,
	class: className,
	name,
	...rest
}: Props = $props();

let inputEl: HTMLInputElement | undefined = $state();

$effect(() => {
	if (inputEl) inputEl.indeterminate = indeterminate;
});
</script>

<label class={cn('m3-checkbox', disabled && 'disabled', className)}>
	<input
		bind:this={inputEl}
		class="m3-checkbox__native"
		type="checkbox"
		bind:checked
		{disabled}
		{name}
		aria-checked={indeterminate ? 'mixed' : undefined}
		{...rest}
	/>
	<span class="m3-checkbox__box" aria-hidden="true">
		<svg class="m3-checkbox__mark" viewBox="0 0 18 18" fill="none">
			{#if indeterminate}
				<path class="dash" d="M4 9h10" pathLength="100" />
			{:else}
				<path class="check" d="M3.75 9.25 7.25 12.75 14.25 5.75" pathLength="100" />
			{/if}
		</svg>
	</span>
	{#if label}
		<span class="m3-checkbox__label">{label}</span>
	{/if}
</label>

<style>
	.m3-checkbox {
		--_size: 18px;
		--_shape: 2px;
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 12px;
		min-height: var(--m3-touch-target);
		padding-inline: 10px;
		color: var(--m3-sys-on-surface);
		font: var(--m3-sys-typescale-body-large-weight) var(--m3-sys-typescale-body-large) /
			var(--m3-sys-typescale-body-large-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-body-large-tracking);
		cursor: pointer;
		user-select: none;
	}

	.m3-checkbox.disabled {
		pointer-events: none;
		color: var(--m3-sys-on-surface);
	}

	.m3-checkbox.disabled .m3-checkbox__box,
	.m3-checkbox.disabled .m3-checkbox__label {
		opacity: 0.38;
	}

	.m3-checkbox__native {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: 0;
		opacity: 0;
		pointer-events: none;
	}

	.m3-checkbox__box {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--_size);
		height: var(--_size);
		flex-shrink: 0;
		border: 2px solid var(--m3-sys-on-surface);
		border-radius: var(--_shape);
		background: transparent;
		color: var(--m3-sys-on-surface);
		transition:
			background-color var(--m3-motion-fast),
			border-color var(--m3-motion-fast),
			color var(--m3-motion-fast);
	}

	.m3-checkbox__box::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 40px;
		height: 40px;
		border-radius: var(--m3-sys-shape-full);
		background: currentColor;
		opacity: 0;
		pointer-events: none;
		transform: translate(-50%, -50%);
		transition: opacity var(--m3-motion-fast);
	}

	.m3-checkbox:hover:not(.disabled) .m3-checkbox__box::before {
		opacity: 0.08;
	}

	.m3-checkbox:active:not(.disabled) .m3-checkbox__box::before {
		opacity: 0.1;
	}

	.m3-checkbox__native:checked + .m3-checkbox__box,
	.m3-checkbox__native:indeterminate + .m3-checkbox__box {
		background: var(--m3-sys-primary);
		border-color: var(--m3-sys-primary);
		color: var(--m3-sys-on-primary);
	}

	.m3-checkbox__native:focus-visible + .m3-checkbox__box {
		outline: 3px solid var(--m3-sys-primary);
		outline-offset: 2px;
	}

	.m3-checkbox__mark {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.m3-checkbox__mark path {
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
		fill: none;
	}

	.m3-checkbox__mark .check {
		stroke-dasharray: 100;
		stroke-dashoffset: 100;
		stroke-linecap: butt;
		opacity: 0;
		transition:
			stroke-dashoffset var(--m3-motion-default),
			opacity var(--m3-motion-fast);
	}

	.m3-checkbox__native:checked + .m3-checkbox__box .check {
		stroke-dashoffset: 0;
		stroke-linecap: round;
		opacity: 1;
	}

	.m3-checkbox__mark .dash {
		stroke-dasharray: 100;
		stroke-dashoffset: 100;
		stroke-linecap: butt;
		opacity: 0;
		transition:
			stroke-dashoffset var(--m3-motion-default),
			opacity var(--m3-motion-fast);
	}

	.m3-checkbox__native:indeterminate + .m3-checkbox__box .dash {
		stroke-dashoffset: 40;
		stroke-linecap: round;
		opacity: 1;
	}

	.m3-checkbox__label {
		pointer-events: none;
	}

	@media (forced-colors: active) {
		.m3-checkbox__box {
			border-color: CanvasText;
		}
		.m3-checkbox__native:checked + .m3-checkbox__box,
		.m3-checkbox__native:indeterminate + .m3-checkbox__box {
			background: Highlight;
			border-color: Highlight;
			color: HighlightText;
		}
	}
</style>
