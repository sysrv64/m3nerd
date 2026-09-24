<script lang="ts">
	import {
		Badge,
		Button,
		BottomSheet,
		Card,
		Checkbox,
		Chip,
		CircularProgress,
		ConnectedButtons,
		DateField,
		Dialog,
		FAB,
		Icon,
		IconButton,
		LinearProgress,
		ListItem,
		LoadingIndicator,
		Menu,
		MenuItem,
		NavigationBar,
		NavigationSuite,
		Radio,
		Select,
		SideSheet,
		Slider,
		Snackbar,
		Switch,
		Tabs,
		TextField,
		Toolbar,
		snackbar
	} from '$lib';

	type PropRow = { name: string; type: string; def: string; desc: string };

	let fav = $state(false);
	let selectedView = $state(0);

	let email = $state('');
	let notes = $state('');
	let agree = $state(true);
	let drink = $state('filter');
	let soundOn = $state(true);
	let volume = $state(40);
	let topic = $state('motion');
	let filterChip = $state(true);
	let dueDate = $state('');
	let progress = $state(64);

	let dialogOpen = $state(false);
	let menuOpen = $state(false);
	let sheetOpen = $state(false);
	let sideOpen = $state(false);
	let menuAnchor = $state<HTMLSpanElement | null>(null);

	let suiteActive = $state('home');
	let primaryTab = $state('overview');
	let secondaryTab = $state('specs');

	let density = $state<'default' | 'compact'>('default');
	let focusMode = $state<'default' | 'tv'>('default');

	let viewportWidth = $state(0);

	$effect(() => {
		const root = document.documentElement;
		if (density === 'compact') root.dataset.density = 'compact';
		else delete root.dataset.density;
	});

	$effect(() => {
		const root = document.documentElement;
		if (focusMode === 'tv') root.dataset.focusMode = 'tv';
		else delete root.dataset.focusMode;
	});

	$effect(() => {
		const update = () => {
			viewportWidth = window.innerWidth;
		};
		update();
		const queries = [600, 840, 1200, 1600].map((w) => {
			const mq = matchMedia(`(min-width: ${w}px)`);
			mq.addEventListener('change', update);
			return mq;
		});
		window.addEventListener('resize', update);
		return () => {
			for (const mq of queries) mq.removeEventListener('change', update);
			window.removeEventListener('resize', update);
		};
	});

	const breakpointLabel = $derived(
		viewportWidth < 600
			? 'compact'
			: viewportWidth < 840
				? 'medium'
				: viewportWidth < 1200
					? 'expanded'
					: viewportWidth < 1600
						? 'large'
						: 'xlarge'
	);

	const rulerMax = 1920;
	const markerPct = $derived(Math.min(100, (viewportWidth / rulerMax) * 100));

	const suiteItems = [
		{ id: 'home', label: 'Home', icon: 'home' },
		{ id: 'docs', label: 'Docs', icon: 'menu_book' },
		{ id: 'components', label: 'Library', icon: 'widgets' },
		{ id: 'motion', label: 'Motion', icon: 'animation' },
		{ id: 'settings', label: 'Settings', icon: 'settings' }
	];

	const primaryTabs = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'usage', label: 'Usage' },
		{ id: 'a11y', label: 'Accessibility' }
	];

	const secondaryTabs = [
		{ id: 'specs', label: 'Specs' },
		{ id: 'tokens', label: 'Tokens' },
		{ id: 'changelog', label: 'Changelog' }
	];

	const topics = [
		{ value: 'motion', label: 'Motion' },
		{ value: 'tokens', label: 'Tokens' },
		{ value: 'components', label: 'Components' },
		{ value: 'a11y', label: 'Accessibility' }
	];

	const breakpoints = [
		{ name: 'compact', range: '< 600' },
		{ name: 'medium', range: '600–839' },
		{ name: 'expanded', range: '840–1199' },
		{ name: 'large', range: '1200–1599' },
		{ name: 'xlarge', range: '≥ 1600' }
	];

	function showToast() {
		snackbar('Saved to your collection', {
			action: { label: 'Undo', onClick: () => snackbar('Change undone') }
		});
	}
</script>

{#snippet props(rows: PropRow[])}
	<div class="table-wrap">
		<table>
			<thead>
				<tr>
					<th>Component</th>
					<th>Prop</th>
					<th>Type</th>
					<th>Default</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				{#each rows as row (row.name + row.type)}
					<tr>
						<td><code>{row.name}</code></td>
						<td><code>{row.type}</code></td>
						<td><code>{row.def}</code></td>
						<td>{row.desc}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/snippet}

{#snippet code(src: string)}
	<details class="code-details">
		<summary>Code</summary>
		<pre><code>{src}</code></pre>
	</details>
{/snippet}

<svelte:head>
	<title>Components — M3Nerd</title>
	<meta name="description" content="Live gallery of every M3Nerd component." />
</svelte:head>

<header class="page-head">
	<h1 class="page-title">Components</h1>
	<p class="page-lead">
		Live previews rendered with the real library. Every section shows props and a copy-paste
		snippet. Use the adaptive playground at the bottom to flip density and TV focus mode.
	</p>
	<nav class="toc" aria-label="On this page">
		<a href="#buttons">Buttons</a>
		<a href="#cards-list">Cards &amp; List</a>
		<a href="#forms">Forms</a>
		<a href="#overlays">Overlays</a>
		<a href="#navigation">Navigation</a>
		<a href="#feedback">Feedback</a>
		<a href="#playground">Playground</a>
	</nav>
</header>

<section class="demo" id="buttons">
	<div class="demo-head">
		<h2>Buttons</h2>
		<p>Five variants, five sizes, icon buttons, FABs, and connected segments.</p>
	</div>

	<div class="preview">
		<div class="preview-row">
			<Button variant="filled">Filled</Button>
			<Button variant="tonal">Tonal</Button>
			<Button variant="elevated">Elevated</Button>
			<Button variant="outlined">Outlined</Button>
			<Button variant="text">Text</Button>
		</div>
		<div class="preview-row">
			<Button size="xs">XS</Button>
			<Button size="s">S</Button>
			<Button size="m">M</Button>
			<Button size="l">L</Button>
			<Button size="xl">XL</Button>
		</div>
		<div class="preview-row">
			<IconButton label="Share">
				<Icon name="share" />
			</IconButton>
			<IconButton label="Favorite" variant="filled">
				<Icon name="favorite" />
			</IconButton>
			<IconButton label="Bookmark" variant="tonal">
				<Icon name="bookmark" />
			</IconButton>
			<IconButton label="More" variant="outlined">
				<Icon name="more_vert" />
			</IconButton>
			<IconButton label="Toggle star" toggle selected={fav} onclick={() => (fav = !fav)}>
				<Icon name="star" fill={fav} />
			</IconButton>
		</div>
		<div class="preview-row">
			<FAB label="Create">
				<Icon name="add" />
			</FAB>
			<FAB plain label="Compose plain">
				<Icon name="edit" />
			</FAB>
			<FAB extended label="Compose">
				<Icon name="edit" />
				Compose
			</FAB>
		</div>
		<div class="preview-row">
			<ConnectedButtons label="View mode">
				<Button variant="tonal" size="s" onclick={() => (selectedView = 0)}>Day</Button>
				<Button variant="tonal" size="s" onclick={() => (selectedView = 1)}>Week</Button>
				<Button variant="tonal" size="s" onclick={() => (selectedView = 2)}>Month</Button>
			</ConnectedButtons>
			<span class="preview-note">Selected: {['Day', 'Week', 'Month'][selectedView]}</span>
		</div>
	</div>

	{@render props([
		{
			name: 'Button',
			type: "'filled' | 'tonal' | 'elevated' | 'outlined' | 'text'",
			def: "'filled'",
			desc: 'Variant sets color and elevation emphasis'
		},
		{
			name: 'Button',
			type: "'xs' | 's' | 'm' | 'l' | 'xl'",
			def: "'m'",
			desc: 'Size — Expressive heights 32 / 40 / 56 / 96 / 136px'
		},
		{
			name: 'Button',
			type: 'href?: string',
			def: 'undefined',
			desc: 'Renders an anchor instead of a button'
		},
		{
			name: 'IconButton',
			type: "'standard' | 'filled' | 'tonal' | 'outlined'",
			def: "'standard'",
			desc: 'Icon-only button; label sets aria-label'
		},
		{
			name: 'IconButton',
			type: 'toggle?: boolean, selected?: boolean',
			def: 'false',
			desc: 'Toggle semantics with aria-pressed'
		},
		{
			name: 'FAB',
			type: 'extended?: boolean, plain?: boolean',
			def: 'false',
			desc: 'Extended shows a label; plain drops elevation'
		},
		{
			name: 'FAB',
			type: "'s' | 'm' | 'l'",
			def: "'m'",
			desc: 'FAB size — 40, 56, or 96px'
		},
		{
			name: 'ConnectedButtons',
			type: 'connected?: boolean, label?: string',
			def: 'true',
			desc: 'Joins child buttons into a segmented group'
		}
	])}

	{@render code(
		`<Button variant="filled" size="m">Filled</Button>
<Button variant="tonal">Tonal</Button>
<Button href="/docs/" variant="outlined">Docs</Button>

<IconButton label="Share" variant="filled">
	<Icon name="share" />
</IconButton>

<FAB extended label="Compose">
	<Icon name="edit" />Compose
</FAB>

<ConnectedButtons label="View mode">
	<Button variant="tonal" size="s">Day</Button>
	<Button variant="tonal" size="s">Week</Button>
</ConnectedButtons>`
	)}
</section>

<section class="demo" id="cards-list">
	<div class="demo-head">
		<h2>Cards &amp; List</h2>
		<p>Surface containers for content, plus two-line list items.</p>
	</div>

	<div class="preview">
		<div class="card-grid">
			<Card variant="elevated">
				<div class="card-body">
					<span class="material-symbols-outlined card-icon">elevated</span>
					<strong>Elevated</strong>
					<p>Rests on the surface with a subtle shadow.</p>
				</div>
			</Card>
			<Card variant="filled">
				<div class="card-body">
					<span class="material-symbols-outlined card-icon">format_color_fill</span>
					<strong>Filled</strong>
					<p>Primary container tint, no shadow.</p>
				</div>
			</Card>
			<Card variant="tonal">
				<div class="card-body">
					<span class="material-symbols-outlined card-icon">palette</span>
					<strong>Tonal</strong>
					<p>Secondary container for supporting content.</p>
				</div>
			</Card>
			<Card variant="outlined">
				<div class="card-body">
					<span class="material-symbols-outlined card-icon">crop_square</span>
					<strong>Outlined</strong>
					<p>Quietest option for dense layouts.</p>
				</div>
			</Card>
		</div>

		<div class="list-block">
			<Card variant="outlined">
				<ListItem
					headline="Two-line list item"
					supporting="Supporting text wraps under the headline and stays readable at every breakpoint."
				/>
				<ListItem
					headline="Second item"
					supporting="ListItem keeps 56px rows by default, 48px in compact density."
				/>
			</Card>
		</div>
	</div>

	{@render props([
		{
			name: 'Card',
			type: "'elevated' | 'filled' | 'outlined' | 'tonal'",
			def: "'elevated'",
			desc: 'Surface treatment'
		},
		{
			name: 'Card',
			type: 'onclick?, href?, as?',
			def: 'undefined',
			desc: 'Makes the card a button or link target'
		},
		{
			name: 'ListItem',
			type: 'headline: string',
			def: 'required',
			desc: 'Primary line of text'
		},
		{
			name: 'ListItem',
			type: 'supporting?: string',
			def: 'undefined',
			desc: 'Secondary line — renders two-line rows'
		}
	])}

	{@render code(
		`<Card variant="elevated" onclick={open}>
	<h3>Elevated</h3>
	<p>Rests on the surface with a subtle shadow.</p>
</Card>

<Card variant="outlined">
	<ListItem
		headline="Two-line list item"
		supporting="Secondary text stays readable at every breakpoint."
	/>
</Card>`
	)}
</section>

<section class="demo" id="forms">
	<div class="demo-head">
		<h2>Forms</h2>
		<p>Inputs, selection controls, chips, and progress indicators.</p>
	</div>

	<div class="preview">
		<div class="form-grid">
			<div class="form-cell">
				<span class="cell-label">TextField outlined</span>
				<TextField label="Email" bind:value={email} supportingText="We never share it." />
			</div>
			<div class="form-cell">
				<span class="cell-label">TextField filled</span>
				<TextField label="Subject" variant="filled" value="Expressive defaults" />
			</div>
			<div class="form-cell">
				<span class="cell-label">TextField error</span>
				<TextField
					label="Username"
					value="a b"
					invalid
					supportingText="Only letters and numbers."
				/>
			</div>
			<div class="form-cell">
				<span class="cell-label">Multiline</span>
				<TextField label="Notes" multiline bind:value={notes} rows={3} />
			</div>
			<div class="form-cell">
				<span class="cell-label">Checkbox &amp; Switch</span>
				<div class="inline-controls">
					<Checkbox bind:checked={agree} label="Accept terms" />
					<Switch bind:checked={soundOn} label="Sound" />
				</div>
			</div>
			<div class="form-cell">
				<span class="cell-label">Radio group</span>
				<div class="inline-controls">
					<Radio
						name="drink"
						value="filter"
						label="Filter"
						checked={drink === 'filter'}
						onchange={() => (drink = 'filter')}
					/>
					<Radio
						name="drink"
						value="espresso"
						label="Espresso"
						checked={drink === 'espresso'}
						onchange={() => (drink = 'espresso')}
					/>
				</div>
			</div>
			<div class="form-cell">
				<span class="cell-label">Slider — {volume}</span>
				<Slider bind:value={volume} min={0} max={100} step={1} />
			</div>
			<div class="form-cell">
				<span class="cell-label">Select</span>
				<Select label="Topic" options={topics} bind:value={topic} />
			</div>
			<div class="form-cell">
				<span class="cell-label">Chip</span>
				<div class="inline-controls">
					<Chip variant="filter" label="Wi-Fi" bind:selected={filterChip} />
					<Chip variant="assist" label="Setup" />
					<Chip variant="input" label="Svelte" onRemove={() => snackbar('Chip removed')} />
					<Chip variant="suggested" label="Motion" />
				</div>
			</div>
			<div class="form-cell">
				<span class="cell-label">DateField</span>
				<DateField bind:value={dueDate} aria-label="Due date" />
			</div>
			<div class="form-cell">
				<span class="cell-label">CircularProgress determinate</span>
				<div class="inline-controls">
					<CircularProgress value={progress} max={100} />
					<Button variant="text" onclick={() => (progress = (progress + 17) % 101)}>
						Step
					</Button>
				</div>
			</div>
			<div class="form-cell">
				<span class="cell-label">CircularProgress indeterminate</span>
				<CircularProgress />
			</div>
			<div class="form-cell">
				<span class="cell-label">LinearProgress</span>
				<div class="stacked">
					<LinearProgress value={progress} max={100} />
					<LinearProgress />
				</div>
			</div>
			<div class="form-cell">
				<span class="cell-label">LoadingIndicator</span>
				<LoadingIndicator />
			</div>
		</div>
	</div>

	{@render props([
		{
			name: 'TextField',
			type: 'variant?: outlined | filled',
			def: "'outlined'",
			desc: 'Outline style; invalid shows error color'
		},
		{
			name: 'TextField',
			type: 'bind:value: string',
			def: "''",
			desc: 'Bound text; supportingText shows helper line'
		},
		{
			name: 'Checkbox',
			type: 'bind:checked: boolean, label?: string',
			def: 'false',
			desc: 'Custom box with animated check'
		},
		{
			name: 'Radio',
			type: 'value: string, bind:checked: boolean',
			def: 'required',
			desc: 'Pair with name for native group semantics'
		},
		{
			name: 'Switch',
			type: 'bind:checked: boolean, label?: string',
			def: 'false',
			desc: 'role="switch" track control'
		},
		{
			name: 'Slider',
			type: 'bind:value, min, max, step',
			def: '0 / 100 / 1',
			desc: 'Continuous numeric input'
		},
		{
			name: 'Select',
			type: 'options: { value, label }[], bind:value: string',
			def: '[]',
			desc: 'Dropdown listbox with anchored popup'
		},
		{
			name: 'Chip',
			type: 'variant?: assist | filter | input | suggested',
			def: "'assist'",
			desc: 'Chip role; label provides the text'
		},
		{
			name: 'Chip',
			type: 'bind:selected?: boolean',
			def: 'false',
			desc: 'Filter chips toggle selected state'
		},
		{
			name: 'CircularProgress',
			type: 'value?: number, min?, max?',
			def: 'undefined / 0 / 1',
			desc: 'Determinate within min–max; omitted = indeterminate'
		},
		{
			name: 'LinearProgress',
			type: 'value?: number, min?, max?',
			def: 'undefined / 0 / 1',
			desc: 'Determinate within min–max; omitted = indeterminate'
		},
		{
			name: 'DateField',
			type: 'bind:value: string',
			def: "''",
			desc: 'ISO date text with docked picker; invalid marks errors'
		}
	])}

	{@render code(
		`<TextField label="Email" bind:value={email} supportingText="We never share it." />
<TextField label="Username" value="a b" invalid supportingText="Only letters and numbers." />

<Checkbox bind:checked={agree} label="Accept terms" />
<Radio name="drink" value="filter" label="Filter" checked={drink === 'filter'}
	onchange={() => (drink = 'filter')} />
<Switch bind:checked={soundOn} label="Sound" />

<Slider bind:value={volume} min={0} max={100} />
<Select label="Topic" options={[{ value: 'motion', label: 'Motion' }]} bind:value={topic} />
<Chip variant="filter" label="Wi-Fi" bind:selected={filterChip} />
<Chip variant="input" label="Svelte" onRemove={removeChip} />
<DateField bind:value={dueDate} aria-label="Due date" />

<CircularProgress value={64} max={100} />
<CircularProgress />
<LinearProgress value={64} max={100} />
<LoadingIndicator />`
	)}
</section>

<section class="demo" id="overlays">
	<div class="demo-head">
		<h2>Overlays</h2>
		<p>Dialog, menu, sheets, and the imperative snackbar.</p>
	</div>

	<div class="preview">
		<div class="preview-row">
			<Button variant="tonal" onclick={() => (dialogOpen = true)}>Open dialog</Button>
			<span class="menu-anchor" bind:this={menuAnchor}>
				<Button variant="tonal" onclick={() => (menuOpen = !menuOpen)}>Open menu</Button>
			</span>
			<Button variant="tonal" onclick={() => (sheetOpen = true)}>Bottom sheet</Button>
			<Button variant="tonal" onclick={() => (sideOpen = true)}>Side sheet</Button>
			<Button variant="outlined" onclick={showToast}>Snackbar</Button>
		</div>

		<Dialog bind:open={dialogOpen} title="Discard draft?">
			<p>Your changes will be lost. This cannot be undone.</p>
			{#snippet actions()}
				<Button variant="text" onclick={() => (dialogOpen = false)}>Cancel</Button>
				<Button variant="filled" onclick={() => (dialogOpen = false)}>Discard</Button>
			{/snippet}
		</Dialog>

		<Menu bind:open={menuOpen} anchorEl={menuAnchor}>
			<MenuItem>Cut</MenuItem>
			<MenuItem>Copy</MenuItem>
			<MenuItem>Paste</MenuItem>
		</Menu>

		<BottomSheet bind:open={sheetOpen} title="Share via">
			<div class="sheet-links">
				<Button variant="tonal" onclick={() => (sheetOpen = false)}>Link</Button>
				<Button variant="tonal" onclick={() => (sheetOpen = false)}>Embed</Button>
				<Button variant="text" onclick={() => (sheetOpen = false)}>Cancel</Button>
			</div>
		</BottomSheet>

		<SideSheet bind:open={sideOpen} title="Filters">
			<p>Narrow the result set.</p>
			<div class="sheet-links">
				<Button variant="text" onclick={() => (sideOpen = false)}>Close</Button>
			</div>
		</SideSheet>

		<Snackbar />
	</div>

	{@render props([
		{
			name: 'Dialog',
			type: 'bind:open: boolean, title?: string',
			def: 'false',
			desc: 'Modal dialog with scrim and actions snippet'
		},
		{
			name: 'Menu',
			type: 'bind:open: boolean, anchorEl?: HTMLElement',
			def: 'false',
			desc: 'Popup surface positioned against its trigger'
		},
		{
			name: 'MenuItem',
			type: 'children, onselect?, selected?',
			def: 'undefined',
			desc: 'Row inside a menu; closes the menu on click'
		},
		{
			name: 'BottomSheet',
			type: 'bind:open: boolean, title?: string',
			def: 'false',
			desc: 'Modal sheet sliding from the bottom edge'
		},
		{
			name: 'SideSheet',
			type: 'bind:open: boolean, title?: string, side?, modal?',
			def: "false / 'end' / false",
			desc: 'Supplementary panel from the inline edge'
		},
		{
			name: 'snackbar()',
			type: "(text, { action?, duration? }) => void",
			def: '4000ms',
			desc: 'Imperative toast; mount <Snackbar /> once'
		}
	])}

	{@render code(
		`<script lang="ts">
	import { Button, Dialog, Menu, MenuItem, Snackbar, snackbar } from 'm3nerd';

	let open = $state(false);
	let menuOpen = $state(false);
	let anchor = $state<HTMLSpanElement | null>(null);
<\/script>

<Button onclick={() => (open = true)}>Open dialog</Button>

<Dialog bind:open title="Discard draft?">
	<p>Your changes will be lost.</p>
	{#snippet actions()}
		<Button variant="text" onclick={() => (open = false)}>Cancel</Button>
		<Button variant="filled" onclick={() => (open = false)}>Discard</Button>
	{/snippet}
</Dialog>

<span bind:this={anchor}>
	<Button onclick={() => (menuOpen = true)}>Open menu</Button>
</span>
<Menu bind:open={menuOpen} anchorEl={anchor}>
	<MenuItem>Cut</MenuItem>
	<MenuItem>Copy</MenuItem>
</Menu>

<Snackbar />
<button onclick={() => snackbar('Saved')}>Save</button>`
	)}
</section>

<section class="demo" id="navigation">
	<div class="demo-head">
		<h2>Navigation</h2>
		<p>Adaptive suite, tabs, and toolbars.</p>
	</div>

	<div class="preview">
		<span class="cell-label">NavigationSuite — bottom bar on phone, rail on tablet+</span>
		<div class="suite-frame">
			<NavigationSuite items={suiteItems} bind:activeId={suiteActive} contained />
		</div>
		<p class="preview-note">Active item: <code>{suiteActive}</code></p>

		<span class="cell-label">NavigationBar — phone bottom tabs</span>
		<div class="suite-frame suite-frame--bar">
			<NavigationBar items={suiteItems} bind:activeId={suiteActive} />
		</div>
		<p class="preview-note">Same activeId — tabs switch from the bottom on compact widths.</p>

		<span class="cell-label">Tabs — primary</span>
		<Tabs tabs={primaryTabs} bind:activeId={primaryTab} variant="primary" />

		<span class="cell-label">Tabs — secondary</span>
		<Tabs tabs={secondaryTabs} bind:activeId={secondaryTab} variant="secondary" />

		<span class="cell-label">Toolbar — dense + elevated</span>
		<Toolbar dense elevated>
			{#snippet leading()}
				<IconButton label="Navigate back">
					<Icon name="arrow_back" />
				</IconButton>
				<span class="toolbar-title">Inbox</span>
			{/snippet}
			{#snippet trailing()}
				<IconButton label="Search">
					<Icon name="search" />
				</IconButton>
				<IconButton label="More options">
					<Icon name="more_vert" />
				</IconButton>
			{/snippet}
		</Toolbar>
	</div>

	{@render props([
		{
			name: 'NavigationSuite',
			type: 'items: { id, label, icon }[]',
			def: 'required',
			desc: 'Five destinations; picks bar vs rail by width'
		},
		{
			name: 'NavigationSuite',
			type: 'bind:activeId: string',
			def: 'first item',
			desc: 'Live active destination'
		},
		{
			name: 'Tabs',
			type: 'tabs: { id, label }[], bind:activeId: string',
			def: 'required',
			desc: 'Tab set with bound selection'
		},
		{
			name: 'Tabs',
			type: "'primary' | 'secondary'",
			def: "'primary'",
			desc: 'Primary pills vs secondary underline'
		},
		{
			name: 'Toolbar',
			type: 'dense?: boolean, elevated?: boolean',
			def: 'false',
			desc: 'Top app bar; dense shrinks height'
		},
		{
			name: 'Toolbar',
			type: 'leading?, center?, trailing? snippets',
			def: 'children → leading',
			desc: 'Slots for leading, centered, and trailing content'
		}
	])}

	{@render code(
		`<NavigationSuite
	items={[
		{ id: 'home', label: 'Home', icon: 'home' },
		{ id: 'docs', label: 'Docs', icon: 'menu_book' },
		{ id: 'components', label: 'Library', icon: 'widgets' },
		{ id: 'motion', label: 'Motion', icon: 'animation' },
		{ id: 'settings', label: 'Settings', icon: 'settings' }
	]}
	bind:activeId={activeId}
/>

<Tabs tabs={tabs} bind:activeId={tab} variant="primary" />

<Toolbar dense elevated>
	{#snippet leading()}
		<IconButton label="Navigate back"><Icon name="arrow_back" /></IconButton>
		<span>Inbox</span>
	{/snippet}
</Toolbar>`
	)}
</section>

<section class="demo" id="feedback">
	<div class="demo-head">
		<h2>Feedback</h2>
		<p>Badges call attention to icons and avatars.</p>
	</div>

	<div class="preview">
		<div class="preview-row">
			<Badge value={3}>
				<span class="avatar" aria-hidden="true">A</span>
			</Badge>
			<Badge value={12}>
				<Icon name="mail" size={28} />
			</Badge>
			<Badge value={120} max={99}>
				<Icon name="notifications" size={28} />
			</Badge>
			<Badge dot label="Unread items">
				<Icon name="campaign" size={28} />
			</Badge>
		</div>
	</div>

	{@render props([
		{
			name: 'Badge',
			type: 'value?: string | number, max?: number',
			def: 'undefined / 99',
			desc: 'Badge count; values over max render as max+'
		},
		{
			name: 'Badge',
			type: 'dot?: boolean, label?: string',
			def: 'false',
			desc: 'Dot variant; label names it for assistive tech'
		},
		{
			name: 'Badge',
			type: 'children',
			def: 'required',
			desc: 'Wraps the icon or avatar being badged'
		}
	])}

	{@render code(
		`<Badge value={3}>
	<span class="avatar">A</span>
</Badge>

<Badge value={120} max={99}>
	<Icon name="notifications" size={28} />
</Badge>

<Badge dot label="Unread items">
	<Icon name="campaign" size={28} />
</Badge>`
	)}
</section>

<section class="demo" id="playground">
	<div class="demo-head">
		<h2>Adaptive playground</h2>
		<p>
			Flip the document-level attributes and watch tokens respond. The ruler tracks the live
			viewport width and its breakpoint.
		</p>
	</div>

	<div class="preview">
		<div class="playground-grid">
			<fieldset class="pg-field">
				<legend><code>data-density</code></legend>
				<label>
					<input
						type="radio"
						name="density"
						value="default"
						checked={density === 'default'}
						onchange={() => (density = 'default')}
					/>
					Default
				</label>
				<label>
					<input
						type="radio"
						name="density"
						value="compact"
						checked={density === 'compact'}
						onchange={() => (density = 'compact')}
					/>
					Compact
				</label>
			</fieldset>

			<fieldset class="pg-field">
				<legend><code>data-focus-mode</code></legend>
				<label>
					<input
						type="radio"
						name="focus-mode"
						value="default"
						checked={focusMode === 'default'}
						onchange={() => (focusMode = 'default')}
					/>
					Default
				</label>
				<label>
					<input
						type="radio"
						name="focus-mode"
						value="tv"
						checked={focusMode === 'tv'}
						onchange={() => (focusMode = 'tv')}
					/>
					TV (10-foot)
				</label>
			</fieldset>

			<div class="pg-sample">
				<span class="cell-label">Token sample</span>
				<div class="preview-row">
					<Button variant="filled">Button</Button>
					<Checkbox label="Checkbox" checked />
					<Switch label="Switch" checked />
				</div>
			</div>
		</div>

		<div class="ruler" aria-live="polite">
			<div class="ruler-readout">
				<strong>{viewportWidth}px</strong>
				<span class="bp-pill">{breakpointLabel}</span>
			</div>
			<div class="ruler-track">
				<div class="ruler-fill" style="width: {markerPct}%"></div>
				<div class="ruler-marker" style="left: {markerPct}%"></div>
				{#each [{ px: 600, label: '600' }, { px: 840, label: '840' }, { px: 1200, label: '1200' }, { px: 1600, label: '1600' }] as tick (tick.px)}
					<span
						class="ruler-tick"
						style="left: {(tick.px / rulerMax) * 100}%"
					>
						{tick.label}
					</span>
				{/each}
			</div>
			<ul class="ruler-legend">
				{#each breakpoints as bp (bp.name)}
					<li class:active={bp.name === breakpointLabel}>
						<strong>{bp.name}</strong>
						<span>{bp.range}px</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	{@render props([
		{
			name: 'data-density',
			type: "'compact' | 'spacious'",
			def: 'default scale',
			desc: 'Sets --m3-density-scale on <html>'
		},
		{
			name: 'data-focus-mode',
			type: "'tv'",
			def: 'unset',
			desc: '64px targets, larger type, glowing focus ring'
		},
		{
			name: 'window width',
			type: 'matchMedia breakpoints',
			def: 'live',
			desc: 'compact | medium | expanded | large | xlarge'
		}
	])}

	{@render code(
		`<script lang="ts">
	$effect(() => {
		const root = document.documentElement;
		if (density === 'compact') root.dataset.density = 'compact';
		else delete root.dataset.density;
	});

	$effect(() => {
		const update = () => (width = window.innerWidth);
		update();
		const queries = [600, 840, 1200, 1600].map((w) => {
			const mq = matchMedia('(min-width: ' + w + 'px)');
			mq.addEventListener('change', update);
			return mq;
		});
		window.addEventListener('resize', update);
		return () => {
			for (const mq of queries) mq.removeEventListener('change', update);
			window.removeEventListener('resize', update);
		};
	});
<\/script>`
	)}
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

	.demo {
		display: grid;
		gap: 20px;
		margin-bottom: 56px;
		scroll-margin-top: 88px;
	}

	.demo-head {
		display: grid;
		gap: 6px;
	}

	.demo-head h2 {
		margin: 0;
		font: var(--m3-sys-typescale-headline-small-weight) var(--m3-sys-typescale-headline-small) /
			var(--m3-sys-typescale-headline-small-line) var(--m3-sys-font);
	}

	.demo-head p {
		margin: 0;
		max-width: 62ch;
		color: var(--m3-sys-on-surface-variant);
		font: var(--m3-sys-typescale-body-medium-weight) var(--m3-sys-typescale-body-medium) /
			var(--m3-sys-typescale-body-medium-line) var(--m3-sys-font);
	}

	.preview {
		display: grid;
		gap: 20px;
		padding: 24px;
		max-width: 100%;
		min-width: 0;
		border: 1px solid var(--m3-sys-outline-variant);
		border-radius: var(--m3-sys-shape-large);
		background: var(--m3-sys-surface-container);
		--m3-field-label-bg: var(--m3-sys-surface-container);
	}

	.preview-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
	}

	.preview-note {
		margin: 0;
		color: var(--m3-sys-on-surface-variant);
		font-size: 0.875rem;
	}

	.cell-label {
		display: block;
		color: var(--m3-sys-on-surface-variant);
		font: var(--m3-sys-typescale-label-medium-weight) var(--m3-sys-typescale-label-medium) /
			var(--m3-sys-typescale-label-medium-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-label-medium-tracking);
	}

	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr));
		gap: 16px;
	}

	.card-body {
		display: grid;
		gap: 6px;
		padding: 20px;
	}

	.card-body p {
		margin: 0;
		font-size: 0.875rem;
		line-height: 1.43;
		opacity: 0.85;
	}

	.card-icon {
		font-size: 24px;
		opacity: 0.7;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
		gap: 24px;
	}

	.form-cell {
		display: grid;
		gap: 10px;
		align-content: start;
		min-width: 0;
	}

	.inline-controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
	}

	.stacked {
		display: grid;
		gap: 10px;
		width: 100%;
	}

	.suite-frame {
		position: relative;
		height: 360px;
		padding: 0;
		overflow: hidden;
		border: 1px dashed var(--m3-sys-outline-variant);
		border-radius: var(--m3-sys-shape-medium);
		background: var(--m3-sys-surface-container-low);
	}

	.suite-frame--bar {
		height: auto;
		overflow: visible;
		display: flex;
		align-items: flex-end;
		border-style: solid;
		border-radius: var(--m3-sys-shape-medium);
		background: var(--m3-sys-surface-container);
	}

	.menu-anchor {
		display: inline-flex;
	}

	.toolbar-title {
		font-size: var(--m3-sys-typescale-title-medium);
		font-weight: 500;
	}

	.avatar {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: var(--m3-sys-shape-full);
		background: var(--m3-sys-tertiary-container);
		color: var(--m3-sys-on-tertiary-container);
		font-weight: 600;
	}

	.sheet-links {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
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
		padding: 10px 14px;
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

	.table-wrap code {
		font-family: var(--m3-sys-font-mono);
		font-size: 0.8em;
		white-space: nowrap;
	}

	.code-details {
		border: 1px solid var(--m3-sys-outline-variant);
		border-radius: var(--m3-sys-shape-medium);
		background: var(--m3-sys-surface-container-low);
	}

	.code-details summary {
		padding: 12px 16px;
		cursor: pointer;
		font-weight: 600;
		font-size: 0.875rem;
		color: var(--m3-sys-on-surface);
	}

	.code-details pre {
		margin: 0;
		padding: 16px;
		overflow-x: auto;
		border-top: 1px solid var(--m3-sys-outline-variant);
		font: 400 0.8125rem/1.55 var(--m3-sys-font-mono);
		color: var(--m3-sys-on-surface);
	}

	.playground-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
		gap: 20px;
	}

	.pg-field {
		display: grid;
		gap: 8px;
		margin: 0;
		padding: 16px;
		border: 1px solid var(--m3-sys-outline-variant);
		border-radius: var(--m3-sys-shape-medium);
		background: var(--m3-sys-surface-container-low);
	}

	.pg-field legend {
		padding-inline: 6px;
		font-weight: 600;
		font-size: 0.875rem;
	}

	.pg-field label {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 32px;
		font-size: 0.9375rem;
		cursor: pointer;
	}

	.pg-field input {
		accent-color: var(--m3-sys-primary);
		width: 18px;
		height: 18px;
	}

	.pg-sample {
		display: grid;
		gap: 10px;
		align-content: start;
	}

	.ruler {
		display: grid;
		gap: 14px;
		padding-top: 4px;
	}

	.ruler-readout {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 1.125rem;
	}

	.bp-pill {
		display: inline-flex;
		align-items: center;
		height: 28px;
		padding-inline: 12px;
		border-radius: var(--m3-sys-shape-full);
		background: var(--m3-sys-primary);
		color: var(--m3-sys-on-primary);
		font-size: 0.8125rem;
		font-weight: 600;
	}

	.ruler-track {
		position: relative;
		height: 10px;
		border-radius: var(--m3-sys-shape-full);
		background: var(--m3-sys-surface-container-highest);
	}

	.ruler-fill {
		position: absolute;
		inset-block: 0;
		inset-inline-start: 0;
		border-radius: inherit;
		background: var(--m3-sys-primary);
		transition: width var(--m3-motion-default);
	}

	.ruler-marker {
		position: absolute;
		top: -5px;
		width: 4px;
		height: 20px;
		border-radius: 2px;
		background: var(--m3-sys-on-surface);
		transform: translateX(-50%);
		transition: left var(--m3-motion-default);
	}

	.ruler-tick {
		position: absolute;
		top: 16px;
		transform: translateX(-50%);
		color: var(--m3-sys-on-surface-variant);
		font-size: 0.6875rem;
	}

	.ruler-legend {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin: 20px 0 0;
		padding: 0;
		list-style: none;
	}

	.ruler-legend li {
		display: grid;
		gap: 2px;
		padding: 8px 12px;
		border-radius: var(--m3-sys-shape-small);
		background: var(--m3-sys-surface-container-high);
		color: var(--m3-sys-on-surface-variant);
		font-size: 0.75rem;
	}

	.ruler-legend li strong {
		color: var(--m3-sys-on-surface);
		font-size: 0.8125rem;
	}

	.ruler-legend li.active {
		background: var(--m3-sys-secondary-container);
		color: var(--m3-sys-on-secondary-container);
	}

	.ruler-legend li.active strong {
		color: inherit;
	}
</style>
