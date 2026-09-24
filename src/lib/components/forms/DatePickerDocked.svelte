<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements';
import { cn } from '../../utils/cn.js';
import Header from './_picker/Header.svelte';
import CalendarPicker from './_picker/CalendarPicker.svelte';
import Actions from './_picker/Actions.svelte';
import { addMonths, monthLabel, startOfMonth } from './_picker/dateUtils.js';

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'onselect'> {
	selected?: Date | null;
	minDate?: Date | null;
	maxDate?: Date | null;
	class?: string;
}

let {
	selected = $bindable(null),
	minDate = null,
	maxDate = null,
	class: className,
	...rest
}: Props = $props();

let pending = $state<Date | null>(selected);
let viewDate = $state<Date>(startOfMonth(selected ?? new Date()));
let open = $state(false);

$effect(() => {
	pending = selected;
});

const canPrev = $derived(
	!minDate || startOfMonth(viewDate).getTime() > startOfMonth(minDate).getTime()
);
const canNext = $derived(
	!maxDate || startOfMonth(viewDate).getTime() < startOfMonth(maxDate).getTime()
);

function onPrev() {
	if (canPrev) viewDate = addMonths(viewDate, -1);
}

function onNext() {
	if (canNext) viewDate = addMonths(viewDate, 1);
}

function onSelect(day: Date) {
	pending = day;
	if (day.getMonth() !== viewDate.getMonth() || day.getFullYear() !== viewDate.getFullYear()) {
		viewDate = startOfMonth(day);
	}
}

function onYear(year: number) {
	const month = viewDate.getMonth();
	let next = new Date(year, month, 1);
	if (minDate && startOfMonth(next).getTime() < startOfMonth(minDate).getTime()) {
		next = startOfMonth(minDate);
	}
	if (maxDate && startOfMonth(next).getTime() > startOfMonth(maxDate).getTime()) {
		next = startOfMonth(maxDate);
	}
	viewDate = next;
	open = false;
}

function onCancel() {
	pending = selected;
	if (pending) viewDate = startOfMonth(pending);
	open = false;
}

function onOk() {
	selected = pending;
	if (pending) viewDate = startOfMonth(pending);
	open = false;
}
</script>

<div class={cn('m3-date-picker', className)} {...rest}>
	<Header
		label={monthLabel(viewDate)}
		{open}
		disablePrev={!canPrev}
		disableNext={!canNext}
		onprev={onPrev}
		onnext={onNext}
		ontoggle={() => (open = !open)}
	/>
	<CalendarPicker
		viewDate={viewDate}
		selected={pending}
		{minDate}
		{maxDate}
		{open}
		onselect={onSelect}
		onview={(date) => (viewDate = date)}
		onyear={onYear}
	/>
	<Actions oncancel={onCancel} onok={onOk} />
</div>

<style>
	.m3-date-picker {
		display: flex;
		flex-direction: column;
		width: 328px;
		min-width: 328px;
		max-width: calc(100vw - 32px);
		border-radius: var(--m3-sys-shape-medium);
		background: var(--m3-sys-surface-container-low);
		overflow: hidden;
		color: var(--m3-sys-on-surface);
	}
</style>
