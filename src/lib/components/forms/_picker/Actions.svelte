<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements';
import Button from '../../buttons/Button.svelte';
import { cn } from '../../../utils/cn.js';

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'oncancel'> {
	oncancel?: () => void;
	onok?: () => void;
	cancelLabel?: string;
	okLabel?: string;
	class?: string;
}

let {
	oncancel,
	onok,
	cancelLabel = 'Cancel',
	okLabel = 'OK',
	class: className,
	...rest
}: Props = $props();
</script>

<div class={cn('m3-picker-actions', className)} {...rest}>
	<Button variant="text" onclick={() => oncancel?.()}>{cancelLabel}</Button>
	<Button variant="text" onclick={() => onok?.()}>{okLabel}</Button>
</div>

<style>
	.m3-picker-actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 8px;
		padding: 8px;
		border-top: 1px solid var(--m3-sys-outline-variant);
	}
</style>
