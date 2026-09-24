<script lang="ts">
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
	class?: string;
	label?: string;
}

let {
	items,
	activeId = $bindable(''),
	class: className,
	label = 'Primary',
	...rest
}: Props = $props();

const iconsOnly = $derived(items.length > 5);

function activate(item: NavItem) {
	if (item.disabled) return;
	activeId = item.id;
}
</script>

<nav
	class={cn('m3-nav-bar', iconsOnly && 'icons-only', className)}
	aria-label={label}
	{...rest}
>
	{#each items as item (item.id)}
		{#if item.href}
			<a
				class="m3-nav-bar__item m3-layer"
				href={item.disabled ? undefined : item.href}
				aria-current={item.id === activeId ? 'page' : undefined}
				aria-disabled={item.disabled || undefined}
				data-active={item.id === activeId}
				title={item.label}
				onclick={item.disabled ? undefined : () => activate(item)}
			>
				<span class="icon-wrap">
					<span class="indicator" aria-hidden="true"></span>
					<span class="icon"><span class="material-symbols-outlined" aria-hidden="true">{item.icon}</span></span>
				</span>
				<span class="label">{item.label}</span>
				{#if item.badge != null && item.badge !== ''}
					<span class="badge">{item.badge}</span>
				{/if}
			</a>
		{:else}
			<button
				type="button"
				class="m3-nav-bar__item m3-layer"
				disabled={item.disabled}
				aria-current={item.id === activeId ? 'page' : undefined}
				data-active={item.id === activeId}
				title={item.label}
				onclick={() => activate(item)}
			>
				<span class="icon-wrap">
					<span class="indicator" aria-hidden="true"></span>
					<span class="icon"><span class="material-symbols-outlined" aria-hidden="true">{item.icon}</span></span>
				</span>
				<span class="label">{item.label}</span>
				{#if item.badge != null && item.badge !== ''}
					<span class="badge">{item.badge}</span>
				{/if}
			</button>
		{/if}
	{/each}
</nav>

<style>
	.m3-nav-bar {
		display: flex;
		align-items: stretch;
		width: 100%;
		height: var(--m3-nav-height);
		background: var(--m3-sys-surface-container);
		color: var(--m3-sys-on-surface-variant);
		box-shadow: var(--m3-sys-elevation-2);
	}

	.m3-nav-bar__item {
		position: relative;
		flex: 1 1 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4px;
		min-width: 0;
		min-height: var(--m3-touch-target);
		padding: 8px 4px;
		border: none;
		background: transparent;
		color: inherit;
		text-decoration: none;
		text-align: center;
		cursor: pointer;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}

	.m3-nav-bar__item:disabled,
	.m3-nav-bar__item[aria-disabled='true'] {
		opacity: 0.38;
		cursor: default;
		pointer-events: none;
	}

	.icon-wrap {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 4px 16px;
	}

	.indicator {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 64px;
		height: 32px;
		border-radius: var(--m3-sys-shape-full);
		background: var(--m3-sys-secondary-container);
		opacity: 0;
		pointer-events: none;
		transform: translate(-50%, -50%);
		transition:
			opacity var(--m3-motion-fast),
			background-color var(--m3-motion-fast);
	}

	.icon {
		position: relative;
		z-index: 1;
		display: inline-flex;
		color: var(--m3-sys-on-surface-variant);
		transition: color var(--m3-motion-fast);
	}

	.label {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font: var(--m3-sys-typescale-label-medium-weight) var(--m3-sys-typescale-label-medium) /
			var(--m3-sys-typescale-label-medium-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-label-medium-tracking);
		color: var(--m3-sys-on-surface-variant);
		transition: color var(--m3-motion-fast);
	}

	.m3-nav-bar__item[data-active='true'] {
		color: var(--m3-sys-on-surface);
	}

	.m3-nav-bar__item[data-active='true'] .indicator {
		opacity: 1;
	}

	.m3-nav-bar__item[data-active='true'] .icon {
		color: var(--m3-sys-on-surface);
	}

	.m3-nav-bar__item[data-active='true'] .label {
		color: var(--m3-sys-secondary);
	}

	.badge {
		position: absolute;
		top: 10px;
		left: calc(50% + 8px);
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
		z-index: 2;
	}

	.icons-only .label {
		display: none;
	}

	@media (forced-colors: active) {
		.m3-nav-bar__item[data-active='true'] .indicator {
			outline: 2px solid Highlight;
		}
	}
</style>
