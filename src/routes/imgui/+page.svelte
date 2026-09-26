<script lang="ts">
	import '$lib/imgui/styles.css';
	import {
		IgWindow,
		IgButton,
		IgCheckbox,
		IgRadio,
		IgSlider,
		IgInput,
		IgSelectable,
		IgProgress,
		IgSeparator,
		IgText,
		IgTree,
		IgTabBar,
		IgTab,
		IgModal,
		IgMenu,
		IgMenuItem,
		IgRow,
		IgGroup
	} from '$lib/imgui';
	import type { TreeNode } from '$lib/imgui/components/Tree.svelte';

	let clicks = $state(0);
	let check = $state(true);
	let drink = $state('filter');
	let volume = $state(64);
	let query = $state('');
	let picked = $state('console');
	let progress = $state(65);
	let treeSel = $state('src/lib/imgui/styles.css');
	let tab = $state('preview');
	let menuOpen = $state(false);
	let menuAnchor = $state<HTMLElement | null>(null);
	let modalOpen = $state(false);

	const fileTree: TreeNode[] = [
		{
			id: 'src',
			label: 'src',
			icon: '📁',
			children: [
				{
					id: 'src/lib',
					label: 'lib',
					icon: '📁',
					children: [
						{
							id: 'src/lib/imgui',
							label: 'imgui',
							icon: '📁',
							children: [
								{
									id: 'src/lib/imgui/components',
									label: 'components',
									icon: '📁',
									children: [
										{ id: 'src/lib/imgui/components/Tree.svelte', label: 'Tree.svelte' },
										{ id: 'src/lib/imgui/components/TabBar.svelte', label: 'TabBar.svelte' },
										{ id: 'src/lib/imgui/components/Window.svelte', label: 'Window.svelte' }
									]
								},
								{ id: 'src/lib/imgui/styles.css', label: 'styles.css', icon: '🎨' },
								{ id: 'src/lib/imgui/index.ts', label: 'index.ts' }
							]
						},
						{ id: 'src/lib/styles.css', label: 'styles.css' }
					]
				},
				{
					id: 'src/routes',
					label: 'routes',
					icon: '📁',
					children: [
						{ id: 'src/routes/imgui', label: 'imgui', children: [{ id: 'src/routes/imgui/page', label: '+page.svelte' }] },
						{ id: 'src/routes/docs', label: 'docs', children: [{ id: 'src/routes/docs/page', label: '+page.svelte' }] }
					]
				}
			]
		},
		{ id: 'package.json', label: 'package.json', icon: '📦' },
		{ id: 'readme', label: 'README.md', disabled: true }
	];

	const tools = ['Console', 'Debugger', 'Profiler'];

	function onTreeSelect(id: string) {
		treeSel = id;
	}

	function confirmModal() {
		modalOpen = false;
	}
</script>

<svelte:head>
	<title>ImGUI — M3Nerd</title>
	<meta
		name="description"
		content="Dear ImGui aesthetics in Svelte: pixel type, classic dark palette, glass panels, touch-ready."
	/>
</svelte:head>

<header class="page-head">
	<h1 class="page-title">ImGUI</h1>
	<p class="page-lead">
		Dear ImGui aesthetics in Svelte: pixel type, classic dark palette, glass panels, touch-ready.
	</p>
	<nav class="toc" aria-label="On this page">
		<a href="#windows">Windows</a>
		<a href="#controls">Controls</a>
		<a href="#tree">Tree</a>
		<a href="#tabs">Tabs</a>
		<a href="#menu">Menu</a>
		<a href="#modal">Modal</a>
	</nav>
</header>

<div class="ig-root ig-gallery">
	<section class="ig-section" id="windows">
		<h2>Windows</h2>
		<p class="ig-section-desc">
			Glass panels with collapsible titles — drop controls inside for a classic tool window.
		</p>
		<div class="ig-stage">
			<IgWindow title="Inspector">
				<IgGroup>
					<IgText>Frame settings</IgText>
					<IgRow>
						<IgCheckbox bind:checked={check} label="Enable v-sync" />
					</IgRow>
					<IgRow>
						<span class="ig-field-label">Volume</span>
						<IgSlider bind:value={volume} min={0} max={100} label="Volume" />
						<span class="ig-field-val">{volume}</span>
					</IgRow>
					<IgSeparator />
					<IgRow>
						<IgButton onclick={() => (clicks += 1)}>Apply ({clicks})</IgButton>
						<IgButton>Reset</IgButton>
					</IgRow>
				</IgGroup>
			</IgWindow>
		</div>
	</section>

	<section class="ig-section" id="controls">
		<h2>Controls</h2>
		<p class="ig-section-desc">
			Buttons, checks, radios, sliders, inputs, selectables, and progress — ImGui density with
			grown touch targets.
		</p>
		<div class="ig-stage">
			<IgGroup>
				<IgText>Buttons</IgText>
				<IgRow>
					<IgButton onclick={() => (clicks += 1)}>Click me ({clicks})</IgButton>
					<IgButton>Cancel</IgButton>
					<IgButton disabled>Disabled</IgButton>
				</IgRow>

				<IgSeparator />

				<IgText>Checkbox &amp; radio</IgText>
				<IgRow>
					<IgCheckbox bind:checked={check} label="Show grid" />
				</IgRow>
				<IgRow>
					<IgRadio bind:group={drink} value="espresso" label="Espresso" />
					<IgRadio bind:group={drink} value="filter" label="Filter" />
					<IgRadio bind:group={drink} value="pour" label="Pour over" />
				</IgRow>
				<IgText>Drink: {drink}</IgText>

				<IgSeparator />

				<IgText>Slider &amp; input</IgText>
				<IgRow>
					<IgSlider bind:value={volume} min={0} max={100} label="Volume" />
					<span class="ig-field-val">{volume}%</span>
				</IgRow>
				<IgRow>
					<IgInput bind:value={query} placeholder="Filter assets…" />
				</IgRow>

				<IgSeparator />

				<IgText>Selectable</IgText>
				<IgGroup class="ig-select-list">
					{#each tools as tool (tool)}
						<IgSelectable
							selected={picked === tool.toLowerCase()}
							onclick={() => (picked = tool.toLowerCase())}
						>
							{tool}
						</IgSelectable>
					{/each}
				</IgGroup>
				<IgText>Active tool: {picked}</IgText>

				<IgSeparator />

				<IgText>Progress</IgText>
				<IgRow>
					<span class="ig-field-label">Determinate</span>
					<IgProgress value={progress} max={100} />
					<span class="ig-field-val">{progress}%</span>
				</IgRow>
				<IgRow>
					<span class="ig-field-label">Indeterminate</span>
					<IgProgress />
				</IgRow>
			</IgGroup>
		</div>
	</section>

	<section class="ig-section" id="tree">
		<h2>Tree</h2>
		<p class="ig-section-desc">
			Nested collapsible nodes — file-tree style with indent, arrows, and leaf selection.
		</p>
		<div class="ig-stage">
			<IgTree
				items={fileTree}
				defaultOpen={['src', 'src/lib', 'src/lib/imgui']}
				selected={treeSel}
				onselect={onTreeSelect}
			/>
			<IgText>Selected: {treeSel}</IgText>
		</div>
	</section>

	<section class="ig-section" id="tabs">
		<h2>Tabs</h2>
		<p class="ig-section-desc">Strip + panel body. Active tab is bound; content switches below.</p>
		<div class="ig-stage">
			<IgTabBar bind:activeId={tab} content={tabPanel}>
				<IgTab id="preview" label="Preview" />
				<IgTab id="code" label="Code" />
				<IgTab id="logs" label="Logs" disabled />
			</IgTabBar>
		</div>
	</section>

	<section class="ig-section" id="menu">
		<h2>Menu</h2>
		<p class="ig-section-desc">Popup menu with items — open from a trigger button.</p>
		<div class="ig-stage">
			<div class="ig-menu-anchor">
				<IgButton
					onclick={(e) => {
						menuAnchor = e.currentTarget;
						menuOpen = !menuOpen;
					}}>File ▾</IgButton
				>
				<IgMenu bind:open={menuOpen} anchor={menuAnchor} onclose={() => (menuOpen = false)}>
					<IgMenuItem
						onclick={() => {
							menuOpen = false;
							clicks += 1;
						}}>New file</IgMenuItem
					>
					<IgMenuItem
						onclick={() => {
							menuOpen = false;
							clicks += 1;
						}}>Open…</IgMenuItem
					>
					<IgSeparator />
					<IgMenuItem disabled>Save (disabled)</IgMenuItem>
					<IgMenuItem
						onclick={() => {
							menuOpen = false;
							modalOpen = true;
						}}>Quit</IgMenuItem
					>
				</IgMenu>
			</div>
		</div>
	</section>

	<section class="ig-section" id="modal">
		<h2>Modal</h2>
		<p class="ig-section-desc">Dimmed overlay with confirm actions — irreversible ops live here.</p>
		<div class="ig-stage">
			<IgButton onclick={() => (modalOpen = true)}>Open modal</IgButton>
			<IgModal bind:open={modalOpen} title="Confirm quit" onclose={() => (modalOpen = false)}>
				<IgText>Unsaved changes will be lost. Quit anyway?</IgText>
				{#snippet actions()}
					<IgButton onclick={() => (modalOpen = false)}>Cancel</IgButton>
					<IgButton onclick={confirmModal}>Quit</IgButton>
				{/snippet}
			</IgModal>
		</div>
	</section>
</div>

{#snippet tabPanel()}
	{#if tab === 'preview'}
		<IgGroup>
			<IgText>Live preview panel</IgText>
			<IgRow>
				<IgButton>Run</IgButton>
				<IgButton>Step</IgButton>
			</IgRow>
			<IgProgress value={progress} max={100} />
		</IgGroup>
	{:else if tab === 'code'}
		<pre class="ig-code"><code>Begin("Inspector");
SliderInt("Volume", &amp volume, 0, 100);
Checkbox("Show grid", &amp show_grid);
End();</code></pre>
	{:else}
		<IgText>No logs.</IgText>
	{/if}
{/snippet}

<style>
	.page-head {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 12px;
		max-width: 100%;
		min-width: 0;
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

	.toc {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 8px;
	}

	.toc a {
		display: inline-flex;
		align-items: center;
		height: 32px;
		padding-inline: 12px;
		border-radius: var(--m3-sys-shape-full);
		background: var(--m3-sys-surface-container-high);
		color: var(--m3-sys-on-surface-variant);
		text-decoration: none;
		font-size: 0.8125rem;
		font-weight: 500;
	}

	.toc a:hover {
		background: var(--m3-sys-secondary-container);
		color: var(--m3-sys-on-secondary-container);
	}

	.ig-gallery {
		display: flex;
		flex-direction: column;
		gap: 40px;
		max-width: 100%;
		min-width: 0;
	}

	.ig-section {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 12px;
		max-width: 100%;
		min-width: 0;
		scroll-margin-top: 88px;
	}

	.ig-section h2 {
		margin: 0;
		font-family: var(--m3-sys-font);
		font-size: var(--m3-sys-typescale-headline-small);
		font-weight: var(--m3-sys-typescale-headline-small-weight);
		line-height: var(--m3-sys-typescale-headline-small-line);
		color: var(--m3-sys-on-surface);
	}

	.ig-section-desc {
		margin: 0;
		max-width: 62ch;
		color: var(--m3-sys-on-surface-variant);
		font-family: var(--m3-sys-font);
		font-size: 0.9375rem;
		line-height: 1.55;
	}

	.ig-stage {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 16px;
		width: 100%;
		max-width: 100%;
		min-width: 0;
		padding: 20px;
		border: 1px solid var(--m3-sys-outline-variant);
		border-radius: var(--m3-sys-shape-large);
		background: var(--m3-sys-surface-container);
		overflow: hidden;
	}

	.ig-stage :global(.ig-window) {
		max-width: 100%;
	}

	.ig-field-label {
		color: var(--ig-text);
		font-size: var(--ig-font-size-sm);
		min-width: 7ch;
	}

	.ig-field-val {
		color: var(--ig-text);
		font-family: var(--ig-font-mono);
		font-size: var(--ig-font-size-sm);
		min-width: 4ch;
		text-align: end;
	}

	.ig-stage :global(.ig-select-list) {
		max-width: 240px;
		border: 1px solid var(--ig-border);
		padding: 2px;
	}

	.ig-menu-anchor {
		position: relative;
		display: inline-flex;
		min-height: var(--ig-hit-min);
	}

	.ig-code {
		margin: 0;
		padding: 12px;
		overflow-x: auto;
		background: var(--ig-popup-bg);
		border: 1px solid var(--ig-border);
		color: var(--ig-text);
		font-family: var(--ig-font-mono);
		font-size: var(--ig-font-size-sm);
		line-height: 1.45;
		white-space: pre;
	}

	@media (max-width: 599px) {
		.ig-stage {
			padding: 12px;
		}
	}
</style>
