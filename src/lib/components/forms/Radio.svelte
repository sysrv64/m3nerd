<script lang="ts">
import type { HTMLInputAttributes } from 'svelte/elements';
import { cn } from '../../utils/cn.js';

interface Props extends Omit<HTMLInputAttributes, 'class' | 'children' | 'type' | 'value'> {
	value: string;
	name?: string;
	checked?: boolean;
	label?: string;
	disabled?: boolean;
	class?: string;
}

let {
	value,
	name,
	checked = $bindable(false),
	label,
	disabled = false,
	class: className,
	...rest
}: Props = $props();

function handleChange(event: Event) {
	const input = event.currentTarget as HTMLInputElement;
	checked = input.checked;
	rest.onchange?.(event as Event & { currentTarget: EventTarget & HTMLInputElement });
}
</script>

<label class={cn('m3-radio', disabled && 'disabled', className)}>
	<input
		class="m3-radio__native"
		type="radio"
		{value}
		{name}
		checked={checked}
		{disabled}
		{...rest}
		onchange={handleChange}
	/>
	<span class="m3-radio__circle" aria-hidden="true">
		<span class="m3-radio__dot"></span>
	</span>
	{#if label}
		<span class="m3-radio__label">{label}</span>
	{/if}
</label>

<style>
	.m3-radio {
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

	.m3-radio.disabled {
		opacity: 0.38;
		pointer-events: none;
	}

	.m3-radio__native {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: 0;
		opacity: 0;
		pointer-events: none;
	}

	.m3-radio__circle {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		border: 2px solid var(--m3-sys-on-surface);
		border-radius: var(--m3-sys-shape-full);
		background: transparent;
		transition:
			border-color var(--m3-motion-fast),
			background-color var(--m3-motion-fast);
	}

	.m3-radio__native:checked + .m3-radio__circle {
		border-color: var(--m3-sys-primary);
	}

	.m3-radio__native:focus-visible + .m3-radio__circle {
		outline: 3px solid var(--m3-sys-primary);
		outline-offset: 2px;
	}

	.m3-radio__dot {
		width: 10px;
		height: 10px;
		border-radius: var(--m3-sys-shape-full);
		background: var(--m3-sys-primary);
		transform: scale(0);
		transition: transform var(--m3-motion-spatial-fast);
	}

	.m3-radio__native:checked + .m3-radio__circle .m3-radio__dot {
		transform: scale(1);
	}

	.m3-radio__label {
		pointer-events: none;
	}

	@media (forced-colors: active) {
		.m3-radio__circle {
			border-color: CanvasText;
		}
		.m3-radio__native:checked + .m3-radio__circle {
			border-color: Highlight;
		}
		.m3-radio__dot {
			background: Highlight;
		}
	}
</style>
