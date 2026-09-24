<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '../../utils/cn.js';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'class' | 'children'> {
		as?: 'div' | 'button' | 'a';
		href?: string;
		onclick?: (e: MouseEvent) => void;
		headline?: string;
		supporting?: string | Snippet;
		trailing?: Snippet;
		trailingText?: string;
		leading?: Snippet;
		overline?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		as,
		href,
		onclick,
		headline,
		supporting,
		trailing,
		trailingText,
		leading,
		overline,
		class: className,
		children,
		...rest
	}: Props = $props();

	const tag = $derived(as ?? (href ? 'a' : onclick ? 'button' : 'div'));
	const interactive = $derived(tag === 'button' || tag === 'a' || Boolean(onclick));
</script>

<svelte:element
	this={tag}
	class={cn('m3-list-item', 'm3-layer', interactive && 'interactive', className)}
	{href}
	type={tag === 'button' ? 'button' : undefined}
	onclick={onclick}
	{...rest}
>
	{#if overline}
		<span class="m3-list-item__overline">{overline}</span>
	{/if}
	<div class="m3-list-item__start">
		{#if leading}
			<span class="m3-list-item__leading">{@render leading()}</span>
		{/if}
		<div class="m3-list-item__text">
			<span class="m3-list-item__headline">
				{#if headline}
					{headline}
				{:else}
					{@render children?.()}
				{/if}
			</span>
			{#if supporting}
				{#if typeof supporting === 'string'}
					<span class="m3-list-item__supporting clamp">{supporting}</span>
				{:else}
					<span class="m3-list-item__supporting">{@render supporting()}</span>
				{/if}
			{/if}
		</div>
	</div>
	{#if trailing || trailingText}
		<div class="m3-list-item__end">
			{#if trailingText}
				<span class="m3-list-item__trailing-text">{trailingText}</span>
			{/if}
			{#if trailing}
				<span class="m3-list-item__trailing">{@render trailing()}</span>
			{/if}
		</div>
	{/if}
</svelte:element>

<style>
	.m3-list-item {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: center;
		gap: var(--m3-sys-space-1);
		width: 100%;
		min-height: var(--m3-row-height);
		padding: var(--m3-sys-space-2) var(--m3-sys-space-4);
		border: none;
		border-radius: 0;
		background: transparent;
		color: var(--m3-sys-on-surface);
		text-align: start;
		text-decoration: none;
		transition: background-color var(--m3-motion-fast);
		-webkit-tap-highlight-color: transparent;
	}

	.m3-list-item.interactive {
		cursor: pointer;
	}

	.m3-list-item:disabled,
	.m3-list-item[aria-disabled='true'] {
		opacity: 0.38;
		cursor: default;
		pointer-events: none;
	}

	.m3-list-item__overline {
		position: relative;
		z-index: 1;
		font: var(--m3-sys-typescale-label-medium-weight) var(--m3-sys-typescale-label-medium) /
			var(--m3-sys-typescale-label-medium-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-label-medium-tracking);
		color: var(--m3-sys-on-surface-variant);
	}

	.m3-list-item__start {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		gap: var(--m3-sys-space-4);
		min-width: 0;
	}

	.m3-list-item__leading {
		display: inline-flex;
		align-items: center;
		flex-shrink: 0;
	}

	.m3-list-item__text {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 2px;
		min-width: 0;
		flex: 1;
	}

	.m3-list-item__headline {
		font: var(--m3-sys-typescale-body-large-weight) var(--m3-sys-typescale-body-large) /
			var(--m3-sys-typescale-body-large-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-body-large-tracking);
		color: var(--m3-sys-on-surface);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.m3-list-item__supporting {
		font: var(--m3-sys-typescale-body-medium-weight) var(--m3-sys-typescale-body-medium) /
			var(--m3-sys-typescale-body-medium-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-body-medium-tracking);
		color: var(--m3-sys-on-surface-variant);
	}

	.m3-list-item__supporting.clamp {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.m3-list-item__end {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		gap: var(--m3-sys-space-2);
		flex-shrink: 0;
		margin-inline-start: auto;
	}

	.m3-list-item__trailing-text {
		font: var(--m3-sys-typescale-body-medium-weight) var(--m3-sys-typescale-body-medium) /
			var(--m3-sys-typescale-body-medium-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-body-medium-tracking);
		color: var(--m3-sys-on-surface-variant);
		white-space: nowrap;
	}

	.m3-list-item__trailing {
		display: inline-flex;
		align-items: center;
	}
</style>
