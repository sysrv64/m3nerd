<script lang="ts">
	let {
		value,
		max = 1,
		overlay = true,
		class: className = '',
		'aria-label': ariaLabel,
		...rest
	}: {
		value?: number;
		max?: number;
		overlay?: boolean;
		class?: string;
		'aria-label'?: string;
		[key: string]: unknown;
	} = $props();

	const determinate = $derived(typeof value === 'number' && Number.isFinite(value));
	const clamped = $derived(
		determinate ? Math.min(max, Math.max(0, value as number)) : 0
	);
	const ratio = $derived(max > 0 ? clamped / max : 0);
	const pct = $derived(Math.round(ratio * 100));
</script>

<div
	class="ig-progress {className}"
	role="progressbar"
	aria-label={ariaLabel}
	aria-valuemin={determinate ? 0 : undefined}
	aria-valuemax={determinate ? max : undefined}
	aria-valuenow={determinate ? clamped : undefined}
	{...rest}
>
	{#if determinate}
		<div
			class="ig-progress-fill"
			style:transform={`scaleX(${ratio})`}
			aria-hidden="true"
		></div>
	{:else}
		<div class="ig-progress-indet" aria-hidden="true"></div>
	{/if}
	{#if overlay}
		<div class="ig-progress-overlay" aria-hidden="true">
			{#if determinate}{pct}%{/if}
		</div>
	{/if}
</div>

<style>
	.ig-progress {
		position: relative;
		width: 100%;
		height: var(--ig-frame-height);
		border: 1px solid var(--ig-border);
		background: var(--ig-frame-bg);
		border-radius: var(--ig-frame-rounding);
		overflow: hidden;
		box-sizing: border-box;
	}

	.ig-progress-fill {
		position: absolute;
		inset: 0;
		background: var(--ig-slider-grab);
		transform-origin: left center;
		transform: scaleX(0);
		transition: transform 120ms linear;
	}

	.ig-progress-indet {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		width: 30%;
		background: var(--ig-slider-grab);
		animation: ig-indet 1.2s linear infinite;
	}

	.ig-progress-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--ig-font-size-sm);
		line-height: 1;
		color: var(--ig-text);
		text-shadow: 0 1px 2px rgb(0 0 0 / 0.85);
		pointer-events: none;
	}

	@keyframes ig-indet {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(400%);
		}
	}
</style>
