<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements';

	let {
		checked = $bindable(false),
		group = $bindable<string | undefined>(undefined),
		name,
		value,
		label = '',
		disabled = false,
		id,
		onchange,
		class: className = '',
		...rest
	}: {
		checked?: boolean;
		group?: string;
		name?: string;
		value?: string;
		label?: string;
		disabled?: boolean;
		id?: string;
		onchange?: ChangeEventHandler<HTMLInputElement>;
		class?: string;
		[key: string]: unknown;
	} = $props();

	const isChecked = $derived(
		group !== undefined && value !== undefined ? group === value : checked
	);

	function handleChange(e: Event) {
		const el = e.currentTarget as HTMLInputElement;
		if (el.checked) {
			if (value !== undefined) group = value;
			checked = true;
		} else {
			checked = false;
		}
		onchange?.(e as Parameters<ChangeEventHandler<HTMLInputElement>>[0]);
	}
</script>

<label class="ig-radio {className}" class:disabled>
	<input
		type="radio"
		{...rest}
		{name}
		{value}
		{id}
		checked={isChecked}
		{disabled}
		onchange={handleChange}
	/>
	<span class="box" aria-hidden="true"></span>
	{#if label}
		<span class="label-text">{label}</span>
	{/if}
</label>

<style>
	.ig-radio {
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

	.ig-radio.disabled {
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
		border-radius: 50%;
		transition:
			background-color 120ms linear,
			border-color 120ms linear;
	}

	input:checked + .box {
		background: var(--ig-frame-bg-active);
		border-color: var(--ig-nav-cursor);
	}

	.box::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 6px;
		height: 6px;
		margin: -3px 0 0 -3px;
		border-radius: 50%;
		background: var(--ig-check-mark);
		opacity: 0;
		transform: scale(0.5);
		transition:
			opacity 120ms linear,
			transform 120ms linear;
	}

	input:checked + .box::after {
		opacity: 1;
		transform: scale(1);
	}

	input:focus-visible + .box {
		outline: 1px solid var(--ig-nav-cursor);
		outline-offset: 1px;
	}

	.label-text {
		min-width: 0;
	}
</style>
