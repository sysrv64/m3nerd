<script lang="ts">
	import type { Snippet } from 'svelte';
	import { placeNear } from '../../utils/anchor.js';

	let {
		open = $bindable(false),
		anchor = null,
		placement = 'bottom-start',
		class: className = '',
		children,
		onclose,
		...rest
	}: {
		open?: boolean;
		anchor?: HTMLElement | null;
		placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
		class?: string;
		children?: Snippet;
		onclose?: (e?: Event) => void;
		[key: string]: unknown;
	} = $props();

	let menuEl = $state<HTMLDivElement | null>(null);
	let pos = $state.raw<{ top: number; left: number; maxHeight: number } | null>(null);
	let prevFocus = $state<HTMLElement | null>(null);

	function close(e?: Event) {
		if (!open) return;
		open = false;
		if (prevFocus && !prevFocus.isConnected) prevFocus = null;
		prevFocus?.focus({ preventScroll: true });
		prevFocus = null;
		onclose?.(e);
	}

	$effect(() => {
		if (!open) return;
		const el = menuEl;
		if (!el) return;
		prevFocus = document.activeElement as HTMLElement | null;
		if (anchor) {
			const placed = placeNear(
				anchor.getBoundingClientRect(),
				{ width: el.offsetWidth, height: el.offsetHeight },
				{ width: window.innerWidth, height: window.innerHeight },
				placement
			);
			pos = { top: placed.top, left: placed.left, maxHeight: placed.maxHeight };
		}
		queueMicrotask(() => {
			el.querySelector<HTMLElement>(
				'button:not(:disabled), [role="menuitem"]:not([aria-disabled="true"])'
			)?.focus({ preventScroll: true });
		});
	});

	$effect(() => {
		if (!open) return;

		function onPointerDown(e: PointerEvent) {
			const target = e.target as Node | null;
			if (!target) return;
			if (menuEl?.contains(target)) return;
			if (anchor?.contains(target)) return;
			close();
		}

		function onKeydown(e: KeyboardEvent) {
			if (e.key !== 'Escape') return;
			close(e);
		}

		document.addEventListener('pointerdown', onPointerDown, true);
		document.addEventListener('keydown', onKeydown);
		return () => {
			document.removeEventListener('pointerdown', onPointerDown, true);
			document.removeEventListener('keydown', onKeydown);
		};
	});
</script>

{#if open}
	<div
		bind:this={menuEl}
		class="ig-menu ig-glass {anchor ? '' : 'no-anchor'} {placement.startsWith('top') ? 'top' : ''} {placement.endsWith(
			'end'
		)
			? 'end'
			: ''} {className}"
		role="menu"
		style:top={pos ? `${pos.top}px` : anchor ? '-9999px' : undefined}
		style:left={pos ? `${pos.left}px` : anchor ? '-9999px' : undefined}
		style:max-height={pos ? `${pos.maxHeight}px` : undefined}
		{...rest}
	>
		{@render children?.()}
	</div>
{/if}

<style>
	.ig-menu {
		position: fixed;
		z-index: 1000;
		min-width: 112px;
		padding: 2px;
		display: flex;
		flex-direction: column;
		background: var(--ig-popup-bg);
		border: 1px solid var(--ig-border);
		border-radius: var(--ig-window-rounding);
		color: var(--ig-text);
		overflow-y: auto;
		overscroll-behavior: contain;
		transform-origin: top left;
		animation: ig-menu-in 120ms linear;
	}

	.ig-menu.top {
		transform-origin: bottom left;
	}

	.ig-menu.end {
		transform-origin: top right;
	}

	.ig-menu.top.end {
		transform-origin: bottom right;
	}

	.ig-menu.no-anchor {
		position: absolute;
		inset: auto;
	}

	@keyframes ig-menu-in {
		from {
			opacity: 0;
			transform: scale(0.98);
		}
	}
</style>
