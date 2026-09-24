<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { cn } from '../../utils/cn.js';

interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'class' | 'children'> {
	value?: string | number;
	max?: number;
	dot?: boolean;
	variant?: 'standard' | 'small';
	label?: string;
	children?: Snippet;
	class?: string;
}

let {
	value,
	max = 99,
	dot = false,
	variant = 'standard',
	label,
	children,
	class: className,
	...rest
}: Props = $props();

const text = $derived(
	typeof value === 'number' && value > max
		? `${max}+`
		: value === undefined || value === null
			? ''
			: String(value)
);
const show = $derived(dot || text.length > 0);
</script>

<span class={cn('m3-badge-wrap', className)} {...rest}>
	{@render children?.()}
	{#if show}
		<span
			class={cn('m3-badge', `v-${variant}`, dot && 'dot')}
			role={label ? 'status' : undefined}
			aria-hidden={label ? undefined : 'true'}
			aria-label={label}
		>
			{#if !dot}{text}{/if}
		</span>
	{/if}
</span>

<style>
	.m3-badge-wrap {
		position: relative;
		display: inline-flex;
	}

	.m3-badge {
		position: absolute;
		top: 0;
		inset-inline-end: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 16px;
		height: 16px;
		padding-inline: 4px;
		border-radius: 8px;
		background: var(--m3-sys-error);
		color: var(--m3-sys-on-error);
		font: var(--m3-sys-typescale-label-small-weight) var(--m3-sys-typescale-label-small) /
			var(--m3-sys-typescale-label-small-line) var(--m3-sys-font);
		line-height: 1;
		white-space: nowrap;
		transform: translate(50%, -50%);
		pointer-events: none;
	}

	.m3-badge.v-small {
		min-width: 6px;
		height: 6px;
		padding: 0;
		border-radius: 3px;
		font-size: 0;
	}

	.m3-badge.dot {
		min-width: 6px;
		width: 6px;
		height: 6px;
		padding: 0;
		border-radius: 3px;
		font-size: 0;
	}
</style>
