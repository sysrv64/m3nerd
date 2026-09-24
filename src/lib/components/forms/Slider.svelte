<script lang="ts">
import type { HTMLInputAttributes } from 'svelte/elements';
import { cn } from '../../utils/cn.js';

interface Props extends Omit<HTMLInputAttributes, 'class' | 'children' | 'value' | 'min' | 'max' | 'step'> {
	value?: number;
	min?: number;
	max?: number;
	step?: number;
	disabled?: boolean;
	discrete?: boolean;
	class?: string;
	'aria-label'?: string;
}

let {
	value = $bindable(0),
	min = 0,
	max = 100,
	step = 1,
	disabled = false,
	discrete = false,
	class: className,
	...rest
}: Props = $props();

const percent = $derived(max > min ? ((value - min) / (max - min)) * 100 : 0);
const tickCount = $derived(discrete && step > 0 ? Math.floor((max - min) / step) + 1 : 0);
const ticks = $derived(tickCount > 0 ? Array.from({ length: tickCount }, (_, i) => i) : []);
</script>

<div class={cn('m3-slider', disabled && 'disabled', className)}>
	<input
		class="m3-slider__input"
		type="range"
		bind:value
		{min}
		{max}
		{step}
		{disabled}
		style:--_active={`${percent}%`}
		{...rest}
	/>
	{#if discrete && ticks.length > 0}
		<div class="m3-slider__ticks" aria-hidden="true">
			{#each ticks as tick (tick)}
				<span
					class="m3-slider__tick"
					style:left={`${(tick / Math.max(1, ticks.length - 1)) * 100}%`}
				></span>
			{/each}
		</div>
	{/if}
</div>

<style>
	.m3-slider {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		min-height: var(--m3-touch-target);
		justify-content: center;
		padding-block: 8px;
	}

	.m3-slider.disabled {
		opacity: 0.38;
		pointer-events: none;
	}

	.m3-slider__input {
		--_track-h: 4px;
		--_active: 0%;
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: var(--m3-touch-target);
		margin: 0;
		background: transparent;
		cursor: pointer;
		outline: none;
	}

	.m3-slider__input:disabled {
		cursor: default;
	}

	.m3-slider__input::-webkit-slider-runnable-track {
		height: var(--_track-h);
		border-radius: var(--m3-sys-shape-full);
		background: linear-gradient(
			to right,
			var(--m3-sys-primary) 0 var(--_active),
			var(--m3-sys-surface-container-highest) var(--_active) 100%
		);
	}

	.m3-slider__input::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		margin-top: calc((var(--_track-h) - 20px) / 2);
		border: none;
		border-radius: var(--m3-sys-shape-full);
		background: var(--m3-sys-primary);
		transform: scale(1);
		transition:
			transform var(--m3-motion-fast),
			background-color var(--m3-motion-fast);
	}

	.m3-slider__input:hover::-webkit-slider-thumb,
	.m3-slider__input:focus-visible::-webkit-slider-thumb,
	.m3-slider__input:active::-webkit-slider-thumb {
		transform: scale(1.25);
	}

	.m3-slider__input:focus-visible::-webkit-slider-thumb {
		outline: 3px solid var(--m3-sys-primary);
		outline-offset: 2px;
	}

	.m3-slider__input::-moz-range-track {
		height: var(--_track-h);
		border-radius: var(--m3-sys-shape-full);
		background: var(--m3-sys-surface-container-highest);
	}

	.m3-slider__input::-moz-range-progress {
		height: var(--_track-h);
		border-radius: var(--m3-sys-shape-full);
		background: var(--m3-sys-primary);
	}

	.m3-slider__input::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border: none;
		border-radius: var(--m3-sys-shape-full);
		background: var(--m3-sys-primary);
		transform: scale(1);
		transition:
			transform var(--m3-motion-fast),
			background-color var(--m3-motion-fast);
	}

	.m3-slider__input:hover::-moz-range-thumb,
	.m3-slider__input:focus-visible::-moz-range-thumb,
	.m3-slider__input:active::-moz-range-thumb {
		transform: scale(1.25);
	}

	.m3-slider__input:focus-visible::-moz-range-thumb {
		outline: 3px solid var(--m3-sys-primary);
		outline-offset: 2px;
	}

	.m3-slider__ticks {
		position: relative;
		height: 12px;
		margin-top: -4px;
		pointer-events: none;
	}

	.m3-slider__tick {
		position: absolute;
		top: 0;
		width: 2px;
		height: 6px;
		margin-inline-start: -1px;
		border-radius: var(--m3-sys-shape-full);
		background: var(--m3-sys-outline);
	}

	@media (forced-colors: active) {
		.m3-slider__input::-webkit-slider-runnable-track {
			background: CanvasText;
		}
		.m3-slider__input::-webkit-slider-thumb {
			background: Highlight;
		}
		.m3-slider__input::-moz-range-track {
			background: CanvasText;
		}
		.m3-slider__input::-moz-range-progress {
			background: Highlight;
		}
		.m3-slider__input::-moz-range-thumb {
			background: Highlight;
		}
	}
</style>
