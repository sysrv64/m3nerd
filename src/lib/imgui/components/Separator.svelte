<script lang="ts">
	let {
		horizontal = true,
		label = '',
		class: className = ''
	}: {
		horizontal?: boolean;
		label?: string;
		class?: string;
	} = $props();
</script>

{#if horizontal}
	<div class="ig-separator horizontal {className}" role="separator">
		{#if label}
			<span class="line"></span>
			<span class="label-text">{label}</span>
			<span class="line"></span>
		{/if}
	</div>
{:else}
	<div class="ig-separator vertical {className}" role="separator"></div>
{/if}

<style>
	.ig-separator.horizontal {
		display: flex;
		align-items: center;
		height: 1px;
		background: var(--ig-separator);
		margin: var(--ig-item-spacing-y) 0;
		flex-shrink: 0;
	}

	.ig-separator.horizontal:has(.label-text) {
		height: auto;
		background: transparent;
		gap: var(--ig-item-spacing-x);
	}

	.line {
		flex: 1;
		height: 1px;
		background: var(--ig-separator);
	}

	.label-text {
		flex-shrink: 0;
		font-size: var(--ig-font-size-sm);
		color: var(--ig-text-disabled);
		line-height: var(--ig-line-height);
	}

	.ig-separator.vertical {
		width: 1px;
		align-self: stretch;
		margin: 0 var(--ig-item-spacing-x);
		min-height: 1em;
		background: var(--ig-separator);
		flex-shrink: 0;
	}
</style>
