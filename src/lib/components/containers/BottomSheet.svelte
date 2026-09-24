<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import { cn } from '../../utils/cn.js';

	type Text = string | Snippet;

	interface Props extends Omit<HTMLDialogAttributes, 'class' | 'children' | 'title'> {
		open?: boolean;
		title?: Text;
		dismissible?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		title,
		dismissible = true,
		class: className,
		children,
		onclose,
		oncancel,
		onclick,
		...rest
	}: Props = $props();

	let dialogEl = $state<HTMLDialogElement | null>(null);
	const titleId = $props.id();

	$effect(() => {
		const el = dialogEl;
		if (!el) return;
		if (open) {
			if (!el.open) el.showModal();
		} else if (el.open) {
			el.close();
		}
	});

	function handleCancel(e: Event & { currentTarget: EventTarget & HTMLDialogElement }) {
		oncancel?.(e);
		if (!dismissible) e.preventDefault();
	}

	function handleClose(e: Event & { currentTarget: EventTarget & HTMLDialogElement }) {
		if (open) open = false;
		onclose?.(e);
	}

	function handleDialogClick(e: MouseEvent & { currentTarget: EventTarget & HTMLDialogElement }) {
		onclick?.(e);
		if (e.target !== dialogEl) return;
		if (dismissible) dialogEl?.close();
	}
</script>

<dialog
	bind:this={dialogEl}
	class={cn('m3-bottom-sheet', className)}
	aria-modal="true"
	aria-labelledby={title ? titleId : undefined}
	closedby={dismissible ? 'any' : 'none'}
	oncancel={handleCancel}
	onclose={handleClose}
	onclick={handleDialogClick}
	{...rest}
>
	<div class="m3-bottom-sheet__surface">
		<div class="m3-bottom-sheet__handle" aria-hidden="true"></div>
		{#if title}
			<header class="m3-bottom-sheet__header">
				{#if typeof title === 'string'}
					<h2 id={titleId} class="m3-bottom-sheet__title">{title}</h2>
				{:else}
					<div id={titleId} class="m3-bottom-sheet__title">{@render title()}</div>
				{/if}
			</header>
		{/if}
		<div class="m3-bottom-sheet__content">
			{@render children?.()}
		</div>
	</div>
</dialog>

<style>
	.m3-bottom-sheet {
		padding: 0;
		border: none;
		border-start-start-radius: var(--m3-sys-shape-extra-large);
		border-start-end-radius: var(--m3-sys-shape-extra-large);
		background: var(--m3-sys-surface-container);
		color: var(--m3-sys-on-surface);
		box-shadow: var(--m3-sys-elevation-3);
		overflow: hidden;
	}

	.m3-bottom-sheet[open] {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 100%;
		max-height: 85dvh;
		margin: auto 0 0;
		animation: m3-sheet-in var(--m3-motion-spatial-default);
	}

	.m3-bottom-sheet::backdrop {
		background: var(--m3-sys-scrim);
		opacity: 0.32;
		animation: m3-sheet-backdrop-in var(--m3-motion-default);
	}

	.m3-bottom-sheet__surface {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
		min-height: 0;
	}

	.m3-bottom-sheet__handle {
		flex-shrink: 0;
		width: 32px;
		height: 4px;
		margin: 12px auto 4px;
		border-radius: var(--m3-sys-shape-full);
		background: var(--m3-sys-outline-variant);
	}

	.m3-bottom-sheet__header {
		flex-shrink: 0;
		padding-inline: var(--m3-sys-space-6);
		padding-block: var(--m3-sys-space-2) var(--m3-sys-space-3);
	}

	.m3-bottom-sheet__title {
		margin: 0;
		font: var(--m3-sys-typescale-title-large-weight) var(--m3-sys-typescale-title-large) /
			var(--m3-sys-typescale-title-large-line) var(--m3-sys-font);
		letter-spacing: normal;
		color: var(--m3-sys-on-surface);
	}

	.m3-bottom-sheet__content {
		flex: 1 1 auto;
		min-height: 0;
		padding: 0 var(--m3-sys-space-6) var(--m3-sys-space-6);
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	@media (max-width: 599px) {
		.m3-bottom-sheet__header {
			padding-inline: var(--m3-sys-space-4);
		}
		.m3-bottom-sheet__content {
			padding-inline: var(--m3-sys-space-4);
			padding-bottom: var(--m3-sys-space-4);
		}
	}

	@keyframes m3-sheet-in {
		from {
			transform: translateY(100%);
		}
	}

	@keyframes m3-sheet-backdrop-in {
		from {
			opacity: 0;
		}
	}
</style>
