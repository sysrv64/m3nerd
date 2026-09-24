<script lang="ts">
	let {
		value = $bindable(''),
		type = 'text',
		placeholder = '',
		disabled = false,
		mono = false,
		label = '',
		class: className = '',
		...rest
	}: {
		value?: string;
		type?: string;
		placeholder?: string;
		disabled?: boolean;
		mono?: boolean;
		label?: string;
		class?: string;
		[key: string]: unknown;
	} = $props();

	const uid = $props.id();
</script>

<div class="ig-input {className}">
	{#if label}
		<label class="ig-input-label" for={uid}>{label}</label>
	{/if}
	<input
		id={uid}
		{type}
		{placeholder}
		{disabled}
		class:mono
		class="ig-focus"
		bind:value
		{...rest}
	/>
</div>

<style>
	.ig-input {
		display: block;
		width: 100%;
		min-width: 0;
	}

	.ig-input-label {
		display: block;
		margin-bottom: 2px;
		color: var(--ig-text-disabled);
		font-size: var(--ig-font-size-sm);
		line-height: var(--ig-line-height);
	}

	.ig-input input {
		display: block;
		width: 100%;
		min-height: var(--ig-frame-height);
		margin: 0;
		padding: var(--ig-frame-padding-y) var(--ig-frame-padding-x);
		background: var(--ig-frame-bg);
		border: 1px solid var(--ig-border);
		border-radius: var(--ig-frame-rounding);
		color: var(--ig-text);
		font-family: inherit;
		font-size: inherit;
		line-height: var(--ig-line-height);
		box-sizing: border-box;
		transition:
			background-color 120ms linear,
			border-color 120ms linear;
	}

	.ig-input input.mono {
		font-family: var(--ig-font-mono);
	}

	.ig-input input:hover:not(:disabled) {
		background: var(--ig-frame-bg-hovered);
	}

	.ig-input input:focus {
		background: var(--ig-frame-bg-active);
		border-color: var(--ig-nav-cursor);
		outline: none;
	}

	.ig-input input:focus-visible {
		outline: none;
	}

	.ig-input input:disabled {
		opacity: var(--ig-disabled-alpha);
		cursor: default;
	}

	.ig-input input::placeholder {
		color: var(--ig-text-disabled);
		opacity: 1;
	}

	.ig-input input[type='number'] {
		-moz-appearance: textfield;
		appearance: textfield;
	}

	.ig-input input[type='number']::-webkit-inner-spin-button,
	.ig-input input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
