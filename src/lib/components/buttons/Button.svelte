<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
import { cn } from '../../utils/cn.js';

export type Variant = 'filled' | 'tonal' | 'elevated' | 'outlined' | 'text';
export type Size = 'xs' | 's' | 'm' | 'l' | 'xl';
type Shape = 'square' | 'round' | 'full' | 'medium';

export interface Common {
	variant?: Variant;
	size?: Size;
	shape?: Shape;
	/** Icon-only button: removes horizontal padding, keeps circular/square hit area. */
	icon?: boolean;
	href?: string;
	class?: string;
	children?: Snippet;
}

export type Props = Common &
	(Omit<HTMLButtonAttributes, 'class' | 'children'> &
		(Omit<HTMLAnchorAttributes, 'class' | 'children'> | {}));

let {
	variant = 'filled',
	size = 's',
	shape = 'medium',
	icon = false,
	class: className,
	children,
	type = undefined,
	href = undefined,
	disabled = false,
	onclick,
	...rest
}: Props & { shape?: string } = $props();

const isLink = $derived(typeof href === 'string' && href.length > 0);
const tag = $derived(isLink ? 'a' : 'button');

function handleClick(e: MouseEvent) {
	if (isLink && disabled) {
		e.preventDefault();
		return;
	}
	onclick?.(e as MouseEvent & { currentTarget: EventTarget & HTMLButtonElement });
}
</script>

<svelte:element
	this={tag}
	class={cn('m3-btn', 'm3-layer', `v-${variant}`, `s-${size}`, `sh-${shape}`, icon && 'icon-only', className)}
	href={isLink && disabled ? undefined : href}
	type={isLink ? undefined : (type ?? 'button')}
	aria-disabled={isLink && disabled ? 'true' : undefined}
	disabled={isLink ? undefined : disabled}
	data-disabled={disabled || undefined}
	{...rest}
	onclick={handleClick}
>
	<span class="m3-btn__label">
		{@render children?.()}
	</span>
</svelte:element>

<style>
	.m3-btn {
		--_h: var(--m3-control-height);
		--_px: 16px;
		--_shape: var(--m3-sys-shape-full);
		--_pressed-shape: var(--m3-sys-shape-large);
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		height: var(--_h);
		min-width: 0;
		padding-inline: var(--_px);
		border: none;
		border-radius: var(--_shape);
		font: var(--m3-sys-typescale-label-large-weight) var(--m3-sys-typescale-label-large) /
			var(--m3-sys-typescale-label-large-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-label-large-tracking);
		text-decoration: none;
		cursor: pointer;
		user-select: none;
		white-space: nowrap;
		transition:
			background-color var(--m3-motion-fast),
			color var(--m3-motion-fast),
			border-radius var(--m3-motion-spatial-fast);
		-webkit-tap-highlight-color: transparent;
	}

	.m3-btn:active:not(:disabled, [data-disabled]) {
		border-radius: var(--_pressed-shape);
	}

	.m3-btn:disabled,
	.m3-btn[data-disabled] {
		cursor: default;
		opacity: 1;
		pointer-events: none;
	}

	.v-filled:disabled,
	.v-tonal:disabled,
	.v-elevated:disabled,
	.v-filled[data-disabled],
	.v-tonal[data-disabled],
	.v-elevated[data-disabled] {
		background-color: color-mix(in srgb, var(--m3-sys-on-surface) 12%, transparent);
		color: color-mix(in srgb, var(--m3-sys-on-surface) 38%, transparent);
		box-shadow: none;
	}

	.v-outlined:disabled,
	.v-text:disabled,
	.v-outlined[data-disabled],
	.v-text[data-disabled] {
		background-color: transparent;
		color: color-mix(in srgb, var(--m3-sys-on-surface) 38%, transparent);
	}

	.m3-btn__label {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		gap: inherit;
	}

	/* Sizes — Expressive xs–xl emphasis axis */
	.s-xs {
		--_h: 32px;
		--_px: 10px;
		font-size: var(--m3-sys-typescale-label-medium);
	}
	.s-s {
		--_h: 40px;
		--_px: 12px;
	}
	.s-m {
		--_h: 56px;
		--_px: 24px;
		font-size: var(--m3-sys-typescale-title-medium);
	}
	.s-l {
		--_h: 96px;
		--_px: 48px;
		font-size: var(--m3-sys-typescale-headline-small);
	}
	.s-xl {
		--_h: 136px;
		--_px: 64px;
		font-size: var(--m3-sys-typescale-headline-large);
	}

	/* Shapes */
	.sh-square {
		--_shape: var(--m3-sys-shape-small);
		--_pressed-shape: var(--m3-sys-shape-extra-small);
	}
	.sh-round {
		--_shape: var(--m3-sys-shape-large);
		--_pressed-shape: var(--m3-sys-shape-medium);
	}
	.sh-medium {
		--_shape: var(--m3-sys-shape-medium);
		--_pressed-shape: var(--m3-sys-shape-small);
	}
	.sh-full {
		--_shape: var(--m3-sys-shape-full);
		--_pressed-shape: var(--m3-sys-shape-large);
	}

	.icon-only {
		--_px: 0;
		width: var(--_h);
		padding: 0;
	}

	/* Variants — background/color via tokens; elevation swaps static (no shadow animation) */
	.v-filled {
		background: var(--m3-sys-primary);
		color: var(--m3-sys-on-primary);
	}
	.v-tonal {
		background: var(--m3-sys-secondary-container);
		color: var(--m3-sys-on-secondary-container);
	}
	.v-elevated {
		background: var(--m3-sys-surface-container-low);
		color: var(--m3-sys-primary);
		box-shadow: var(--m3-sys-elevation-1);
	}
	.v-elevated:hover:not(:disabled, [data-disabled]) {
		box-shadow: var(--m3-sys-elevation-2);
	}
	.v-filled:hover:not(:disabled, [data-disabled]),
	.v-tonal:hover:not(:disabled, [data-disabled]) {
		box-shadow: var(--m3-sys-elevation-1);
	}
	.v-outlined {
		background: transparent;
		color: var(--m3-sys-on-surface);
		box-shadow: inset 0 0 0 1px var(--m3-sys-outline-variant);
	}
	.s-l.v-outlined {
		box-shadow: inset 0 0 0 2px var(--m3-sys-outline-variant);
	}
	.s-xl.v-outlined {
		box-shadow: inset 0 0 0 3px var(--m3-sys-outline-variant);
	}
	.v-text {
		background: transparent;
		color: var(--m3-sys-primary);
		--_px: 12px;
	}

	/* High-contrast / forced colors */
	@media (forced-colors: active) {
		.m3-btn {
			border: 1px solid ButtonText;
			background: ButtonFace;
			color: ButtonText;
		}
	}

	@media print {
		.m3-btn {
			print-color-adjust: exact;
			-webkit-print-color-adjust: exact;
		}
	}
</style>
