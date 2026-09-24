<script lang="ts">
	let {
		value = $bindable(0),
		min = 0,
		max = 100,
		step = 1,
		disabled = false,
		label = '',
		showValue = false,
		class: className = '',
		...rest
	}: {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		disabled?: boolean;
		label?: string;
		showValue?: boolean;
		class?: string;
		[key: string]: unknown;
	} = $props();

	const pct = $derived(
		max > min ? Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)) : 0
	);
</script>

<div class="ig-slider {className}" class:disabled>
	{#if label}
		<span class="ig-slider-label">{label}</span>
	{/if}
	<div class="ig-slider-row">
		<div class="ig-slider-wrap" style:--_p={pct + '%'}>
			<div class="ig-slider-track">
				<div class="ig-slider-fill"></div>
			</div>
			<div class="ig-slider-grab"></div>
			<input
				type="range"
				bind:value
				{min}
				{max}
				{step}
				{disabled}
				aria-label={label || undefined}
				{...rest}
			/>
		</div>
		{#if showValue}
			<span class="ig-slider-value">{value}</span>
		{/if}
	</div>
</div>

<style>
	.ig-slider {
		display: block;
		width: 100%;
	}

	.ig-slider.disabled {
		opacity: var(--ig-disabled-alpha);
		pointer-events: none;
	}

	.ig-slider-label {
		display: block;
		margin-bottom: 2px;
		color: var(--ig-text-disabled);
		font-size: var(--ig-font-size-sm);
		line-height: var(--ig-line-height);
	}

	.ig-slider-row {
		display: flex;
		align-items: center;
		gap: var(--ig-item-spacing-x);
		width: 100%;
	}

	.ig-slider-wrap {
		position: relative;
		display: block;
		flex: 1;
		min-width: 0;
		min-height: var(--ig-frame-height);
		padding-block: 10px;
		width: 100%;
	}

	.ig-slider-wrap:has(input:focus-visible) {
		outline: 1px solid var(--ig-nav-cursor);
		outline-offset: 2px;
	}

	.ig-slider-track {
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		height: 6px;
		background: var(--ig-frame-bg);
		border: 1px solid var(--ig-border);
		border-radius: var(--ig-grab-rounding);
		box-sizing: border-box;
		overflow: hidden;
	}

	.ig-slider-fill {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: var(--_p, 0%);
		background: var(--ig-slider-grab);
	}

	.ig-slider-grab {
		position: absolute;
		left: var(--_p, 0%);
		top: 50%;
		width: 12px;
		height: 12px;
		transform: translate(-50%, -50%);
		background: var(--ig-slider-grab);
		border-radius: var(--ig-grab-rounding);
		pointer-events: none;
		transition: background-color 120ms linear;
	}

	.ig-slider-wrap:hover .ig-slider-grab,
	.ig-slider-wrap:has(input:active) .ig-slider-grab {
		background: var(--ig-slider-grab-active);
	}

	.ig-slider-wrap input {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		margin: 0;
		opacity: 0;
		cursor: pointer;
		z-index: 2;
	}

	.ig-slider-wrap input:disabled {
		cursor: default;
	}

	.ig-slider-value {
		flex-shrink: 0;
		min-width: 3ch;
		color: var(--ig-text);
		font-family: var(--ig-font-mono);
		font-size: var(--ig-font-size-sm);
		line-height: var(--ig-line-height);
		text-align: right;
	}
</style>
