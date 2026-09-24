<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import { cn } from '../../utils/cn.js';

	type Text = string | Snippet;

	interface Props extends Omit<HTMLDialogAttributes, 'class' | 'children' | 'title'> {
		open?: boolean;
		title?: Text;
		description?: Text;
		actions?: Snippet;
		dismissible?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		title,
		description,
		actions,
		dismissible = true,
		class: className,
		children,
		onclose,
		oncancel,
		onclick,
		...rest
	}: Props = $props();

	let dialogEl = $state<HTMLDialogElement | null>(null);
	const baseId = $props.id();
	const titleId = `${baseId}-title`;
	const descriptionId = `${baseId}-description`;

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
	class={cn('m3-dialog', className)}
	aria-modal="true"
	aria-labelledby={title ? titleId : undefined}
	aria-describedby={description ? descriptionId : undefined}
	closedby={dismissible ? 'any' : 'none'}
	oncancel={handleCancel}
	onclose={handleClose}
	onclick={handleDialogClick}
	{...rest}
>
	<div class="m3-dialog__surface">
		{#if title}
			<header class="m3-dialog__header">
				{#if typeof title === 'string'}
					<h2 id={titleId} class="m3-dialog__title">{title}</h2>
				{:else}
					<div id={titleId} class="m3-dialog__title">{@render title()}</div>
				{/if}
			</header>
		{/if}
		{#if description}
			<div id={descriptionId} class="m3-dialog__description">
				{#if typeof description === 'string'}
					{description}
				{:else}
					{@render description()}
				{/if}
			</div>
		{/if}
		{#if children}
			<div class="m3-dialog__content">{@render children()}</div>
		{/if}
		{#if actions}
			<footer class="m3-dialog__actions">{@render actions()}</footer>
		{/if}
	</div>
</dialog>

<style>
	.m3-dialog {
		width: min(560px, calc(100vw - 48px));
		max-width: calc(100vw - 48px);
		max-height: calc(100dvh - 48px);
		padding: 0;
		border: none;
		border-radius: var(--m3-sys-shape-extra-large);
		background: var(--m3-sys-surface-container-high);
		color: var(--m3-sys-on-surface);
		box-shadow: var(--m3-sys-elevation-3);
		overflow: hidden;
	}

	.m3-dialog[open] {
		display: flex;
		flex-direction: column;
		animation: m3-dialog-in var(--m3-motion-spatial-default);
	}

	.m3-dialog::backdrop {
		background: var(--m3-sys-scrim);
		opacity: 0.32;
		animation: m3-dialog-backdrop-in var(--m3-motion-default);
	}

	.m3-dialog__surface {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
		gap: var(--m3-sys-space-4);
		min-height: 0;
		padding: var(--m3-sys-space-6);
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	@media (max-width: 599px) {
		.m3-dialog__surface {
			padding: var(--m3-sys-space-4);
		}
	}

	.m3-dialog__header {
		flex-shrink: 0;
	}

	.m3-dialog__title {
		margin: 0;
		font: var(--m3-sys-typescale-headline-small-weight) var(--m3-sys-typescale-headline-small) /
			var(--m3-sys-typescale-headline-small-line) var(--m3-sys-font);
		letter-spacing: normal;
		color: var(--m3-sys-on-surface);
	}

	.m3-dialog__description {
		flex-shrink: 0;
		font: var(--m3-sys-typescale-body-medium-weight) var(--m3-sys-typescale-body-medium) /
			var(--m3-sys-typescale-body-medium-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-body-medium-tracking);
		color: var(--m3-sys-on-surface-variant);
	}

	.m3-dialog__content {
		flex-shrink: 0;
	}

	.m3-dialog__actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-end;
		gap: var(--m3-sys-space-2);
		flex-shrink: 0;
		margin-top: var(--m3-sys-space-2);
	}

	@keyframes m3-dialog-in {
		from {
			opacity: 0;
			transform: scale(0.9);
		}
	}

	@keyframes m3-dialog-backdrop-in {
		from {
			opacity: 0;
		}
	}
</style>
