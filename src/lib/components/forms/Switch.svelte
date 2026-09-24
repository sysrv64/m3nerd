<script lang="ts">
import type { HTMLInputAttributes } from 'svelte/elements';
import { cn } from '../../utils/cn.js';

interface Props extends Omit<HTMLInputAttributes, 'class' | 'children' | 'type' | 'checked'> {
	checked?: boolean;
	label?: string;
	disabled?: boolean;
	class?: string;
	name?: string;
}

let {
	checked = $bindable(false),
	label,
	disabled = false,
	class: className,
	name,
	...rest
}: Props = $props();
</script>

<label class={cn('m3-switch', disabled && 'disabled', className)}>
	<input
		class="m3-switch__native"
		type="checkbox"
		role="switch"
		bind:checked
		{disabled}
		{name}
		{...rest}
	/>
	<span class="m3-switch__track" aria-hidden="true">
		<span class="m3-switch__thumb"></span>
	</span>
	{#if label}
		<span class="m3-switch__label">{label}</span>
	{/if}
</label>

<style>
	.m3-switch {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 12px;
		min-height: var(--m3-touch-target);
		padding-inline: 12px;
		color: var(--m3-sys-on-surface);
		font: var(--m3-sys-typescale-body-large-weight) var(--m3-sys-typescale-body-large) /
			var(--m3-sys-typescale-body-large-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-body-large-tracking);
		cursor: pointer;
		user-select: none;
	}

	.m3-switch.disabled {
		pointer-events: none;
	}

	.m3-switch.disabled .m3-switch__label {
		opacity: 0.38;
	}

	.m3-switch__native {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: 0;
		opacity: 0;
		pointer-events: none;
	}

	.m3-switch__track {
		position: relative;
		display: inline-flex;
		align-items: center;
		width: 52px;
		height: 32px;
		flex-shrink: 0;
		border: 2px solid var(--m3-sys-outline);
		border-radius: var(--m3-sys-shape-full);
		background: var(--m3-sys-surface-container-highest);
		box-sizing: border-box;
		transition:
			background-color var(--m3-motion-fast),
			border-color var(--m3-motion-fast);
	}

	.m3-switch__native:checked + .m3-switch__track {
		background: var(--m3-sys-primary);
		border-color: var(--m3-sys-primary);
	}

	.m3-switch__native:focus-visible + .m3-switch__track {
		outline: 3px solid var(--m3-sys-primary);
		outline-offset: 2px;
	}

	.m3-switch__thumb {
		position: absolute;
		top: 50%;
		left: 2px;
		width: 24px;
		height: 24px;
		margin: 0;
		border-radius: var(--m3-sys-shape-full);
		background: var(--m3-sys-on-surface-variant);
		box-sizing: border-box;
		transform: translateY(-50%) scale(0.667);
		transform-origin: center;
		transition: transform var(--m3-motion-spatial-fast);
	}

	.m3-switch__native:checked + .m3-switch__track .m3-switch__thumb {
		background: var(--m3-sys-on-primary);
		transform: translateY(-50%) translateX(20px) scale(1);
	}

	.m3-switch:active:not(.disabled) .m3-switch__thumb {
		transform: translateY(-50%) scale(0.8);
	}

	.m3-switch:active:not(.disabled)
		.m3-switch__native:checked
		+ .m3-switch__track
		.m3-switch__thumb {
		transform: translateY(-50%) translateX(20px) scale(1.167);
	}

	.m3-switch__thumb::after {
		content: '';
		position: absolute;
		inset: -4px;
		border-radius: inherit;
		background: currentColor;
		opacity: 0;
		pointer-events: none;
		transition: opacity var(--m3-motion-fast);
	}

	.m3-switch:hover:not(.disabled) .m3-switch__thumb::after {
		opacity: 0.08;
	}

	.m3-switch:active:not(.disabled) .m3-switch__thumb::after {
		opacity: 0.12;
	}

	.m3-switch.disabled .m3-switch__track,
	.m3-switch.disabled .m3-switch__native:checked + .m3-switch__track {
		background: color-mix(in srgb, var(--m3-sys-on-surface) 12%, transparent);
		border-color: color-mix(in srgb, var(--m3-sys-on-surface) 12%, transparent);
	}

	.m3-switch.disabled .m3-switch__thumb,
	.m3-switch.disabled
		.m3-switch__native:checked
		+ .m3-switch__track
		.m3-switch__thumb {
		background: color-mix(in srgb, var(--m3-sys-on-surface) 38%, transparent);
	}

	.m3-switch__label {
		pointer-events: none;
	}

	@media (forced-colors: active) {
		.m3-switch__track {
			border-color: CanvasText;
		}
		.m3-switch__native:checked + .m3-switch__track {
			background: Highlight;
			border-color: Highlight;
		}
		.m3-switch__thumb {
			background: HighlightText;
		}
	}
</style>
