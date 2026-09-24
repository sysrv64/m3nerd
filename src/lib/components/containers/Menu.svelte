<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { setContext } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { placeNear } from '../../utils/anchor.js';

	type Placement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'bottom' | 'top';

	interface Props
		extends Omit<
			HTMLAttributes<HTMLDivElement>,
			'class' | 'children' | 'onclick' | 'onselect' | 'onkeydown'
		> {
		open?: boolean;
		anchorEl?: HTMLElement | null;
		placement?: Placement;
		onselect?: (e: Event) => void;
		onclick?: (e: MouseEvent) => void;
		onkeydown?: (e: KeyboardEvent) => void;
		class?: string;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		anchorEl = null,
		placement = 'bottom-start',
		onselect,
		onclick,
		onkeydown,
		class: className,
		children,
		...rest
	}: Props = $props();

	let panelEl = $state<HTMLDivElement | null>(null);

	setContext('m3-menu', {
		close: () => {
			open = false;
		}
	});

	$effect(() => {
		if (!open) return;
		const trigger = anchorEl;
		const panel = panelEl;
		if (panel && trigger) {
			const rect = trigger.getBoundingClientRect();
			const placed = placeNear(
				rect,
				{ width: panel.offsetWidth, height: panel.offsetHeight },
				{ width: window.innerWidth, height: window.innerHeight },
				placement
			);
			panel.style.top = `${placed.top}px`;
			panel.style.left = `${placed.left}px`;
			panel.style.maxHeight = `${placed.maxHeight}px`;
		}
		panel
			?.querySelector<HTMLElement>(
				'[role="menuitem"]:not([aria-disabled="true"]):not(:disabled)'
			)
			?.focus({ preventScroll: true });
	});

	$effect(() => {
		if (!open) return;

		function onPointerDown(e: PointerEvent) {
			const target = e.target as Node | null;
			if (!target) return;
			if (panelEl?.contains(target)) return;
			if (anchorEl?.contains(target)) return;
			open = false;
		}

		function onDocumentKeydown(e: KeyboardEvent) {
			if (e.key !== 'Escape') return;
			e.preventDefault();
			e.stopPropagation();
			open = false;
		}

		document.addEventListener('pointerdown', onPointerDown, true);
		document.addEventListener('keydown', onDocumentKeydown);
		return () => {
			document.removeEventListener('pointerdown', onPointerDown, true);
			document.removeEventListener('keydown', onDocumentKeydown);
		};
	});

	function menuItems(): HTMLElement[] {
		if (!panelEl) return [];
		return Array.from(
			panelEl.querySelectorAll<HTMLElement>(
				'[role="menuitem"]:not([aria-disabled="true"]):not(:disabled)'
			)
		);
	}

	function handleKeydown(e: KeyboardEvent) {
		onkeydown?.(e);
		if (e.defaultPrevented) return;
		if (e.key === 'Tab') {
			open = false;
			return;
		}
		if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
		e.preventDefault();
		const list = menuItems();
		if (list.length === 0) return;
		let index = list.indexOf(document.activeElement as HTMLElement);
		if (e.key === 'ArrowDown') {
			if (index < 0) index = -1;
			list[(index + 1) % list.length]?.focus();
		} else {
			if (index < 0) index = 0;
			list[(index - 1 + list.length) % list.length]?.focus();
		}
	}

	function handleClick(e: MouseEvent) {
		onclick?.(e);
		const item = (e.target as HTMLElement | null)?.closest?.('[role="menuitem"]');
		if (!item) return;
		if (item.hasAttribute('disabled') || item.getAttribute('aria-disabled') === 'true') return;
		onselect?.(e);
	}
</script>

{#if open}
	<div class="m3-menu-backdrop" aria-hidden="true" onclick={() => (open = false)}></div>
	<div
		bind:this={panelEl}
		class={cn('m3-menu', `p-${placement}`, className)}
		role="menu"
		onclick={handleClick}
		onkeydown={handleKeydown}
		{...rest}
	>
		{@render children?.()}
	</div>
{/if}

<style>
	.m3-menu-backdrop {
		position: fixed;
		inset: 0;
		z-index: 1100;
		background: transparent;
	}

	.m3-menu {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1101;
		min-width: 112px;
		padding-block: 4px;
		border-radius: var(--m3-sys-shape-extra-small);
		background: var(--m3-sys-surface-container);
		color: var(--m3-sys-on-surface);
		box-shadow: var(--m3-sys-elevation-2);
		overflow-y: auto;
		overscroll-behavior: contain;
		animation: m3-menu-in var(--m3-motion-spatial-default);
	}

	.p-bottom-start {
		transform-origin: top left;
	}
	.p-bottom {
		transform-origin: top center;
	}
	.p-bottom-end {
		transform-origin: top right;
	}
	.p-top-start {
		transform-origin: bottom left;
	}
	.p-top {
		transform-origin: bottom center;
	}
	.p-top-end {
		transform-origin: bottom right;
	}

	@keyframes m3-menu-in {
		from {
			opacity: 0;
			transform: scale(0.9);
		}
	}
</style>
