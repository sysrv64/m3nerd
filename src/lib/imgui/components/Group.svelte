<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		class: className = '',
		children
	}: {
		class?: string;
		children?: Snippet;
	} = $props();
</script>

<div class="ig-group {className}">
	{@render children?.()}
</div>

<style>
	.ig-group {
		display: flex;
		flex-direction: column;
		gap: var(--ig-item-spacing-y);
		min-width: 0;
	}
</style>
