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
	size = 48,
	min = 0,
	max = 1,
	class: className,
	'aria-label': ariaLabel = 'Progress',
	...rest
}: Props = $props();

const determinate = $derived(typeof value === 'number' && Number.isFinite(value));
const clamped = $derived(determinate ? Math.min(max, Math.max(min, value as number)) : min);
const progress = $derived(max > min ? (clamped - min) / (max - min) : 0);

const R = 45;
const C = 2 * Math.PI * R;
const dashoffset = $derived(C * (1 - progress));
const ariaValue = $derived(
	determinate ? Math.round(progress * 100) : undefined
);
</script>

<div
	class={cn('m3-circular', className)}
	role="progressbar"
	aria-label={ariaLabel}
	aria-valuemin={determinate ? 0 : undefined}
	aria-valuemax={determinate ? 100 : undefined}
	aria-valuenow={ariaValue}
	aria-valuetext={determinate ? `${ariaValue}%` : undefined}
	{...rest}
>
	<svg
		class="m3-circular__svg"
		width={size}
		height={size}
		viewBox="0 0 100 100"
		aria-hidden="true"
	>
		<circle class="m3-circular__track" cx="50" cy="50" r={R} />
		<g class="m3-circular__spin" class:spinning={!determinate}>
			<circle
				class="m3-circular__indicator"
				cx="50"
				cy="50"
				r={R}
				style:stroke-dasharray={determinate ? `${C}` : `${C * 0.25} ${C * 0.75}`}
				style:stroke-dashoffset={determinate ? `${dashoffset}` : '0'}
			/>
		</g>
	</svg>
</div>

<style>
	.m3-circular {
		display: inline-flex;
		color: var(--m3-sys-primary);
	}

	.m3-circular__svg {
		display: block;
		overflow: visible;
	}

	.m3-circular__track,
	.m3-circular__indicator {
		fill: none;
		stroke-width: 10;
		stroke-linecap: round;
	}

	.m3-circular__track {
		stroke: var(--m3-sys-secondary-container);
	}

	.m3-circular__indicator {
		stroke: currentColor;
		transform: rotate(-90deg);
		transform-origin: center;
		transition: stroke-dashoffset var(--m3-motion-spatial-default);
	}

	.m3-circular__spin.spinning {
		transform-origin: center;
		animation: m3-circular-spin 1.6s linear infinite;
	}

	@keyframes m3-circular-spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.m3-circular__spin.spinning {
			animation-play-state: paused;
		}
	}

	@media (forced-colors: active) {
		.m3-circular__track {
			stroke: CanvasText;
		}
		.m3-circular__indicator {
			stroke: Highlight;
		}
	}
</style>
