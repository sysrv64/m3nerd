<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements';

	let {
		checked = $bindable(false),
		label = '',
		disabled = false,
		name,
		id,
		onchange,
		class: className = '',
		...rest
	}: {
		checked?: boolean;
		label?: string;
		disabled?: boolean;
		name?: string;
		id?: string;
		onchange?: ChangeEventHandler<HTMLInputElement>;
		class?: string;
		[key: string]: unknown;
	} = $props();
</script>

<label class="ig-checkbox {className}" class:disabled>
	<input
		type="checkbox"
		{...rest}
		{name}
		{id}
		bind:checked
		{disabled}
		{onchange}
	/>
	<span class="box" aria-hidden="true"></span>
	{#if label}
		<span class="label-text">{label}</span>
	{/if}
</label>

<style>
	.ig-checkbox {
		display: flex;
		align-items: center;
		gap: 4px;
		min-height: var(--ig-frame-height);
		cursor: pointer;
		color: var(--ig-text);
		font-size: var(--ig-font-size);
		line-height: var(--ig-line-height);
		user-select: none;
	}

	.ig-checkbox.disabled {
		opacity: var(--ig-disabled-alpha);
		cursor: default;
	}

	input {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
		margin: 0;
		pointer-events: none;
	}

	.box {
		position: relative;
		width: 14px;
		height: 14px;
		font-size: 14px;
		flex-shrink: 0;
		border: 1px solid var(--ig-border);
		background: var(--ig-frame-bg);
		border-radius: var(--ig-frame-rounding);
		transition:
			background-color 120ms linear,
			border-color 120ms linear;
	}

	input:checked + .box {
		background: var(--ig-frame-bg-active);
		border-color: var(--ig-nav-cursor);
	}

	.box::after {
		content: '✓';
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--ig-check-mark);
		font-size: 11px;
		line-height: 1;
		opacity: 0;
		transition: opacity 120ms linear;
	}

	input:checked + .box::after {
		opacity: 1;
	}

	input:focus-visible + .box {
		outline: 1px solid var(--ig-nav-cursor);
		outline-offset: 1px;
	}

	.label-text {
		min-width: 0;
	}
</style>
