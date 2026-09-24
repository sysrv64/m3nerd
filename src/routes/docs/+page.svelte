<script lang="ts">
	const themingRows = [
		{
			token: '--m3-sys-primary',
			def: 'light-dark(#006a6a, #4fd8eb)',
			notes: 'Brand color for filled buttons, focus rings, links'
		},
		{
			token: '--m3-sys-surface',
			def: 'light-dark(#fef7ff, #141218)',
			notes: 'Base page surface; switches with color-scheme'
		},
		{
			token: '--m3-sys-surface-container',
			def: 'light-dark(#efedf1, #211f26)',
			notes: 'Cards, nav bars, and elevated panels'
		},
		{
			token: '--m3-sys-shape-medium',
			def: '12px',
			notes: 'One step of the 10-step corner radius scale'
		},
		{
			token: 'data-density="compact"',
			def: 'scale 0.875',
			notes: 'Tighter control heights and rows (spacious = 1.125)'
		},
		{
			token: 'data-focus-mode="tv"',
			def: '64px targets',
			notes: '10-foot mode: larger targets, focus scale 1.05'
		},
		{
			token: 'data-theme="dark"',
			def: 'auto',
			notes: 'Forces color-scheme; remove attribute to follow the system'
		}
	];

	const breakpointRows = [
		{ name: 'compact', range: '< 600px', use: 'Phones — bottom nav bar, single column' },
		{ name: 'medium', range: '600–839px', use: 'Large phones / small tablets — navigation rail' },
		{ name: 'expanded', range: '840–1199px', use: 'Tablets — two-pane layouts, denser rows' },
		{ name: 'large', range: '1200–1599px', use: 'Notebooks — expanded rail, side sheets' },
		{ name: 'xlarge', range: '≥ 1600px', use: 'Desktop / TV — max-width content, 10-foot focus' }
	];

	const motionRows = [
		{
			token: '--m3-motion-spatial-default',
			value: '500ms cubic-bezier(0.38, 1.21, 0.22, 1)',
			notes: 'Hero spatial moves; may overshoot'
		},
		{
			token: '--m3-motion-spatial-fast',
			value: '350ms cubic-bezier(0.42, 1.67, 0.21, 0.9)',
			notes: 'Snappy spatial moves; may overshoot'
		},
		{
			token: '--m3-motion-spatial-slow',
			value: '650ms cubic-bezier(0.39, 1.29, 0.35, 0.98)',
			notes: 'Large spatial moves; may overshoot'
		},
		{
			token: '--m3-motion-default',
			value: '200ms cubic-bezier(0.34, 0.8, 0.34, 1)',
			notes: 'Effects — color and opacity; never overshoots'
		},
		{
			token: '--m3-motion-fast',
			value: '150ms cubic-bezier(0.31, 0.94, 0.34, 1)',
			notes: 'State layers and micro-interactions'
		},
		{
			token: '--m3-motion-slow',
			value: '300ms cubic-bezier(0.34, 0.88, 0.34, 1)',
			notes: 'Slower effects; never overshoots'
		},
		{
			token: '--m3-motion-standard-default',
			value: '200ms cubic-bezier(0.27, 1.06, 0.18, 1)',
			notes: 'Calmer standard scheme for non-hero surfaces'
		}
	];
</script>

<svelte:head>
	<title>Getting started — M3Nerd</title>
	<meta name="description" content="Install, use, theme, and adapt M3Nerd in your Svelte app." />
</svelte:head>

<header class="page-head">
	<h1 class="page-title">Getting started</h1>
	<p class="page-lead">
		M3Nerd ships Svelte 5 components and pure CSS tokens. There is no runtime theming layer —
		if you can edit CSS variables, you can retheme the whole library.
	</p>
</header>

<section class="doc-section" id="install">
	<h2>Install</h2>
	<pre><code>npm i m3nerd</code></pre>
	<p>
		Requires Svelte 5 (>= 5.46). The package is ESM-only and peer-depends on
		<code>svelte</code>.
	</p>
</section>

<section class="doc-section" id="usage">
	<h2>Usage</h2>
	<p>Import the stylesheet once at your app root, then use components anywhere:</p>
	<pre><code>&lt;script lang="ts"&gt;
	import '../lib/styles.css';
	import &#123; Button, Card, TextField &#125; from 'm3nerd';
&lt;/script&gt;

&lt;Card variant="elevated"&gt;
	&lt;TextField label="Email" placeholder="you@example.com" /&gt;
	&lt;Button variant="filled" onclick=&#123;submit&#125;&gt;Subscribe&lt;/Button&gt;
&lt;/Card&gt;</code></pre>
	<p>
		In this repository the styles are imported relatively (<code
			>import '../lib/styles.css'</code
		>) because <code>m3nerd/styles.css</code> only resolves from the published package.
	</p>
</section>

<section class="doc-section" id="theming">
	<h2>Theming</h2>
	<p>
		Every color, shape, and density value is a CSS custom property. Override them on
		<code>:root</code> (or any subtree). Light and dark values both travel in
		<code>light-dark()</code>, so a single override updates both schemes.
	</p>
	<div class="table-wrap">
		<table>
			<thead>
				<tr>
					<th>Token / attribute</th>
					<th>Default</th>
					<th>Notes</th>
				</tr>
			</thead>
			<tbody>
				{#each themingRows as row (row.token)}
					<tr>
						<td><code>{row.token}</code></td>
						<td><code>{row.def}</code></td>
						<td>{row.notes}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<pre><code>:root &#123;
	--m3-sys-primary: light-dark(#b3261e, #ffb4ab);
	--m3-sys-shape-medium: 16px;
&#125;

:root[data-theme='dark'] &#123;
	color-scheme: dark;
&#125;</code></pre>
</section>

<section class="doc-section" id="adaptivity">
	<h2>Adaptivity</h2>
	<p>
		Five breakpoints, matching the Material Foundations spec. Components branch on tokens and
		CSS media/container queries — no resize observers in userland.
	</p>
	<div class="table-wrap">
		<table>
			<thead>
				<tr>
					<th>Breakpoint</th>
					<th>Width</th>
					<th>Typical layout</th>
				</tr>
			</thead>
			<tbody>
				{#each breakpointRows as row (row.name)}
					<tr>
						<td><strong>{row.name}</strong></td>
						<td><code>{row.range}</code></td>
						<td>{row.use}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<h3>Density</h3>
	<p>
		Set <code>data-density</code> on <code>&lt;html&gt;</code> to trade comfort for rows.
		<code>compact</code> shrinks control heights to 0.875×; <code>spacious</code> grows them to
		1.125×.
	</p>
	<pre><code>&lt;html data-density="compact"&gt;</code></pre>

	<h3>TV focus mode</h3>
	<p>
		Set <code>data-focus-mode="tv"</code> for 10-foot interfaces: 64px touch targets, 52px
		controls, larger body type, and a glowing focus ring that scales the focused element.
	</p>
	<pre><code>&lt;html data-focus-mode="tv"&gt;</code></pre>
</section>

<section class="doc-section" id="motion">
	<h2>Motion</h2>
	<p>
		Official Material 3 Expressive springs, pre-converted to cubic-bezier and duration pairs.
		Spatial tokens may overshoot; effect tokens (color, opacity) are critically damped.
		<code>prefers-reduced-motion</code> collapses every composite token to 1ms.
	</p>
	<div class="table-wrap">
		<table>
			<thead>
				<tr>
					<th>Token</th>
					<th>Value</th>
					<th>Notes</th>
				</tr>
			</thead>
			<tbody>
				{#each motionRows as row (row.token)}
					<tr>
						<td><code>{row.token}</code></td>
						<td><code>{row.value}</code></td>
						<td>{row.notes}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>

<style>
	.page-head {
		display: grid;
		gap: 12px;
		margin-bottom: 40px;
	}

	.page-title {
		margin: 0;
		font: var(--m3-sys-typescale-headline-large-weight) var(--m3-sys-typescale-headline-large) /
			var(--m3-sys-typescale-headline-large-line) var(--m3-sys-font);
	}

	.page-lead {
		margin: 0;
		max-width: 62ch;
		color: var(--m3-sys-on-surface-variant);
		font: var(--m3-sys-typescale-body-large-weight) var(--m3-sys-typescale-body-large) /
			var(--m3-sys-typescale-body-large-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-body-large-tracking);
	}

	.doc-section {
		display: grid;
		gap: 16px;
		margin-bottom: 48px;
	}

	.doc-section h2 {
		margin: 0;
		font: var(--m3-sys-typescale-headline-small-weight) var(--m3-sys-typescale-headline-small) /
			var(--m3-sys-typescale-headline-small-line) var(--m3-sys-font);
	}

	.doc-section h3 {
		margin: 8px 0 0;
		font: var(--m3-sys-typescale-title-large-weight) var(--m3-sys-typescale-title-large) /
			var(--m3-sys-typescale-title-large-line) var(--m3-sys-font);
	}

	.doc-section p {
		margin: 0;
		max-width: 62ch;
		color: var(--m3-sys-on-surface-variant);
		font: var(--m3-sys-typescale-body-medium-weight) var(--m3-sys-typescale-body-medium) /
			var(--m3-sys-typescale-body-medium-line) var(--m3-sys-font);
	}

	.doc-section code {
		font-family: var(--m3-sys-font-mono);
		font-size: 0.9em;
	}

	.doc-section :not(pre) > code {
		padding: 2px 6px;
		border-radius: var(--m3-sys-shape-extra-small);
		background: var(--m3-sys-surface-container-high);
		color: var(--m3-sys-on-surface);
	}

	pre {
		margin: 0;
		padding: 20px;
		overflow-x: auto;
		border: 1px solid var(--m3-sys-outline-variant);
		border-radius: var(--m3-sys-shape-medium);
		background: var(--m3-sys-surface-container-low);
		color: var(--m3-sys-on-surface);
		font: 400 0.875rem/1.55 var(--m3-sys-font-mono);
	}

	.table-wrap {
		overflow-x: auto;
		border: 1px solid var(--m3-sys-outline-variant);
		border-radius: var(--m3-sys-shape-medium);
		background: var(--m3-sys-surface-container-low);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	th,
	td {
		padding: 12px 16px;
		text-align: start;
		vertical-align: top;
		border-bottom: 1px solid var(--m3-sys-outline-variant);
	}

	th {
		background: var(--m3-sys-surface-container);
		color: var(--m3-sys-on-surface);
		font-weight: 600;
		white-space: nowrap;
	}

	td {
		color: var(--m3-sys-on-surface-variant);
	}

	tr:last-child td {
		border-bottom: none;
	}

	td code {
		white-space: nowrap;
	}
</style>
