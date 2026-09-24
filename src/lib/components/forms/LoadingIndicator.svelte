<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements';
import { cn } from '../../utils/cn.js';

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
	size?: number;
	class?: string;
	'aria-label'?: string;
}

let {
	size = 32,
	class: className,
	'aria-label': ariaLabel = 'Loading',
	...rest
}: Props = $props();
</script>

<div
	class={cn('m3-loading', className)}
	role="status"
	aria-label={ariaLabel}
	style:width={`${size}px`}
	style:height={`${size}px`}
	{...rest}
></div>

<style>
	.m3-loading {
		display: inline-block;
		width: 32px;
		height: 32px;
		border-radius: var(--m3-sys-shape-medium);
		background: var(--m3-sys-primary);
		animation: m3-loading-morph 1.4s linear infinite;
		will-change: transform, border-radius;
	}

	@keyframes m3-loading-morph {
		0% {
			border-radius: var(--m3-sys-shape-medium);
			transform: rotate(0deg) scale(1);
		}
		50% {
			border-radius: var(--m3-sys-shape-full);
			transform: rotate(180deg) scale(0.72);
		}
		100% {
			border-radius: var(--m3-sys-shape-medium);
			transform: rotate(360deg) scale(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.m3-loading {
			animation: none;
			border-radius: var(--m3-sys-shape-full);
		}
	}

	@media (forced-colors: active) {
		.m3-loading {
			background: Highlight;
		}
	}
</style>
