<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements';
import { cn } from '../../utils/cn.js';

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
	size?: number;
	class?: string;
	'aria-label'?: string;
}

let {
	size = 48,
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
>
	<span class="m3-loading__shape" aria-hidden="true"></span>
</div>

<style>
	.m3-loading {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.m3-loading__shape {
		display: block;
		width: 100%;
		height: 100%;
		background: var(--m3-sys-primary);
		animation: m3-loading-morph 1.6s linear infinite;
	}

	@keyframes m3-loading-morph {
		0% {
			border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
			transform: rotate(0deg) scale(1);
		}
		14% {
			border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%;
			transform: rotate(45deg) scale(0.88);
		}
		28% {
			border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%;
			transform: rotate(90deg) scale(1);
		}
		42% {
			border-radius: 50%;
			transform: rotate(135deg) scale(0.82);
		}
		57% {
			border-radius: 30% 70% 30% 70% / 70% 30% 70% 30%;
			transform: rotate(180deg) scale(1);
		}
		71% {
			border-radius: 50%;
			transform: rotate(225deg) scale(0.88);
		}
		85% {
			border-radius: 70% 30% 70% 30% / 30% 70% 30% 70%;
			transform: rotate(270deg) scale(1);
		}
		100% {
			border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
			transform: rotate(360deg) scale(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.m3-loading__shape {
			animation: none;
			border-radius: var(--m3-sys-shape-full);
		}
	}

	@media (forced-colors: active) {
		.m3-loading__shape {
			background: Highlight;
		}
	}
</style>
