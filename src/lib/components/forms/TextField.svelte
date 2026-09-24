<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';
import { cn } from '../../utils/cn.js';

type Variant = 'filled' | 'outlined';

interface Props extends Omit<HTMLInputAttributes, 'class' | 'children' | 'value' | 'type'> {
	variant?: Variant;
	multiline?: boolean;
	label?: string;
	value?: string;
	type?: string;
	disabled?: boolean;
	invalid?: boolean;
	supportingText?: string;
	leadingIcon?: Snippet;
	trailingIcon?: Snippet;
	class?: string;
	rows?: number;
}

let instanceCounter = 0;

let {
	variant = 'outlined',
	multiline = false,
	label = '',
	value = $bindable(''),
	type = 'text',
	disabled = false,
	invalid = false,
	supportingText,
	leadingIcon,
	trailingIcon,
	class: className,
	rows = 3,
	...rest
}: Props = $props();

const uid = ++instanceCounter;
const fieldId = $derived(rest.id ?? `m3-tf-${uid}`);
const supportId = $derived(`${fieldId}-support`);

let focused = $state(false);
const floated = $derived(focused || value.length > 0);

const textareaProps = $derived(rest as unknown as HTMLTextareaAttributes);

function handleFocus(event: Event) {
	focused = true;
	(rest.onfocus as unknown as ((e: Event) => void) | null | undefined)?.(event);
}

function handleBlur(event: Event) {
	focused = false;
	(rest.onblur as unknown as ((e: Event) => void) | null | undefined)?.(event);
}
</script>

<div
	class={cn(
		'm3-text-field',
		`v-${variant}`,
		multiline && 'multiline',
		invalid && 'invalid',
		disabled && 'disabled',
		className
	)}
>
	<div
		class={cn(
			'm3-text-field__control',
			leadingIcon && 'has-leading',
			trailingIcon && 'has-trailing'
		)}
	>
		{#if leadingIcon}
			<span class="m3-text-field__icon leading" aria-hidden="true">{@render leadingIcon()}</span>
		{/if}
		{#if label}
			<label class={cn('m3-text-field__label', floated && 'floated')} for={fieldId}>{label}</label>
		{/if}
		{#if multiline}
			<textarea
				id={fieldId}
				class="m3-text-field__field"
				bind:value
				{rows}
				{disabled}
				aria-invalid={invalid || undefined}
				aria-describedby={supportingText ? supportId : undefined}
				{...textareaProps}
				onfocus={handleFocus}
				onblur={handleBlur}
			></textarea>
		{:else}
			<input
				id={fieldId}
				class="m3-text-field__field"
				bind:value
				{type}
				{disabled}
				aria-invalid={invalid || undefined}
				aria-describedby={supportingText ? supportId : undefined}
				{...rest}
				onfocus={handleFocus}
				onblur={handleBlur}
			/>
		{/if}
		{#if trailingIcon}
			<span class="m3-text-field__icon trailing" aria-hidden="true">{@render trailingIcon()}</span>
		{/if}
	</div>
	{#if supportingText}
		<span class="m3-text-field__support" id={supportId}>{supportingText}</span>
	{/if}
</div>

<style>
	.m3-text-field {
		--_outline-rest: var(--m3-sys-outline-variant);
		--_outline-active: var(--m3-sys-primary);
		--_label-color: var(--m3-sys-on-surface-variant);
		--_label-bg: var(--m3-field-label-bg, var(--m3-sys-surface));
		--_label-y: calc(28px * var(--m3-density-scale));
		--_label-float-y: 0px;
		position: relative;
		display: flex;
		flex-direction: column;
		color: var(--m3-sys-on-surface);
		font: var(--m3-sys-typescale-body-large-weight) var(--m3-sys-typescale-body-large) /
			var(--m3-sys-typescale-body-large-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-body-large-tracking);
	}

	.m3-text-field.invalid {
		--_outline-rest: var(--m3-sys-error);
		--_outline-active: var(--m3-sys-error);
		--_label-color: var(--m3-sys-error);
	}

	.m3-text-field.disabled {
		opacity: 0.38;
		pointer-events: none;
	}

	.m3-text-field__control {
		position: relative;
		display: flex;
		align-items: center;
		min-width: 0;
		border-radius: inherit;
	}

	.m3-text-field__icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--m3-sys-on-surface-variant);
		flex-shrink: 0;
	}

	.m3-text-field__icon.leading {
		margin-inline-end: 16px;
	}

	.m3-text-field__icon.trailing {
		margin-inline-start: 16px;
	}

	.m3-text-field__field {
		flex: 1;
		min-width: 0;
		margin: 0;
		border: none;
		background: transparent;
		color: inherit;
		font: inherit;
		letter-spacing: inherit;
		outline: none;
		padding: 0;
		resize: none;
	}

	.m3-text-field__label {
		position: absolute;
		z-index: 1;
		inset-inline-start: 16px;
		top: var(--_label-y);
		max-width: calc(100% - 32px);
		color: var(--_label-color);
		pointer-events: none;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		transform: translateY(-50%) scale(1);
		transform-origin: left center;
		transition:
			transform var(--m3-motion-fast),
			color var(--m3-motion-fast);
	}

	.has-leading .m3-text-field__label {
		inset-inline-start: 56px;
	}

	.m3-text-field__label.floated {
		transform: translateY(calc(-50% + var(--_label-float-y) - var(--_label-y))) scale(0.75);
	}

	.m3-text-field__support {
		color: var(--m3-sys-on-surface-variant);
		font: var(--m3-sys-typescale-body-small-weight) var(--m3-sys-typescale-body-small) /
			var(--m3-sys-typescale-body-small-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-body-small-tracking);
		padding: 4px 16px 0;
	}

	.m3-text-field.invalid .m3-text-field__support {
		color: var(--m3-sys-error);
	}

	/* Outlined: static 1px outline + scaleX focus indicator (transform only) */
	.v-outlined .m3-text-field__control {
		border-radius: var(--m3-sys-shape-medium);
		padding: 16px;
		min-height: calc(56px * var(--m3-density-scale));
	}

	.v-outlined .m3-text-field__control::before,
	.v-outlined .m3-text-field__control::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
	}

	.v-outlined .m3-text-field__control::before {
		border: 1px solid var(--_outline-rest);
		transition: border-color var(--m3-motion-fast);
	}

	.v-outlined .m3-text-field__control::after {
		border: 2px solid var(--_outline-active);
		transform: scaleX(0);
		opacity: 0;
		transition:
			transform var(--m3-motion-default),
			opacity var(--m3-motion-fast),
			border-color var(--m3-motion-fast);
	}

	.v-outlined .m3-text-field__control:has(.m3-text-field__field:focus)::after {
		transform: scaleX(1);
		opacity: 1;
	}

	.v-outlined .m3-text-field__label {
		background: var(--_label-bg);
		padding-inline: 4px;
		inset-inline-start: 12px;
	}

	.v-outlined.has-leading .m3-text-field__label {
		inset-inline-start: 56px;
	}

	.v-outlined .m3-text-field__field {
		min-height: calc(24px * var(--m3-density-scale));
	}

	.v-outlined.multiline .m3-text-field__control {
		align-items: flex-start;
	}

	.v-outlined.multiline .m3-text-field__field {
		min-height: calc(72px * var(--m3-density-scale));
	}

	/* Filled: container tint + bottom indicator (static 1px, focus via box-shadow — no height jump) */
	.v-filled {
		--_label-float-y: 8px;
	}

	.v-filled .m3-text-field__control {
		border-radius: var(--m3-sys-shape-extra-small) var(--m3-sys-shape-extra-small) 0 0;
		background: var(--m3-sys-surface-container-highest);
		padding: 8px 16px 0;
		min-height: calc(56px * var(--m3-density-scale));
		align-items: flex-end;
		box-shadow: inset 0 -1px 0 0 var(--m3-sys-on-surface-variant);
		transition:
			background-color var(--m3-motion-fast),
			box-shadow var(--m3-motion-fast);
	}

	.v-filled .m3-text-field__control:has(.m3-text-field__field:focus) {
		background: color-mix(in srgb, var(--m3-sys-surface-container-highest) 92%, var(--m3-sys-primary));
		box-shadow: inset 0 -2px 0 0 var(--_outline-active);
	}

	.v-filled.invalid .m3-text-field__control {
		box-shadow: inset 0 -1px 0 0 var(--m3-sys-error);
	}

	.v-filled.invalid .m3-text-field__control:has(.m3-text-field__field:focus) {
		box-shadow: inset 0 -2px 0 0 var(--m3-sys-error);
	}

	.v-filled .m3-text-field__label {
		inset-inline-start: 16px;
		top: 18px;
	}

	.v-filled .m3-text-field__label.floated {
		transform: translateY(-50%) scale(0.75);
		top: 12px;
	}

	.v-filled.has-leading .m3-text-field__label {
		inset-inline-start: 56px;
	}

	.v-filled .m3-text-field__field {
		min-height: calc(28px * var(--m3-density-scale));
		padding-bottom: 8px;
	}

	.v-filled.multiline .m3-text-field__control {
		align-items: flex-start;
		padding-top: 24px;
	}

	.v-filled.multiline .m3-text-field__field {
		min-height: calc(72px * var(--m3-density-scale));
	}

	@media (forced-colors: active) {
		.v-outlined .m3-text-field__control::before {
			border: 1px solid CanvasText;
		}
		.v-outlined .m3-text-field__control:has(.m3-text-field__field:focus)::after {
			border-color: Highlight;
		}
		.v-filled .m3-text-field__control {
			box-shadow: inset 0 -1px 0 0 CanvasText;
		}
		.v-filled .m3-text-field__control:has(.m3-text-field__field:focus) {
			box-shadow: inset 0 -2px 0 0 Highlight;
		}
	}
</style>
