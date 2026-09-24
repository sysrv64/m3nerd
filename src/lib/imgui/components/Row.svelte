<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		class: className = '',
		align = 'center',
		children
	}: {
		class?: string;
		align?: 'start' | 'center' | 'end' | 'stretch';
		children?: Snippet;
	} = $props();
</script>

<div class="ig-row a-{align} {className}">
	{@render children?.()}
</div>

<style>
	.ig-row {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: var(--ig-item-spacing-y) var(--ig-item-spacing-x);
		min-width: 0;
	}

	.a-start {
		align-items: flex-start;
		justify-content: flex-start;
	}

	.a-center {
		align-items: center;
		justify-content: flex-start;
	}

	.a-end {
		align-items: flex-end;
		justify-content: flex-end;
	}

	.a-stretch {
		align-items: stretch;
	}
</style>
