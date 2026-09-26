# M3Nerd

[![Deploy](https://github.com/sysrv64/m3nerd/actions/workflows/pages.yaml/badge.svg)](https://github.com/sysrv64/m3nerd/actions/workflows/pages.yaml)
[![License: MIT](https://img.shields.io/badge/License-MIT-m3nerd.svg)](LICENSE)

Material 3 Expressive component library for Svelte 5 — fast, adaptive, opinionated.

**Live demo:** https://kerneldroid.github.io/m3nerd

## Features

- **Zero-runtime theming.** Every color, shape, elevation, and motion value is a CSS custom property. Light and dark both live in `light-dark()`, so one variable override updates both schemes with no JavaScript and no theme flash.
- **Five adaptive breakpoints.** Layouts follow the Material Foundations spec end to end:

  | Breakpoint | Width     | Typical layout                          |
  | ---------- | --------- | --------------------------------------- |
  | compact    | < 600px   | Phone — bottom bar, single column       |
  | medium     | 600–839px | Large phone / small tablet — rail       |
  | expanded   | 840–1199px| Tablet — two-pane, denser rows          |
  | large      | 1200–1599px | Notebook — expanded rail, side sheets |
  | xlarge     | ≥ 1600px  | Desktop / TV — max-width content        |

- **Expressive motion.** Official Material 3 Expressive spring beziers and durations as composite CSS tokens. Spatial moves may overshoot; color and opacity stay critically damped. `prefers-reduced-motion` collapses everything to 1ms.
- **Useful components only.** No widget graveyard — the set below is what ships:

  | Group        | Components                                                                  |
  | ------------ | --------------------------------------------------------------------------- |
  | Buttons      | Button, IconButton, FAB, ConnectedButtons                                    |
  | Containers   | Card, ListItem, Dialog, Menu, MenuItem, Snackbar, BottomSheet, SideSheet     |
   | Forms        | TextField, Checkbox, Radio, Switch, Slider, Select, Chip, DateField, DatePickerDocked |
  | Progress     | CircularProgress, LinearProgress, LoadingIndicator                           |
  | Navigation   | NavigationSuite, NavigationRail, NavigationBar, Tabs, Toolbar                |
  | Feedback     | Badge                                                                         |
  | Misc         | Icon, Divider                                                                |

## Install

```sh
npm i m3nerd
```

Requires Svelte 5 (>= 5.46). ESM only.

## Quick start

```svelte
<script lang="ts">
	import 'm3nerd/styles.css';
	import { Button, Card, TextField } from 'm3nerd';

	let email = $state('');
</script>

<Card variant="elevated">
	<TextField label="Email" bind:value={email} supportingText="We never share it." />
	<Button variant="filled">Subscribe</Button>
</Card>
```

## ImGUI

Immediate-mode debug UI alongside the Material library:

```svelte
<script lang="ts">
	import 'm3nerd/imgui/styles.css';
	import { IgWindow, IgButton } from 'm3nerd/imgui';
</script>
```

Live demo at `/imgui`.

## Adaptive modes

Set attributes on `<html>`; every component and token responds — no prop drilling.

```html
<html data-density="compact"></html>
```

- `data-density` — `compact` (0.875× control metrics, 48px rows) or `spacious` (1.125×, 64px rows).
- `data-focus-mode="tv"` — 10-foot mode: 64px targets, 52px controls, larger body type, glowing focus ring that scales the focused element.
- `data-theme` — `light` or `dark` forces `color-scheme`; remove it to follow the system again.

Breakpoints are plain CSS: `--m3-bp-medium` (600px), `--m3-bp-expanded` (840px), `--m3-bp-large` (1200px), `--m3-bp-xlarge` (1600px).

## Theming

```css
:root {
	--m3-sys-primary: light-dark(#b3261e, #ffb4ab);
	--m3-sys-surface: light-dark(#fffbfe, #141218);
	--m3-sys-shape-medium: 16px;
}
```

Override any token from the reference / system / component layers — colors, the 10-step shape scale, elevation, type scale, spacing, and state-layer opacities.

## Development

```sh
npm ci
npm run dev        # vite dev server
npm run check      # svelte-kit sync + svelte-check
npm run build      # static build (set PAGES_BASE=/m3nerd for GitHub Pages)
npm run preview    # preview the production build
npm run package    # build the library package
```

The demo site deploys to GitHub Pages via `.github/workflows/pages.yaml` with `PAGES_BASE=/m3nerd`.

## License

MIT © sysrv64 — see [LICENSE](LICENSE).
