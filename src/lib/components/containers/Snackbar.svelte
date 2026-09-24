<script module lang="ts">
	export { snackbar } from '../../utils/snackbar.js';
</script>

<script lang="ts">
	import type { SnackbarMessage } from '../../utils/snackbar.js';
	import { subscribeSnackbars, shiftSnackbar } from '../../utils/snackbar.js';
	import { cn } from '../../utils/cn.js';

	interface Props {
		class?: string;
		[key: string]: unknown;
	}

	let { class: className, ...rest }: Props = $props();

	let queue = $state.raw<SnackbarMessage[]>([]);
	let shown = $state.raw<SnackbarMessage | null>(null);
	let visible = $state(false);

	$effect(() => {
		const unsubscribe = subscribeSnackbars((next) => {
			queue = next;
		});
		return unsubscribe;
	});

	$effect(() => {
		const message = queue[0];
		if (message) {
			shown = message;
			visible = true;
			const timeout = setTimeout(() => {
				shiftSnackbar();
			}, message.duration ?? 4000);
			return () => clearTimeout(timeout);
		}
		visible = false;
	});

	function handleAction() {
		shown?.action?.onClick();
		shiftSnackbar();
	}

	function handleTransitionEnd(e: TransitionEvent) {
		if (e.target !== e.currentTarget) return;
		if (e.propertyName !== 'transform') return;
		if (!visible) shown = null;
	}
</script>

<div
	class={cn('m3-snackbar-host', className)}
	role="status"
	aria-live="polite"
	{...rest}
>
	{#if shown}
		<div
			class={cn('m3-snackbar', visible && 'visible')}
			ontransitionend={handleTransitionEnd}
		>
			<span class="m3-snackbar__text">{shown.text}</span>
			{#if shown.action}
				<button
					type="button"
					class="m3-snackbar__action m3-layer"
					onclick={handleAction}
				>
					{shown.action.label}
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.m3-snackbar-host {
		--_offset: calc(var(--m3-nav-height) + 16px);
		position: fixed;
		left: 0;
		right: 0;
		bottom: var(--_offset);
		display: flex;
		justify-content: center;
		padding-inline: 16px;
		z-index: 1200;
		pointer-events: none;
	}

	@media (min-width: 840px) {
		.m3-snackbar-host {
			--_offset: 24px;
		}
	}

	.m3-snackbar {
		display: flex;
		align-items: center;
		gap: var(--m3-sys-space-2);
		width: fit-content;
		max-width: min(512px, calc(100vw - 32px));
		min-height: 48px;
		padding: 8px 8px 8px 16px;
		border-radius: var(--m3-sys-shape-extra-small);
		background: var(--m3-sys-inverse-surface);
		color: var(--m3-sys-inverse-on-surface);
		box-shadow: var(--m3-sys-elevation-3);
		opacity: 0;
		transform: translateY(calc(100% + var(--_offset)));
		pointer-events: none;
		transition:
			transform var(--m3-motion-spatial-default),
			opacity var(--m3-motion-default);
	}

	.m3-snackbar.visible {
		opacity: 1;
		transform: translateY(0);
		pointer-events: auto;
	}

	.m3-snackbar__text {
		flex: 1;
		min-width: 0;
		font: var(--m3-sys-typescale-body-medium-weight) var(--m3-sys-typescale-body-medium) /
			var(--m3-sys-typescale-body-medium-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-body-medium-tracking);
	}

	.m3-snackbar__action {
		position: relative;
		flex-shrink: 0;
		height: 40px;
		padding-inline: 12px;
		border: none;
		border-radius: var(--m3-sys-shape-full);
		background: transparent;
		color: var(--m3-sys-inverse-primary);
		font: var(--m3-sys-typescale-label-large-weight) var(--m3-sys-typescale-label-large) /
			var(--m3-sys-typescale-label-large-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-label-large-tracking);
		cursor: pointer;
		white-space: nowrap;
		-webkit-tap-highlight-color: transparent;
	}

	.m3-snackbar__action:focus-visible {
		outline-color: var(--m3-sys-inverse-primary);
	}
</style>
