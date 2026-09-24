<script lang="ts">
	import '../lib/styles.css';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	type ThemePref = 'auto' | 'light' | 'dark';
	let theme = $state<ThemePref>('auto');

	const themeOrder: ThemePref[] = ['auto', 'light', 'dark'];

	function cycleTheme() {
		const i = themeOrder.indexOf(theme);
		theme = themeOrder[(i + 1) % themeOrder.length];
	}

	$effect(() => {
		const root = document.documentElement;
		if (theme === 'auto') delete root.dataset.theme;
		else root.dataset.theme = theme;
	});

	const themeIcon = $derived(
		theme === 'auto' ? 'brightness_auto' : theme === 'light' ? 'light_mode' : 'dark_mode'
	);
	const themeLabel = $derived(
		theme === 'auto'
			? 'Theme: follow system'
			: theme === 'light'
				? 'Theme: light'
				: 'Theme: dark'
	);

	const nav = [
		{ href: `${base}/`, label: 'Home', icon: 'home' },
		{ href: `${base}/docs/`, label: 'Docs', icon: 'menu_book' },
		{ href: `${base}/components/`, label: 'Components', icon: 'widgets' },
		{ href: `${base}/imgui/`, label: 'ImGUI', icon: 'dashboard' }
	];

	const pathname = $derived(page.url.pathname);

	function isActive(href: string): boolean {
		if (pathname === href) return true;
		if (href !== `${base}/` && pathname.startsWith(href)) return true;
		return href !== `${base}/` && pathname === href.slice(0, -1);
	}
</script>

<a class="skip-link" href="#main">Skip to content</a>

<header class="topbar">
	<a class="brand" href={`${base}/`}>
		<span class="brand-mark" aria-hidden="true">M3</span>
		<span class="brand-name">M3Nerd</span>
	</a>
	<div class="topbar-actions">
		<button class="icon-ctl" type="button" onclick={cycleTheme} aria-label={themeLabel} title={themeLabel}>
			<span class="material-symbols-outlined" aria-hidden="true">{themeIcon}</span>
		</button>
		<a
			class="gh-link"
			href="https://github.com/sysrv64/m3nerd"
			target="_blank"
			rel="noreferrer"
		>
			<span class="material-symbols-outlined" aria-hidden="true">code</span>
			<span class="gh-text">GitHub</span>
		</a>
	</div>
</header>

<div class="shell">
	<nav class="sidenav" aria-label="Sections">
		{#each nav as item (item.href)}
			<a
				class="nav-link"
				class:active={isActive(item.href)}
				href={item.href}
				aria-current={isActive(item.href) ? 'page' : undefined}
			>
				<span class="material-symbols-outlined" aria-hidden="true">{item.icon}</span>
				<span class="nav-label">{item.label}</span>
			</a>
		{/each}
	</nav>

	<main id="main">
		{@render children()}
	</main>
</div>

<style>
	:global(:root[data-theme='light']) {
		color-scheme: light;
	}

	:global(:root[data-theme='dark']) {
		color-scheme: dark;
	}

	:global(body) {
		margin: 0;
		min-height: 100dvh;
		background: var(--m3-sys-surface);
		color: var(--m3-sys-on-surface);
		font-family: var(--m3-sys-font);
	}

	:global(a) {
		color: var(--m3-sys-primary);
	}

	.skip-link {
		position: absolute;
		inset-inline-start: -9999px;
		top: 0;
		z-index: 100;
		padding: 8px 16px;
		background: var(--m3-sys-primary);
		color: var(--m3-sys-on-primary);
		border-radius: var(--m3-sys-shape-small);
	}

	.skip-link:focus {
		inset-inline-start: 8px;
	}

	.topbar {
		position: sticky;
		top: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		height: 64px;
		padding-inline: var(--m3-layout-gutter);
		background: var(--m3-sys-surface-container-low);
		color: var(--m3-sys-on-surface);
		box-shadow: var(--m3-sys-elevation-2);
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		color: inherit;
		text-decoration: none;
		font-weight: 600;
	}

	.brand-mark {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: var(--m3-sys-shape-large);
		background: var(--m3-sys-primary);
		color: var(--m3-sys-on-primary);
		font-size: 0.95rem;
		letter-spacing: 0.02em;
	}

	.brand-name {
		font-size: var(--m3-sys-typescale-title-medium);
		letter-spacing: var(--m3-sys-typescale-title-medium-tracking);
	}

	.topbar-actions {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.icon-ctl {
		display: inline-flex;
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
		transition: background-color var(--m3-motion-fast);
	}

	.icon-ctl:hover {
		background: color-mix(in srgb, var(--m3-sys-on-surface) 8%, transparent);
	}

	.gh-link {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: var(--m3-touch-target);
		padding-inline: 16px;
		border-radius: var(--m3-sys-shape-full);
		background: var(--m3-sys-secondary-container);
		color: var(--m3-sys-on-secondary-container);
		text-decoration: none;
		font: var(--m3-sys-typescale-label-large-weight) var(--m3-sys-typescale-label-large) /
			var(--m3-sys-typescale-label-large-line) var(--m3-sys-font);
		transition:
			background-color var(--m3-motion-fast),
			transform var(--m3-motion-spatial-fast);
	}

	.gh-link:hover {
		background: color-mix(in srgb, var(--m3-sys-secondary-container) 88%, var(--m3-sys-on-surface));
	}

	.gh-link:active {
		transform: scale(0.97);
	}

	.shell {
		display: grid;
		grid-template-areas:
			'nav'
			'main';
		grid-template-columns: minmax(0, 1fr);
		max-width: var(--m3-layout-max-width);
		margin-inline: auto;
	}

	.sidenav {
		grid-area: nav;
		display: flex;
		gap: 4px;
		padding: 8px var(--m3-layout-gutter);
		overflow-x: auto;
		border-bottom: 1px solid var(--m3-sys-outline-variant);
		background: var(--m3-sys-surface-container-low);
	}

	.nav-link {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		flex-shrink: 0;
		min-height: 40px;
		padding-inline: 14px;
		border-radius: var(--m3-sys-shape-full);
		color: var(--m3-sys-on-surface-variant);
		text-decoration: none;
		font: var(--m3-sys-typescale-label-large-weight) var(--m3-sys-typescale-label-large) /
			var(--m3-sys-typescale-label-large-line) var(--m3-sys-font);
		transition:
			background-color var(--m3-motion-fast),
			color var(--m3-motion-fast);
	}

	.nav-link:hover {
		background: color-mix(in srgb, var(--m3-sys-on-surface) 8%, transparent);
		color: var(--m3-sys-on-surface);
	}

	.nav-link.active {
		background: var(--m3-sys-secondary-container);
		color: var(--m3-sys-on-secondary-container);
	}

	.nav-link .material-symbols-outlined {
		font-size: 20px;
	}

	#main {
		grid-area: main;
		min-width: 0;
		max-width: 100%;
		overflow-x: clip;
		padding: 32px var(--m3-layout-gutter) 64px;
	}

	@media (min-width: 600px) {
		.shell {
			grid-template-areas: 'nav main';
			grid-template-columns: 200px minmax(0, 1fr);
			align-items: start;
		}

		.sidenav {
			position: sticky;
			top: 64px;
			flex-direction: column;
			align-items: stretch;
			height: calc(100dvh - 64px);
			padding: 24px 16px;
			border-bottom: none;
			border-inline-end: 1px solid var(--m3-sys-outline-variant);
			overflow-x: hidden;
			overflow-y: auto;
		}

		.nav-link {
			min-height: var(--m3-control-height);
			border-radius: var(--m3-sys-shape-full);
		}
	}

	@media (max-width: 599px) {
		.gh-text {
			display: none;
		}

		.gh-link {
			padding-inline: 12px;
		}
	}
</style>
