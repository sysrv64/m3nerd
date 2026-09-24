<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		disabled = false,
		color,
		mono = false,
		class: className = '',
		value,
		children
	}: {
		disabled?: boolean;
		color?: string;
		mono?: boolean;
		class?: string;
		value?: string;
		children?: Snippet;
	} = $props();

	const styleColor = $derived(disabled ? 'var(--ig-text-disabled)' : color ?? 'inherit');
</script>

<span
	class="ig-text {className}"
	style:color={styleColor}
	class:mono
>
	{#if value !== undefined}{value}{:else}{@render children?.()}{/if}
</span>

<style>
	.ig-text {
		font-size: var(--ig-font-size);
		line-height: var(--ig-line-height);
		min-width: 0;
	}

	.ig-text.mono {
		font-family: var(--ig-font-mono);
	}
</style>
