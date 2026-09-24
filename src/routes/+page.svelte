<script lang="ts">
	import { base } from '$app/paths';
	import { Button, Card } from '$lib';

	const features = [
		{
			icon: 'animation',
			title: 'Expressive motion',
			body: 'Official spring beziers and durations as CSS tokens. Spatial effects may overshoot; color and opacity stay critically damped.'
		},
		{
			icon: 'devices',
			title: 'Five breakpoints',
			body: 'Compact to xlarge — phone, tablet, notebook, desktop, and TV layouts from one set of tokens.'
		},
		{
			icon: 'palette',
			title: 'Zero-runtime tokens',
			body: 'CSS custom properties and light-dark(). No JavaScript in the critical path, no theme flash.'
		},
		{
			icon: 'construction',
			title: 'Useful components only',
			body: 'A focused set: buttons, cards, forms, overlays, navigation, feedback. No widgets you will delete.'
		}
	];

	const frames = [
		{ key: '375', label: '375 — compact', width: 375, display: 176 },
		{ key: '768', label: '768 — medium', width: 768, display: 256 },
		{ key: '1280', label: '1280 — large', width: 1280, display: 424 }
	];
</script>

<svelte:head>
	<title>M3Nerd — Material 3 Expressive for Svelte</title>
	<meta
		name="description"
		content="Material 3 Expressive for Svelte — fast, adaptive, opinionated."
	/>
</svelte:head>

<section class="hero">
	<p class="hero-kicker">Material 3 Expressive · Svelte 5</p>
	<h1 class="hero-title">M3Nerd</h1>
	<p class="hero-tagline">Material 3 Expressive for Svelte — fast, adaptive, opinionated.</p>
	<div class="hero-ctas">
		<Button href={`${base}/docs/`} size="l">Get started</Button>
		<Button href={`${base}/components/`} variant="tonal" size="l">Components</Button>
		<Button href="https://github.com/sysrv64/m3nerd" variant="outlined" size="l">GitHub</Button>
	</div>
</section>

<section class="features" aria-label="Features">
	{#each features as feature (feature.title)}
		<Card variant="elevated" class="feature-card">
			<div class="feature-inner">
				<span class="material-symbols-outlined feature-icon" aria-hidden="true"
					>{feature.icon}</span
				>
				<h2 class="feature-title">{feature.title}</h2>
				<p class="feature-body">{feature.body}</p>
			</div>
		</Card>
	{/each}
</section>

<section class="previews" aria-label="Device width previews">
	<div class="previews-head">
		<h2 class="section-title">One card, three widths</h2>
		<p class="section-sub">
			The same sample card rendered at 375, 768, and 1280 CSS pixels, scaled down. Layouts
			respond with container queries and the shared breakpoint tokens.
		</p>
	</div>
	<div class="preview-strip">
		{#each frames as frame (frame.key)}
			<figure class="preview-item">
				<div
					class="frame"
					style="width: {frame.display}px"
				>
					<div
						class="frame-inner"
						style="width: {frame.width}px; transform: scale({frame.display / frame.width})"
					>
						<article class="sample">
							<div class="sample-media" aria-hidden="true"></div>
							<div class="sample-body">
								<div class="sample-meta">
									<span class="sample-chip">Expressive</span>
									<span class="sample-time">Now</span>
								</div>
								<h3 class="sample-title">Adaptive by default</h3>
								<p class="sample-text">
									This card keeps 16px gutters on a phone and splits into media plus
									content columns once there is room for it.
								</p>
								<div class="sample-actions">
									<span class="sample-btn primary">Continue</span>
									<span class="sample-btn">Dismiss</span>
								</div>
							</div>
						</article>
					</div>
				</div>
				<figcaption class="frame-caption">{frame.label}</figcaption>
			</figure>
		{/each}
	</div>
</section>

<footer class="site-footer">
	<p>M3Nerd is MIT licensed. Built with Svelte 5 and Vite.</p>
	<div class="footer-links">
		<a href={`${base}/docs/`}>Docs</a>
		<a href={`${base}/components/`}>Components</a>
		<a href="https://github.com/sysrv64/m3nerd">GitHub</a>
		<a href="https://kerneldroid.github.io/m3nerd">Live demo</a>
	</div>
</footer>

<style>
	.hero {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
		padding-block: 48px 56px;
	}

	.hero-kicker {
		margin: 0;
		color: var(--m3-sys-primary);
		font: var(--m3-sys-typescale-label-large-weight) var(--m3-sys-typescale-label-large) /
			var(--m3-sys-typescale-label-large-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-label-large-tracking);
		text-transform: uppercase;
	}

	.hero-title {
		margin: 0;
		font-weight: 500;
		font-size: clamp(3rem, 10vw, 5.5rem);
		line-height: 1.05;
		letter-spacing: -0.02em;
	}

	.hero-tagline {
		margin: 0;
		max-width: 36ch;
		color: var(--m3-sys-on-surface-variant);
		font: var(--m3-sys-typescale-headline-medium-weight) var(--m3-sys-typescale-headline-medium) /
			var(--m3-sys-typescale-headline-medium-line) var(--m3-sys-font);
	}

	.hero-ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 8px;
	}

	.features {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 16px;
		padding-block: 8px 48px;
	}

	:global(.feature-card) {
		height: 100%;
	}

	.feature-inner {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 24px;
	}

	.feature-icon {
		font-size: 28px;
		color: var(--m3-sys-primary);
	}

	.feature-title {
		margin: 0;
		font: var(--m3-sys-typescale-title-large-weight) var(--m3-sys-typescale-title-large) /
			var(--m3-sys-typescale-title-large-line) var(--m3-sys-font);
	}

	.feature-body {
		margin: 0;
		color: var(--m3-sys-on-surface-variant);
		font: var(--m3-sys-typescale-body-medium-weight) var(--m3-sys-typescale-body-medium) /
			var(--m3-sys-typescale-body-medium-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-body-medium-tracking);
	}

	.previews {
		padding-block: 16px 56px;
		border-top: 1px solid var(--m3-sys-outline-variant);
	}

	.previews-head {
		display: grid;
		gap: 8px;
		margin-bottom: 24px;
	}

	.section-title {
		margin: 0;
		font: var(--m3-sys-typescale-headline-small-weight) var(--m3-sys-typescale-headline-small) /
			var(--m3-sys-typescale-headline-small-line) var(--m3-sys-font);
	}

	.section-sub {
		margin: 0;
		max-width: 60ch;
		color: var(--m3-sys-on-surface-variant);
		font: var(--m3-sys-typescale-body-medium-weight) var(--m3-sys-typescale-body-medium) /
			var(--m3-sys-typescale-body-medium-line) var(--m3-sys-font);
	}

	.preview-strip {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 24px;
	}

	.preview-item {
		margin: 0;
		display: grid;
		gap: 8px;
	}

	.frame {
		height: 300px;
		overflow: hidden;
		border: 1px solid var(--m3-sys-outline-variant);
		border-radius: var(--m3-sys-shape-medium);
		background: var(--m3-sys-surface-container-lowest);
		box-shadow: var(--m3-sys-elevation-1);
	}

	.frame-inner {
		transform-origin: top left;
		padding: 16px;
		container-type: inline-size;
	}

	.frame-caption {
		color: var(--m3-sys-on-surface-variant);
		font: var(--m3-sys-typescale-label-medium-weight) var(--m3-sys-typescale-label-medium) /
			var(--m3-sys-typescale-label-medium-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-label-medium-tracking);
	}

	.sample {
		display: grid;
		gap: 16px;
		padding: 16px;
		border-radius: var(--m3-sys-shape-large);
		background: var(--m3-sys-surface-container);
		color: var(--m3-sys-on-surface);
	}

	.sample-media {
		height: 140px;
		border-radius: var(--m3-sys-shape-medium);
		background:
			linear-gradient(
				135deg,
				var(--m3-sys-primary-container),
				var(--m3-sys-tertiary-container)
			);
	}

	.sample-body {
		display: grid;
		gap: 10px;
		align-content: start;
	}

	.sample-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}

	.sample-chip {
		padding: 4px 12px;
		border-radius: var(--m3-sys-shape-small);
		background: var(--m3-sys-secondary-container);
		color: var(--m3-sys-on-secondary-container);
		font-size: 12px;
		font-weight: 500;
	}

	.sample-time {
		color: var(--m3-sys-on-surface-variant);
		font-size: 12px;
	}

	.sample-title {
		margin: 0;
		font-size: 22px;
		line-height: 1.27;
	}

	.sample-text {
		margin: 0;
		color: var(--m3-sys-on-surface-variant);
		font-size: 14px;
		line-height: 1.43;
	}

	.sample-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 4px;
	}

	.sample-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 36px;
		padding-inline: 16px;
		border-radius: var(--m3-sys-shape-full);
		box-shadow: inset 0 0 0 1px var(--m3-sys-outline-variant);
		font-size: 14px;
		font-weight: 500;
	}

	.sample-btn.primary {
		background: var(--m3-sys-primary);
		color: var(--m3-sys-on-primary);
		box-shadow: none;
	}

	@container (min-width: 700px) {
		.sample {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			align-items: stretch;
			padding: 24px;
		}

		.sample-media {
			height: auto;
			min-height: 220px;
		}
	}

	@container (min-width: 1100px) {
		.sample {
			grid-template-columns: 1.2fr 1fr;
		}

		.sample-title {
			font-size: 28px;
		}
	}

	.site-footer {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding-block: 24px;
		border-top: 1px solid var(--m3-sys-outline-variant);
		color: var(--m3-sys-on-surface-variant);
		font-size: 14px;
	}

	.site-footer p {
		margin: 0;
	}

	.footer-links {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
	}

	.footer-links a {
		color: var(--m3-sys-primary);
		text-decoration: none;
	}

	.footer-links a:hover {
		text-decoration: underline;
	}
</style>
