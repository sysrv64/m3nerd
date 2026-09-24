<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		open = $bindable(false),
		title = '',
		dismissible = true,
		class: className = '',
		children,
		actions,
		onclose,
		oncancel,
		onclick,
		...rest
	}: {
		open?: boolean;
		title?: string;
		dismissible?: boolean;
		class?: string;
		children?: Snippet;
		actions?: Snippet;
		onclose?: (e: Event) => void;
		oncancel?: (e: Event) => void;
		onclick?: (e: MouseEvent) => void;
		[key: string]: unknown;
	} = $props();

	let dialogEl = $state<HTMLDialogElement | null>(null);

	$effect(() => {
		const el = dialogEl;
		if (!el) return;
		if (open && !el.open) el.showModal();
		else if (!open && el.open) el.close();
	});

	function handleCancel(e: Event) {
		oncancel?.(e);
		if (!dismissible) e.preventDefault();
		else open = false;
	}

	function handleClose(e: Event) {
		open = false;
		onclose?.(e);
	}

	function handleClick(e: MouseEvent) {
		onclick?.(e);
		if (e.target !== dialogEl) return;
		if (dismissible) open = false;
	}
</script>

<dialog
	bind:this={dialogEl}
	class="ig-modal ig-glass {className}"
	aria-modal="true"
	aria-label={title || undefined}
	oncancel={handleCancel}
	onclose={handleClose}
	onclick={handleClick}
	{...rest}
>
	{#if title || dismissible}
		<div class="ig-modal-header">
			{#if title}
				<span class="ig-modal-title">{title}</span>
			{/if}
			{#if dismissible}
				<button
					type="button"
					class="ig-modal-close ig-focus"
					aria-label="Close"
					onclick={() => (open = false)}
				>
					×
				</button>
			{/if}
		</div>
	{/if}
	<div class="ig-modal-body">
		{@render children?.()}
	</div>
	{#if actions}
		<div class="ig-modal-actions">
			{@render actions()}
		</div>
	{/if}
</dialog>

<style>
	.ig-modal {
		padding: 0;
		max-width: min(420px, calc(100vw - 32px));
		width: 100%;
		border: 1px solid var(--ig-border);
		border-radius: var(--ig-window-rounding);
		color: var(--ig-text);
		font-family: var(--ig-font);
		font-size: var(--ig-font-size);
		line-height: var(--ig-line-height);
	}

	.ig-modal[open] {
		animation: ig-modal-in 120ms linear;
	}

	.ig-modal::backdrop {
		background: var(--ig-modal-dim);
	}

	.ig-modal-header {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 6px 8px;
		background: var(--ig-title-bg-active);
		border-bottom: 1px solid var(--ig-border);
	}

	.ig-modal-title {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: var(--ig-font-size-sm);
		color: var(--ig-text);
	}

	.ig-modal-close {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 20px;
		height: 20px;
		padding: 0;
		border: none;
		background: transparent;
		color: var(--ig-text);
		font-family: inherit;
		font-size: var(--ig-font-size-lg);
		line-height: 1;
		cursor: pointer;
		transition:
			color 120ms linear,
			background-color 120ms linear;
	}

	.ig-modal-close:hover {
		color: var(--ig-nav-cursor);
	}

	.ig-modal-body {
		padding: var(--ig-window-padding);
		color: var(--ig-text);
	}

	.ig-modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 8px;
		padding: 0 var(--ig-window-padding) var(--ig-window-padding);
	}

	@keyframes ig-modal-in {
		from {
			opacity: 0;
			transform: scale(0.98);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
