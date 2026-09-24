<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements';
import { cn } from '../../utils/cn.js';

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
	value?: number;
	size?: number;
	min?: number;
	max?: number;
	class?: string;
	'aria-label'?: string;
}

let {
	value,
	size = 4,
	min = 0,
	max = 1,
	class: className,
	'aria-label': ariaLabel = 'Progress',
	...rest
}: Props = $props();

const determinate = $derived(typeof value === 'number' && Number.isFinite(value));
const clamped = $derived(determinate ? Math.min(max, Math.max(min, value as number)) : min);
const progress = $derived(max > min ? (clamped - min) / (max - min) : 0);
const ariaValue = $derived(determinate ? Math.round(progress * 100) : undefined);
</script>

<div
	class={cn('m3-linear', className)}
	role="progressbar"
	aria-label={ariaLabel}
	aria-valuemin={determinate ? 0 : undefined}
	aria-valuemax={determinate ? 100 : undefined}
	aria-valuenow={ariaValue}
	aria-valuetext={determinate ? `${ariaValue}%` : undefined}
	style:height={`${size}px`}
	{...rest}
>
	{#if determinate}
		<div
			class="m3-linear__fill"
			style:transform={`scaleX(${progress})`}
			aria-hidden="true"
		></div>
	{:else}
		<div class="m3-linear__indeterminate" aria-hidden="true"></div>
	{/if}
</div>

<style>
	.m3-linear {
		position: relative;
		width: 100%;
		height: 4px;
		overflow: hidden;
		border-radius: var(--m3-sys-shape-full);
		background: var(--m3-sys-surface-container-highest);
	}

	.m3-linear__fill {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: var(--m3-sys-primary);
		transform-origin: left center;
		transform: scaleX(0);
		transition: transform var(--m3-motion-spatial-default);
	}

	.m3-linear__indeterminate {
		position: absolute;
		inset-block: 0;
		left: 0;
		width: 30%;
		border-radius: inherit;
		background: var(--m3-sys-primary);
		transform-origin: left center;
		animation: m3-linear-indeterminate 2s var(--m3-easing-emphasized-decelerate) infinite;
	}

	@keyframes m3-linear-indeterminate {
		0% {
			transform: translateX(-110%) scaleX(0.5);
		}
		50% {
			transform: translateX(120%) scaleX(1);
		}
		100% {
			transform: translateX(340%) scaleX(0.5);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.m3-linear__indeterminate {
			animation: none;
			transform: translateX(40%) scaleX(0.6);
		}
	}

	@media (forced-colors: active) {
		.m3-linear {
			background: CanvasText;
		}
		.m3-linear__fill,
		.m3-linear__indeterminate {
			background: Highlight;
		}
	}
</style>
