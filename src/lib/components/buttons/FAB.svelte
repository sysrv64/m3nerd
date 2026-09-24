<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import { cn } from '../../utils/cn.js';

interface Props extends Omit<HTMLButtonAttributes, 'class' | 'children'> {
	/** Extended FAB shows label; standard shows icon only. */
	extended?: boolean;
	size?: 's' | 'm' | 'l';
	/** Lower emphasis (secondary action). */
	secondary?: boolean;
	/** Static (non-elevated) variant for toolbars. */
	plain?: boolean;
	label?: string;
	class?: string;
	children?: Snippet;
}

let {
	extended = false,
	size = 'm',
	secondary = false,
	plain = false,
	label,
	class: className,
	children,
	type = 'button',
	...rest
}: Props = $props();
</script>

<button
	class={cn(
		'm3-fab',
		extended && 'extended',
		`sz-${size}`,
		secondary && 'secondary',
		plain && 'plain',
		className
	)}
	{type}
	aria-label={label}
	{...rest}
>
	<span class="m3-fab__content">{@render children?.()}</span>
</button>

<style>
	.m3-fab {
		--_h: 56px;
		--_shape: var(--m3-sys-shape-large);
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		height: var(--_h);
		min-width: var(--_h);
		padding: 0 16px;
		border: none;
		border-radius: var(--_shape);
		background: var(--m3-sys-primary-container);
		color: var(--m3-sys-on-primary-container);
		box-shadow: var(--m3-sys-elevation-3);
		cursor: pointer;
		font: var(--m3-sys-typescale-label-large-weight) var(--m3-sys-typescale-label-large) /
			var(--m3-sys-typescale-label-large-line) var(--m3-sys-font);
		transition:
			background-color var(--m3-motion-fast),
			transform var(--m3-motion-spatial-fast);
	}

	.m3-fab:active {
		transform: scale(0.96);
	}

	.m3-fab:disabled {
		opacity: 0.38;
		cursor: default;
	}

	.m3-fab__content {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		gap: inherit;
	}

	.m3-fab.extended {
		padding-inline: 20px;
		--_shape: var(--m3-sys-shape-full);
	}

	.sz-s {
		--_h: 40px;
	}
	.sz-l {
		--_h: 96px;
		min-width: 96px;
		--_shape: var(--m3-sys-shape-extra-large);
		font-size: var(--m3-sys-typescale-title-medium);
	}

	.secondary {
		background: var(--m3-sys-secondary-container);
		color: var(--m3-sys-on-secondary-container);
	}

	.plain {
		background: var(--m3-sys-surface-container-high);
		color: var(--m3-sys-primary);
		box-shadow: none;
	}
</style>
