<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { cn } from '../../utils/cn.js';

interface NavItem {
	id: string;
	label: string;
	icon: string;
	href?: string;
	disabled?: boolean;
	badge?: string | number;
}

interface Props extends Omit<HTMLAttributes<HTMLElement>, 'class'> {
	items: NavItem[];
	activeId?: string;
	expanded?: boolean;
	brand?: Snippet;
	actions?: Snippet;
	footer?: Snippet;
	fab?: Snippet;
	class?: string;
	label?: string;
}

let {
	items,
	activeId = $bindable(''),
	expanded,
	brand,
	actions,
	footer,
	fab,
	class: className,
	label = 'Primary',
	...rest
}: Props = $props();

function activate(item: NavItem) {
	if (item.disabled) return;
	activeId = item.id;
}
</script>

<nav
	class={cn(
		'm3-rail',
		expanded === true && 'expanded',
		expanded === false && 'collapsed',
		className
	)}
	aria-label={label}
	{...rest}
>
	{#if brand}
		<div class="rail-brand">{@render brand()}</div>
	{/if}

	{#if fab}
		<div class="rail-fab">{@render fab()}</div>
	{/if}

	<div class="rail-items">
		{#each items as item (item.id)}
			{#if item.href}
			<a
				class="rail-item m3-layer"
				href={item.disabled ? undefined : item.href}
					aria-current={item.id === activeId ? 'page' : undefined}
					aria-disabled={item.disabled || undefined}
					data-active={item.id === activeId}
					title={item.label}
					onclick={item.disabled ? undefined : () => activate(item)}
				>
					<span class="rail-indicator" aria-hidden="true"></span>
					<span class="rail-icon"><span class="material-symbols-outlined" aria-hidden="true">{item.icon}</span></span>
					<span class="rail-label">{item.label}</span>
					{#if item.badge != null && item.badge !== ''}
						<span class="rail-badge">{item.badge}</span>
					{/if}
				</a>
			{:else}
			<button
				type="button"
				class="rail-item m3-layer"
				disabled={item.disabled}
					aria-current={item.id === activeId ? 'page' : undefined}
					data-active={item.id === activeId}
					title={item.label}
					onclick={() => activate(item)}
				>
					<span class="rail-indicator" aria-hidden="true"></span>
					<span class="rail-icon"><span class="material-symbols-outlined" aria-hidden="true">{item.icon}</span></span>
					<span class="rail-label">{item.label}</span>
					{#if item.badge != null && item.badge !== ''}
						<span class="rail-badge">{item.badge}</span>
					{/if}
				</button>
			{/if}
		{/each}
	</div>

	{#if actions || footer}
		<div class="rail-bottom">
			{#if actions}
				<div class="rail-actions">{@render actions()}</div>
			{/if}
			{#if footer}
				<div class="rail-footer">{@render footer()}</div>
			{/if}
		</div>
	{/if}
</nav>

<style>
	.m3-rail {
		display: flex;
		flex-direction: column;
		width: var(--m3-rail-width);
		height: 100%;
		min-height: 100dvh;
		background: var(--m3-sys-surface-container-low);
		color: var(--m3-sys-on-surface-variant);
		overflow-x: hidden;
		overflow-y: auto;
	}

	.m3-rail.expanded {
		width: var(--m3-rail-width-expanded);
	}

	@media (min-width: 1200px) {
		.m3-rail:not(.collapsed) {
			width: var(--m3-rail-width-expanded);
		}
	}

	.rail-brand {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: var(--m3-touch-target);
		padding: 16px 8px 8px;
	}

	.m3-rail.expanded .rail-brand {
		justify-content: flex-start;
		padding-inline: 16px;
	}

	@media (min-width: 1200px) {
		.m3-rail:not(.collapsed) .rail-brand {
			justify-content: flex-start;
			padding-inline: 16px;
		}
	}

	.rail-fab {
		display: none;
		padding: 8px 12px 4px;
	}

	.m3-rail.expanded .rail-fab {
		display: block;
	}

	@media (min-width: 1200px) {
		.m3-rail:not(.collapsed) .rail-fab {
			display: block;
		}
	}

	.rail-items {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 8px 8px;
	}

	.m3-rail.expanded .rail-items,
	.rail-items {
		align-items: stretch;
	}

	.rail-item {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4px;
		width: 100%;
		min-height: 56px;
		padding: 8px 0;
		border: none;
		border-radius: var(--m3-sys-shape-full);
		background: transparent;
		color: var(--m3-sys-on-surface-variant);
		text-decoration: none;
		cursor: pointer;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
		transition:
			background-color var(--m3-motion-fast),
			color var(--m3-motion-fast);
	}

	.rail-item:disabled,
	.rail-item[aria-disabled='true'] {
		opacity: 0.38;
		cursor: default;
		pointer-events: none;
	}

	.rail-indicator {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 56px;
		height: 32px;
		border-radius: var(--m3-sys-shape-full);
		background: var(--m3-sys-secondary-container);
		opacity: 0;
		pointer-events: none;
		transform: translate(-50%, -50%);
		transition:
			opacity var(--m3-motion-fast),
			background-color var(--m3-motion-fast);
		z-index: 0;
	}

	.rail-icon,
	.rail-label,
	.rail-badge {
		position: relative;
		z-index: 1;
	}

	.rail-icon {
		display: inline-flex;
		flex-shrink: 0;
		color: var(--m3-sys-on-surface-variant);
		transition: color var(--m3-motion-fast);
	}

	.rail-label {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
		font: var(--m3-sys-typescale-title-small-weight) var(--m3-sys-typescale-title-small) /
			var(--m3-sys-typescale-title-small-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-title-small-tracking);
		color: var(--m3-sys-on-surface);
		transition: color var(--m3-motion-fast);
	}

	.rail-badge {
		position: absolute;
		top: 6px;
		left: calc(50% + 6px);
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

	.rail-item[data-active='true'] {
		color: var(--m3-sys-on-surface);
	}

	.rail-item[data-active='true'] .rail-indicator {
		opacity: 1;
	}

	.rail-item[data-active='true'] .rail-icon {
		color: var(--m3-sys-on-surface);
	}

	.m3-rail.expanded .rail-item {
		flex-direction: row;
		justify-content: flex-start;
		gap: 12px;
		padding: 8px 16px;
	}

	.m3-rail.expanded .rail-indicator {
		top: 0;
		left: 4px;
		right: 4px;
		width: auto;
		height: 100%;
		transform: none;
	}

	.m3-rail.expanded .rail-label {
		position: static;
		width: auto;
		height: auto;
		margin: 0;
		overflow: visible;
		clip: auto;
		flex: 1;
		min-width: 0;
		text-align: start;
	}

	.m3-rail.expanded .rail-badge {
		position: static;
		margin-inline-start: auto;
	}

	@media (min-width: 1200px) {
		.m3-rail:not(.collapsed) .rail-item {
			flex-direction: row;
			justify-content: flex-start;
			gap: 12px;
			padding: 8px 16px;
		}

		.m3-rail:not(.collapsed) .rail-indicator {
			top: 0;
			left: 4px;
			right: 4px;
			width: auto;
			height: 100%;
			transform: none;
		}

		.m3-rail:not(.collapsed) .rail-label {
			position: static;
			width: auto;
			height: auto;
			margin: 0;
			overflow: visible;
			clip: auto;
			flex: 1;
			min-width: 0;
			text-align: start;
		}

		.m3-rail:not(.collapsed) .rail-badge {
			position: static;
			margin-inline-start: auto;
		}
	}

	.rail-bottom {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-top: auto;
		padding: 8px 8px 16px;
	}

	.rail-actions,
	.rail-footer {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}

	.m3-rail.expanded .rail-actions,
	.m3-rail.expanded .rail-footer {
		align-items: stretch;
	}

	@media (min-width: 1200px) {
		.m3-rail:not(.collapsed) .rail-actions,
		.m3-rail:not(.collapsed) .rail-footer {
			align-items: stretch;
		}
	}

	@media (forced-colors: active) {
		.rail-item[data-active='true'] .rail-indicator {
			outline: 2px solid Highlight;
		}
	}
</style>
