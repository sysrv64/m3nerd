<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '../../utils/cn.js';

	type Text = string | Snippet;

	interface Props
		extends Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'children' | 'title'> {
		open?: boolean;
		side?: 'start' | 'end';
		title?: Text;
		modal?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		side = 'end',
		title,
		modal = false,
		class: className,
		children,
		...rest
	}: Props = $props();

	let panelEl = $state<HTMLDivElement | null>(null);
	const titleId = $props.id();

	$effect(() => {
		if (!open || !modal) return;
		panelEl?.focus({ preventScroll: true });

		function onKeydown(e: KeyboardEvent) {
			if (e.key !== 'Escape') return;
			open = false;
		}

		document.addEventListener('keydown', onKeydown);
		return () => document.removeEventListener('keydown', onKeydown);
	});
</script>

{#if modal}
	<div
		class={cn('m3-side-sheet__scrim', open && 'open')}
		aria-hidden="true"
		onclick={() => (open = false)}
	></div>
{/if}
<div
	bind:this={panelEl}
	class={cn('m3-side-sheet', `side-${side}`, modal && 'modal', open && 'open', className)}
	role={modal ? 'dialog' : undefined}
	aria-modal={modal ? 'true' : undefined}
	aria-hidden={open ? undefined : 'true'}
	aria-labelledby={title ? titleId : undefined}
	inert={!open}
	{...rest}
>
	{#if title}
		<header class="m3-side-sheet__header">
			{#if typeof title === 'string'}
				<h2 id={titleId} class="m3-side-sheet__title">{title}</h2>
			{:else}
				<div id={titleId} class="m3-side-sheet__title">{@render title()}</div>
			{/if}
		</header>
	{/if}
	<div class="m3-side-sheet__content">
		{@render children?.()}
	</div>
</div>

<style>
	.m3-side-sheet__scrim {
		position: fixed;
		inset: 0;
		z-index: 1090;
		background: var(--m3-sys-scrim);
		opacity: 0;
		pointer-events: none;
		transition: opacity var(--m3-motion-default);
	}

	.m3-side-sheet__scrim.open {
		opacity: 0.32;
		pointer-events: auto;
	}

	.m3-side-sheet {
		position: fixed;
		top: 0;
		bottom: 0;
		z-index: 1100;
		display: flex;
		flex-direction: column;
		width: var(--m3-drawer-width);
		max-width: 100vw;
		background: var(--m3-sys-surface-container-low);
		color: var(--m3-sys-on-surface);
		visibility: hidden;
		transition:
			transform var(--m3-motion-spatial-default),
			visibility 0s linear var(--m3-sys-motion-duration-spatial-default);
	}

	.m3-side-sheet.side-end {
		right: 0;
		transform: translateX(100%);
	}

	.m3-side-sheet.side-start {
		left: 0;
		transform: translateX(-100%);
	}

	.m3-side-sheet.open {
		visibility: visible;
		transform: translateX(0);
		transition:
			transform var(--m3-motion-spatial-default),
			visibility 0s;
	}

	.m3-side-sheet.modal {
		box-shadow: var(--m3-sys-elevation-3);
	}

	.m3-side-sheet__header {
		flex-shrink: 0;
		padding: var(--m3-sys-space-4) var(--m3-sys-space-6);
		border-bottom: 1px solid var(--m3-sys-outline-variant);
	}

	.m3-side-sheet__title {
		margin: 0;
		font: var(--m3-sys-typescale-title-large-weight) var(--m3-sys-typescale-title-large) /
			var(--m3-sys-typescale-title-large-line) var(--m3-sys-font);
		letter-spacing: normal;
		color: var(--m3-sys-on-surface);
	}

	.m3-side-sheet__content {
		flex: 1 1 auto;
		min-height: 0;
		padding: var(--m3-sys-space-4) var(--m3-sys-space-6) var(--m3-sys-space-6);
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	@media (max-width: 599px) {
		.m3-side-sheet {
			width: min(var(--m3-drawer-width), 100vw);
		}
		.m3-side-sheet.side-start {
			left: auto;
			right: 0;
			transform: translateX(100%);
		}
		.m3-side-sheet__header {
			padding-inline: var(--m3-sys-space-4);
		}
		.m3-side-sheet__content {
			padding-inline: var(--m3-sys-space-4);
			padding-bottom: var(--m3-sys-space-4);
		}
	}
</style>
