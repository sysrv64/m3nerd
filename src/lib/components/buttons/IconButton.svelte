<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import { cn } from '../../utils/cn.js';

type Variant = 'standard' | 'filled' | 'tonal' | 'outlined';

interface Props extends Omit<HTMLButtonAttributes, 'class' | 'children'> {
	variant?: Variant;
	size?: 'xs' | 's' | 'm' | 'l' | 'xl';
	/** Toggle semantics. */
	selected?: boolean;
	/** Renders as [aria-pressed] toggle instead of plain button. */
	toggle?: boolean;
	class?: string;
	children?: Snippet;
	/** Accessible label when only an icon is present. */
	label?: string;
}

let {
	variant = 'standard',
	size = 'm',
	selected = false,
	toggle = false,
	class: className,
	children,
	label,
	type = 'button',
	...rest
}: Props = $props();
</script>

<button
	class={cn(
		'm3-icon-btn',
		'm3-layer',
		'm3-focus-outward',
		`v-${variant}`,
		`sz-${size}`,
		selected && 'selected',
		className
	)}
	{type}
	aria-pressed={toggle ? selected : undefined}
	aria-label={label}
	data-selected={selected || undefined}
	{...rest}
>
	<span class="m3-icon-btn__content">{@render children?.()}</span>
</button>

<style>
	.m3-icon-btn {
		--_size: 40px;
		--_shape: var(--m3-sys-shape-full);
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--_size);
		height: var(--_size);
		padding: 0;
		border: none;
		border-radius: var(--_shape);
		background: transparent;
		color: var(--m3-sys-on-surface-variant);
		cursor: pointer;
		transition:
			background-color var(--m3-motion-fast),
			color var(--m3-motion-fast);
		-webkit-tap-highlight-color: transparent;
	}

	.m3-icon-btn::before {
		content: '';
		position: absolute;
		inset: calc((48px - var(--_size)) / -2);
	}

	.sz-xs {
		--_size: 32px;
	}
	.sz-s,
	.sz-m {
		--_size: 40px;
	}
	.sz-l {
		--_size: 56px;
	}
	.sz-xl {
		--_size: 96px;
	}

	.m3-icon-btn:disabled {
		opacity: 0.38;
		cursor: default;
	}

	.m3-icon-btn__content {
		position: relative;
		z-index: 1;
		display: inline-flex;
	}

	.v-filled {
		background: var(--m3-sys-primary);
		color: var(--m3-sys-on-primary);
	}
	.v-tonal {
		background: var(--m3-sys-secondary-container);
		color: var(--m3-sys-on-secondary-container);
	}
	.v-outlined {
		box-shadow: inset 0 0 0 1px var(--m3-sys-outline-variant);
	}

	.m3-icon-btn.selected {
		background: var(--m3-sys-secondary-container);
		color: var(--m3-sys-on-secondary-container);
	}
	.v-filled.selected {
		background: var(--m3-sys-primary);
		color: var(--m3-sys-on-primary);
	}

	@media (forced-colors: active) {
		.m3-icon-btn {
			border: 1px solid ButtonText;
		}
	}
</style>
