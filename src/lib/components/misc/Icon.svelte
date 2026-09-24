<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLAttributes, SVGAttributes } from 'svelte/elements';
import { cn } from '../../utils/cn.js';

interface Props extends Omit<HTMLAttributes<HTMLElement>, 'class'> {
	/** Material Symbols ligature name or raw SVG path data (d attribute). */
	name?: string;
	/** Raw SVG path `d` — use when not relying on ligature font. */
	path?: string;
	/** Pixel size; defaults to 24px. */
	size?: number;
	/** Filled variant (Material Symbols fill axis). */
	fill?: boolean;
	weight?: number;
	grade?: number;
	gradSize?: number;
	children?: Snippet;
	class?: string;
}

let {
	name,
	path,
	size = 24,
	fill = false,
	weight = 400,
	grade = 0,
	gradSize = 40,
	children,
	class: className,
	...rest
}: Props = $props();

const style = $derived(
	[
		`font-size:${size}px`,
		`font-variation-settings:'FILL' ${fill ? 1 : 0},'wght' ${weight},'GRAD' ${grade},'opsz' ${gradSize}`
	].join(';')
);

const svgRest = $derived(rest as unknown as SVGAttributes<SVGSVGElement>);
</script>

{#if path}
	<svg
		{style}
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="currentColor"
		aria-hidden="true"
		{...svgRest}
		class={cn('m3-icon', className)}
	>
		<path d={path} />
		{@render children?.()}
	</svg>
{:else if name}
	<span class={cn('m3-icon material-symbols-outlined', className)} {style} {...rest}>
		{name}
		{@render children?.()}
	</span>
{:else}
	<span class={cn('m3-icon', className)} {style} {...rest}>
		{@render children?.()}
	</span>
{/if}

<style>
	.m3-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		user-select: none;
		flex-shrink: 0;
	}
</style>
