<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import { cn } from '../../utils/cn.js';

type Variant = 'assist' | 'filter' | 'input' | 'suggested';

interface Props extends Omit<HTMLButtonAttributes, 'class' | 'children'> {
	variant?: Variant;
	selected?: boolean;
	label?: string;
	disabled?: boolean;
	icon?: Snippet;
	onRemove?: () => void;
	class?: string;
}

let {
	variant = 'assist',
	selected = $bindable(false),
	label = '',
	disabled = false,
	icon,
	onRemove,
	class: className,
	type = 'button',
	...rest
}: Props = $props();

function handleClick(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
	if (variant === 'filter' && !disabled) selected = !selected;
	rest.onclick?.(event);
}

const spanProps = $derived(rest as unknown as HTMLAttributes<HTMLSpanElement>);
</script>

{#if variant === 'input'}
	<span
		class={cn('m3-chip', 'v-input', disabled && 'disabled', className)}
		data-disabled={disabled || undefined}
		{...spanProps}
	>
		{#if icon}
			<span class="m3-chip__icon" aria-hidden="true">{@render icon()}</span>
		{/if}
		<span class="m3-chip__label">{label}</span>
		<button
			class="m3-chip__remove m3-layer"
			type="button"
			aria-label={`Remove ${label}`}
			disabled={disabled || undefined}
			onclick={() => onRemove?.()}
		>
			<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
				<path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
			</svg>
		</button>
	</span>
{:else}
	<button
		class={cn(
			'm3-chip',
			'm3-layer',
			`v-${variant}`,
			selected && 'selected',
			disabled && 'disabled',
			className
		)}
		{type}
		disabled={disabled || undefined}
		aria-pressed={variant === 'filter' ? selected : undefined}
		data-selected={variant === 'filter' ? selected || undefined : undefined}
		{...rest}
		onclick={handleClick}
	>
		{#if variant === 'filter' && selected}
			<span class="m3-chip__check" aria-hidden="true">
				<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
					<path d="M9.55 18 3.9 12.35l1.4-1.4 4.25 4.25 9.15-9.15 1.4 1.4L9.55 18Z" />
				</svg>
			</span>
		{:else if icon}
			<span class="m3-chip__icon" aria-hidden="true">{@render icon()}</span>
		{/if}
		<span class="m3-chip__label">{label}</span>
	</button>
{/if}

<style>
	.m3-chip {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		height: calc(32px * var(--m3-density-scale));
		max-width: 100%;
		margin: 0;
		padding: 0 16px;
		border: none;
		border-radius: var(--m3-sys-shape-full);
		font: var(--m3-sys-typescale-label-large-weight) var(--m3-sys-typescale-label-large) /
			var(--m3-sys-typescale-label-large-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-label-large-tracking);
		color: var(--m3-sys-on-surface);
		cursor: pointer;
		user-select: none;
		white-space: nowrap;
		transition:
			background-color var(--m3-motion-fast),
			color var(--m3-motion-fast),
			border-color var(--m3-motion-fast),
			transform var(--m3-motion-spatial-fast);
		-webkit-tap-highlight-color: transparent;
	}

	.m3-chip:active:not(:disabled) {
		transform: scale(0.97);
	}

	.m3-chip__label {
		position: relative;
		z-index: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.m3-chip__icon {
		position: relative;
		z-index: 1;
		display: inline-flex;
		flex-shrink: 0;
		margin-inline-start: -4px;
	}

	.m3-chip__check {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin-inline-start: -4px;
		animation: m3-chip-check-in var(--m3-motion-spatial-fast) both;
	}

	@keyframes m3-chip-check-in {
		from {
			opacity: 0;
			transform: scale(0.4);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.m3-chip.disabled {
		opacity: 0.38;
		pointer-events: none;
		cursor: default;
	}

	/* Assist: elevated default */
	.v-assist {
		background: var(--m3-sys-surface-container-low);
		color: var(--m3-sys-primary);
		box-shadow: var(--m3-sys-elevation-1);
	}
	.v-assist:hover:not(:disabled) {
		box-shadow: var(--m3-sys-elevation-2);
	}

	/* Filter: outline unselected, tonal + elevated selected */
	.v-filter {
		background: transparent;
		box-shadow: inset 0 0 0 1px var(--m3-sys-outline-variant);
		color: var(--m3-sys-on-surface);
	}
	.v-filter.selected {
		background: var(--m3-sys-secondary-container);
		color: var(--m3-sys-on-secondary-container);
		box-shadow: var(--m3-sys-elevation-1);
	}

	/* Input: outline + trailing remove */
	.v-input {
		background: transparent;
		box-shadow: inset 0 0 0 1px var(--m3-sys-outline);
		padding-inline-end: 8px;
		cursor: default;
	}

	.m3-chip__remove {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		margin: 0;
		padding: 0;
		border: none;
		border-radius: var(--m3-sys-shape-full);
		background: transparent;
		color: var(--m3-sys-on-surface-variant);
		cursor: pointer;
		flex-shrink: 0;
		transition:
			background-color var(--m3-motion-fast),
			color var(--m3-motion-fast);
	}

	.m3-chip__remove:disabled {
		opacity: 0.38;
		pointer-events: none;
	}

	.m3-chip__remove:focus-visible {
		outline: 3px solid var(--m3-sys-primary);
		outline-offset: 1px;
	}

	/* Suggested: flat outline chip */
	.v-suggested {
		background: transparent;
		box-shadow: inset 0 0 0 1px var(--m3-sys-outline-variant);
		color: var(--m3-sys-on-surface);
	}

	.m3-chip:focus-visible {
		outline: 3px solid var(--m3-sys-primary);
		outline-offset: 2px;
	}

	@media (forced-colors: active) {
		.m3-chip {
			border: 1px solid ButtonText;
			background: ButtonFace;
			color: ButtonText;
			box-shadow: none;
		}
	}
</style>
