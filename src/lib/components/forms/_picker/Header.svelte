<script lang="ts">
import { cn } from '../../../utils/cn.js';
import IconButton from '../../buttons/IconButton.svelte';

interface Props {
	label: string;
	open?: boolean;
	disablePrev?: boolean;
	disableNext?: boolean;
	onprev?: () => void;
	onnext?: () => void;
	ontoggle?: () => void;
	class?: string;
}

let {
	label,
	open = false,
	disablePrev = false,
	disableNext = false,
	onprev,
	onnext,
	ontoggle,
	class: className
}: Props = $props();
</script>

<div class={cn('m3-picker-header', className)}>
	<IconButton aria-label="Previous month" disabled={disablePrev} onclick={() => onprev?.()}>
		<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
			<path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
		</svg>
	</IconButton>
	<button
		class="m3-picker-header__title"
		type="button"
		aria-expanded={open}
		onclick={() => ontoggle?.()}
	>
		{label}
		<svg
			class="m3-picker-header__arrow"
			class:open
			viewBox="0 0 24 24"
			width="18"
			height="18"
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M12 15.5 5.5 9l1.06-1.06L12 13.38l5.44-5.44L18.5 9 12 15.5Z" />
		</svg>
	</button>
	<IconButton aria-label="Next month" disabled={disableNext} onclick={() => onnext?.()}>
		<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
			<path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z" />
		</svg>
	</IconButton>
</div>

<style>
	.m3-picker-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 4px;
		padding: 4px 4px 0;
		color: var(--m3-sys-on-surface);
	}

	.m3-picker-header__title {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		min-height: var(--m3-touch-target);
		margin: 0;
		padding: 0 8px;
		border: none;
		border-radius: var(--m3-sys-shape-full);
		background: transparent;
		color: inherit;
		font: var(--m3-sys-typescale-title-medium-weight) var(--m3-sys-typescale-title-medium) /
			var(--m3-sys-typescale-title-medium-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-title-medium-tracking);
		cursor: pointer;
		transition:
			background-color var(--m3-motion-fast),
			color var(--m3-motion-fast);
	}

	.m3-picker-header__title:focus-visible {
		outline: 3px solid var(--m3-sys-primary);
		outline-offset: 2px;
	}

	.m3-picker-header__arrow {
		transform: rotate(0deg);
		transition: transform var(--m3-motion-spatial-fast);
	}

	.m3-picker-header__arrow.open {
		transform: rotate(180deg);
	}

	@media (forced-colors: active) {
		.m3-picker-header__title {
			border: 1px solid ButtonText;
		}
	}
</style>
