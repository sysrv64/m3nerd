<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { cn } from '../../utils/cn.js';
import NavigationBar from './NavigationBar.svelte';
import NavigationRail from './NavigationRail.svelte';

interface NavItem {
	id: string;
	label: string;
	icon: string;
	href?: string;
	disabled?: boolean;
	badge?: string | number;
}

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
	items: NavItem[];
	activeId?: string;
	variant?: 'auto' | 'bar' | 'rail' | 'drawer';
	railExpanded?: boolean;
	brand?: Snippet;
	actions?: Snippet;
	children?: Snippet;
	class?: string;
}

let {
	items,
	activeId = $bindable(''),
	variant = 'auto',
	railExpanded,
	brand,
	actions,
	children,
	class: className,
	...rest
}: Props = $props();

let drawerOpen = $state(false);

const drawerId = 'm3-nav-suite-drawer';
const manyItems = $derived(items.length > 5);
const showDrawer = $derived(variant === 'drawer' || (variant === 'auto' && manyItems));
const railExpandedAttr = $derived(
	railExpanded === true ? 'true' : railExpanded === false ? 'false' : 'auto'
);

function toggleDrawer() {
	drawerOpen = !drawerOpen;
}

function closeDrawer() {
	drawerOpen = false;
}

function activate(id: string) {
	activeId = id;
	if (showDrawer) drawerOpen = false;
}

$effect(() => {
	if (!drawerOpen) return;
	const onKey = (e: KeyboardEvent) => {
		if (e.key === 'Escape') drawerOpen = false;
	};
	window.addEventListener('keydown', onKey);
	return () => window.removeEventListener('keydown', onKey);
});
</script>

<div
	class={cn('m3-nav-suite', manyItems && 'drawer-path', className)}
	data-variant={variant}
	data-rail-expanded={railExpandedAttr}
	{...rest}
>
	<header class="suite-bar">
		{#if showDrawer}
			<button
				type="button"
				class="suite-drawer-toggle"
				aria-label="Open navigation"
				aria-expanded={drawerOpen}
				aria-controls={drawerId}
				onclick={toggleDrawer}
			>
				<span class="material-symbols-outlined" aria-hidden="true">menu</span>
			</button>
		{/if}
		<div class="suite-brand">{@render brand?.()}</div>
		<div class="suite-actions">{@render actions?.()}</div>
	</header>

	<div class="suite-scrim" class:open={drawerOpen} role="presentation" onclick={closeDrawer}></div>
	<aside class="suite-drawer" class:open={drawerOpen} id={drawerId} inert={!drawerOpen} aria-hidden={!drawerOpen}>
		<div class="drawer-header">
			<button
				type="button"
				class="drawer-close"
				aria-label="Close navigation"
				onclick={closeDrawer}
			>
				<span class="material-symbols-outlined" aria-hidden="true">close</span>
			</button>
			<div class="drawer-brand">{@render brand?.()}</div>
		</div>
		<nav class="drawer-nav" aria-label="Primary">
			{#each items as item (item.id)}
				{#if item.href}
					<a
						class="drawer-item"
						href={item.disabled ? undefined : item.href}
						aria-current={item.id === activeId ? 'page' : undefined}
						aria-disabled={item.disabled || undefined}
						data-active={item.id === activeId}
						title={item.label}
						onclick={item.disabled ? undefined : () => activate(item.id)}
					>
						<span class="drawer-icon"><span class="material-symbols-outlined" aria-hidden="true">{item.icon}</span></span>
						<span class="drawer-label">{item.label}</span>
						{#if item.badge != null && item.badge !== ''}
							<span class="drawer-badge">{item.badge}</span>
						{/if}
					</a>
				{:else}
					<button
						type="button"
						class="drawer-item"
						disabled={item.disabled}
						aria-current={item.id === activeId ? 'page' : undefined}
						data-active={item.id === activeId}
						title={item.label}
						onclick={() => activate(item.id)}
					>
						<span class="drawer-icon"><span class="material-symbols-outlined" aria-hidden="true">{item.icon}</span></span>
						<span class="drawer-label">{item.label}</span>
						{#if item.badge != null && item.badge !== ''}
							<span class="drawer-badge">{item.badge}</span>
						{/if}
					</button>
				{/if}
			{/each}
		</nav>
		{#if actions}
			<div class="drawer-footer">{@render actions()}</div>
		{/if}
	</aside>

	<div class="suite-rail">
		<NavigationRail
			{items}
			bind:activeId
			expanded={railExpanded}
			class="suite-rail-body"
			{brand}
			{actions}
		/>
	</div>

	<div class="suite-bottom">
		<NavigationBar {items} bind:activeId />
	</div>

	<main class="m3-nav-suite__content">
		{@render children?.()}
	</main>
</div>

<style>
	.m3-nav-suite {
		min-height: 100dvh;
	}

	/* Suite chrome visibility — mobile-first defaults (compact auto) */
	.suite-bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 8px;
		height: var(--m3-nav-height);
		padding-inline: 8px;
		background: var(--m3-sys-surface-container);
		color: var(--m3-sys-on-surface);
	}

	.suite-brand {
		display: flex;
		align-items: center;
		min-width: 0;
		padding-inline: 8px;
	}

	.suite-actions {
		display: flex;
		align-items: center;
		gap: 4px;
		margin-inline-start: auto;
	}

	.suite-drawer-toggle,
	.drawer-close {
		display: none;
		align-items: center;
		justify-content: center;
		width: var(--m3-touch-target);
		height: var(--m3-touch-target);
		padding: 0;
		border: none;
		border-radius: var(--m3-sys-shape-full);
		background: transparent;
		color: var(--m3-sys-on-surface-variant);
		cursor: pointer;
		transition:
			background-color var(--m3-motion-fast),
			color var(--m3-motion-fast);
	}

	.drawer-close {
		display: inline-flex;
	}

	.suite-bottom {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 20;
		display: flex;
	}

	.suite-rail {
		display: none;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		z-index: 15;
		width: var(--m3-rail-width);
	}

	.suite-rail :global(.suite-rail-body) {
		width: 100%;
		height: 100%;
	}

	.m3-nav-suite__content {
		padding-top: var(--m3-nav-height);
		padding-bottom: var(--m3-nav-height);
		min-height: 100dvh;
	}

	/* Drawer path (auto + >5 items) and forced drawer variant */
	.m3-nav-suite.drawer-path .suite-bottom,
	.m3-nav-suite[data-variant='drawer'] .suite-bottom,
	.m3-nav-suite[data-variant='rail'] .suite-bottom,
	.m3-nav-suite[data-variant='rail'] .suite-bar {
		display: none;
	}

	.m3-nav-suite.drawer-path .suite-drawer-toggle,
	.m3-nav-suite[data-variant='drawer'] .suite-drawer-toggle {
		display: inline-flex;
	}

	.m3-nav-suite.drawer-path .m3-nav-suite__content,
	.m3-nav-suite[data-variant='drawer'] .m3-nav-suite__content {
		padding-bottom: 0;
	}

	.m3-nav-suite[data-variant='rail'] .suite-rail {
		display: flex;
	}

	.m3-nav-suite[data-variant='rail'] .m3-nav-suite__content {
		padding-top: 0;
		padding-bottom: 0;
		margin-left: var(--m3-rail-width);
	}

	.m3-nav-suite[data-variant='rail'] .suite-drawer,
	.m3-nav-suite[data-variant='rail'] .suite-scrim,
	.m3-nav-suite[data-variant='bar'] .suite-rail,
	.m3-nav-suite[data-variant='bar'] .suite-drawer-toggle {
		display: none;
	}

	.m3-nav-suite[data-variant='bar'] .suite-bar,
	.m3-nav-suite[data-variant='bar'] .suite-bottom {
		display: flex;
	}

	.m3-nav-suite[data-variant='bar'] .m3-nav-suite__content {
		margin-left: 0;
		padding-top: var(--m3-nav-height);
		padding-bottom: var(--m3-nav-height);
	}

	/* Rail expansion width (suite container mirrors NavigationRail) */
	.m3-nav-suite[data-rail-expanded='true'] .suite-rail {
		width: var(--m3-rail-width-expanded);
	}

	@media (min-width: 600px) {
		.m3-nav-suite[data-variant='auto'] .suite-bar,
		.m3-nav-suite[data-variant='auto'] .suite-bottom,
		.m3-nav-suite[data-variant='auto'] .suite-drawer-toggle {
			display: none;
		}

		.m3-nav-suite[data-variant='auto'] .suite-rail {
			display: flex;
		}

		.m3-nav-suite[data-variant='auto'] .suite-drawer,
		.m3-nav-suite[data-variant='auto'] .suite-scrim {
			display: none;
		}

		.m3-nav-suite[data-variant='auto'] .m3-nav-suite__content {
			padding-top: 0;
			padding-bottom: 0;
			margin-left: var(--m3-rail-width);
		}

		.m3-nav-suite[data-variant='auto'][data-rail-expanded='true'] .m3-nav-suite__content,
		.m3-nav-suite[data-variant='rail'][data-rail-expanded='true'] .m3-nav-suite__content {
			margin-left: var(--m3-rail-width-expanded);
		}
	}

	@media (min-width: 1200px) {
		.m3-nav-suite:not([data-rail-expanded='false']) .suite-rail {
			width: var(--m3-rail-width-expanded);
		}

		.m3-nav-suite[data-variant='auto']:not([data-rail-expanded='false'])
			.m3-nav-suite__content,
		.m3-nav-suite[data-variant='rail']:not([data-rail-expanded='false'])
			.m3-nav-suite__content {
			margin-left: var(--m3-rail-width-expanded);
		}
	}

	/* Drawer panel — transform only, instant width */
	.suite-scrim {
		display: none;
		position: fixed;
		inset: 0;
		z-index: 30;
		background: var(--m3-sys-scrim);
		opacity: 0;
		pointer-events: none;
		transition: opacity var(--m3-motion-default);
	}

	.suite-drawer {
		display: none;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		z-index: 40;
		flex-direction: column;
		width: var(--m3-drawer-width);
		max-width: 100vw;
		background: var(--m3-sys-surface-container-low);
		color: var(--m3-sys-on-surface);
		transform: translateX(-100%);
		pointer-events: none;
		transition: transform var(--m3-motion-default);
	}

	.m3-nav-suite.drawer-path .suite-scrim,
	.m3-nav-suite[data-variant='drawer'] .suite-scrim {
		display: block;
	}

	.m3-nav-suite.drawer-path .suite-drawer,
	.m3-nav-suite[data-variant='drawer'] .suite-drawer {
		display: flex;
	}

	.suite-scrim.open {
		opacity: 0.32;
		pointer-events: auto;
	}

	.suite-drawer.open {
		transform: translateX(0);
		pointer-events: auto;
	}

	.drawer-header {
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: var(--m3-nav-height);
		padding-inline: 8px 16px;
		border-bottom: 1px solid var(--m3-sys-outline-variant);
	}

	.drawer-brand {
		display: flex;
		align-items: center;
		min-width: 0;
	}

	.drawer-nav {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 12px 12px;
		overflow-y: auto;
		flex: 1;
	}

	.drawer-item {
		position: relative;
		display: flex;
		align-items: center;
		gap: 16px;
		width: 100%;
		min-height: var(--m3-row-height);
		padding: 8px 16px;
		border: none;
		border-radius: var(--m3-sys-shape-full);
		background: transparent;
		color: var(--m3-sys-on-surface-variant);
		text-align: start;
		text-decoration: none;
		cursor: pointer;
		font: var(--m3-sys-typescale-title-small-weight) var(--m3-sys-typescale-title-small) /
			var(--m3-sys-typescale-title-small-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-title-small-tracking);
		transition:
			background-color var(--m3-motion-fast),
			color var(--m3-motion-fast);
	}

	.drawer-item:hover:not(:disabled, [aria-disabled='true']) {
		background: color-mix(in srgb, var(--m3-sys-on-surface) 8%, transparent);
	}

	.drawer-item[data-active='true'] {
		background: var(--m3-sys-secondary-container);
		color: var(--m3-sys-on-secondary-container);
	}

	.drawer-item:disabled,
	.drawer-item[aria-disabled='true'] {
		opacity: 0.38;
		pointer-events: none;
	}

	.drawer-icon {
		display: inline-flex;
		flex-shrink: 0;
	}

	.drawer-label {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.drawer-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 16px;
		height: 16px;
		padding-inline: 4px;
		border-radius: var(--m3-sys-shape-full);
		background: var(--m3-sys-error-container);
		color: var(--m3-sys-on-error-container);
		font: var(--m3-sys-typescale-label-small-weight) var(--m3-sys-typescale-label-small) /
			var(--m3-sys-typescale-label-small-line) var(--m3-sys-font);
	}

	.drawer-footer {
		padding: 12px 16px 20px;
		border-top: 1px solid var(--m3-sys-outline-variant);
		display: flex;
		align-items: center;
		gap: 8px;
	}
</style>
