<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements';
import { tick } from 'svelte';
import { cn } from '../../../utils/cn.js';
import {
	WEEKDAY_LABELS,
	addDays,
	addMonths,
	daysInMonth,
	isDayDisabled,
	sameDay,
	startOfMonth,
	toISODate,
	dayLabel
} from './dateUtils.js';

const FULL_WEEKDAYS = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday'
] as const;

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'onselect'> {
	viewDate: Date;
	selected?: Date | null;
	minDate?: Date | null;
	maxDate?: Date | null;
	open?: boolean;
	onselect?: (day: Date) => void;
	onview?: (date: Date) => void;
	onyear?: (year: number) => void;
	class?: string;
}

let {
	viewDate,
	selected = null,
	minDate = null,
	maxDate = null,
	open = false,
	onselect,
	onview,
	onyear,
	class: className,
	...rest
}: Props = $props();

let focusDate = $state<Date | null>(null);

const activeFocus = $derived(focusDate ?? selected ?? new Date());

$effect(() => {
	const year = viewDate.getFullYear();
	const month = viewDate.getMonth();
	if (activeFocus.getFullYear() !== year || activeFocus.getMonth() !== month) {
		const day = Math.min(activeFocus.getDate(), daysInMonth(year, month));
		focusDate = new Date(year, month, day);
	}
});

const weeks = $derived.by(() => {
	const first = startOfMonth(viewDate);
	const start = addDays(first, -first.getDay());
	const cells: Array<{ date: Date; inMonth: boolean }> = [];
	for (let i = 0; i < 42; i++) {
		const date = addDays(start, i);
		cells.push({ date, inMonth: date.getMonth() === viewDate.getMonth() });
	}
	const rows: Array<typeof cells> = [];
	for (let r = 0; r < 6; r++) rows.push(cells.slice(r * 7, r * 7 + 7));
	return rows;
});

const yearGrid = $derived.by(() => {
	const startYear = viewDate.getFullYear() - (viewDate.getFullYear() % 12);
	return Array.from({ length: 12 }, (_, i) => startYear + i);
});

const today = new Date();

function stepTo(from: Date, step: number): Date | null {
	let next = addDays(from, step);
	for (let guard = 0; guard < 800 && isDayDisabled(next, minDate, maxDate); guard++) {
		next = addDays(next, step);
	}
	return isDayDisabled(next, minDate, maxDate) ? null : next;
}

async function moveFocus(next: Date) {
	focusDate = next;
	if (
		next.getMonth() !== viewDate.getMonth() ||
		next.getFullYear() !== viewDate.getFullYear()
	) {
		onview?.(startOfMonth(next));
	}
	await tick();
	const el = document.querySelector<HTMLElement>(`[data-date="${toISODate(next)}"]`);
	el?.focus();
}

function onKeydown(event: KeyboardEvent) {
	if (open) return;
	let next: Date | null = null;
	switch (event.key) {
		case 'ArrowLeft':
			next = stepTo(activeFocus, -1);
			break;
		case 'ArrowRight':
			next = stepTo(activeFocus, 1);
			break;
		case 'ArrowUp':
			next = stepTo(activeFocus, -7);
			break;
		case 'ArrowDown':
			next = stepTo(activeFocus, 7);
			break;
		case 'Home': {
			const target = addDays(activeFocus, -activeFocus.getDay());
			next = isDayDisabled(target, minDate, maxDate) ? null : target;
			break;
		}
		case 'End': {
			const target = addDays(activeFocus, 6 - activeFocus.getDay());
			next = isDayDisabled(target, minDate, maxDate) ? null : target;
			break;
		}
		case 'PageUp':
			next = clampMoved(addMonths(activeFocus, -1));
			if (next && isDayDisabled(next, minDate, maxDate)) next = null;
			break;
		case 'PageDown':
			next = clampMoved(addMonths(activeFocus, 1));
			if (next && isDayDisabled(next, minDate, maxDate)) next = null;
			break;
		default:
			return;
	}
	event.preventDefault();
	if (next) void moveFocus(next);
}

function clampMoved(date: Date): Date | null {
	const dim = daysInMonth(date.getFullYear(), date.getMonth());
	const day = Math.min(activeFocus.getDate(), dim);
	return new Date(date.getFullYear(), date.getMonth(), day);
}
</script>

<div
	class={cn('m3-calendar', open && 'year-mode', className)}
	role="grid"
	aria-label="Choose date"
	tabindex="-1"
	onkeydown={onKeydown}
	{...rest}
>
	{#if open}
		<div class="m3-calendar__row" role="row">
			{#each yearGrid as year (year)}
				<span class="m3-calendar__cell" role="gridcell">
					<button
						class={cn('m3-calendar__day', 'm3-calendar__year', year === viewDate.getFullYear() && 'selected')}
						type="button"
						aria-label={String(year)}
						onclick={() => onyear?.(year)}
					>
						{year}
					</button>
				</span>
			{/each}
		</div>
	{:else}
		<div class="m3-calendar__row weekdays" role="row">
			{#each WEEKDAY_LABELS as weekday, i (weekday)}
				<span class="m3-calendar__weekday" role="columnheader" aria-label={FULL_WEEKDAYS[i]}>
					{weekday}
				</span>
			{/each}
		</div>
		{#each weeks as week, wi (wi)}
			<div class="m3-calendar__row" role="row">
				{#each week as cell (toISODate(cell.date))}
					<span
						role="gridcell"
						aria-selected={cell.inMonth && sameDay(cell.date, selected)}
					>
						{#if cell.inMonth}
							{@const disabled = isDayDisabled(cell.date, minDate, maxDate)}
							<button
								class={cn(
									'm3-calendar__day',
									sameDay(cell.date, today) && 'today',
									sameDay(cell.date, selected) && 'selected',
									disabled && 'disabled'
								)}
								type="button"
								data-date={toISODate(cell.date)}
								tabindex={sameDay(cell.date, activeFocus) ? 0 : -1}
								aria-label={dayLabel(cell.date)}
								disabled={disabled}
								onclick={() => onselect?.(cell.date)}
							>
								{cell.date.getDate()}
							</button>
						{/if}
					</span>
				{/each}
			</div>
		{/each}
	{/if}
</div>

<style>
	.m3-calendar {
		padding: 4px 8px 8px;
		outline: none;
		color: var(--m3-sys-on-surface);
	}

	.m3-calendar__row {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
	}

	.m3-calendar__weekday {
		display: flex;
		align-items: center;
		justify-content: center;
		height: calc(32px * var(--m3-density-scale));
		color: var(--m3-sys-on-surface-variant);
		font: var(--m3-sys-typescale-body-small-weight) var(--m3-sys-typescale-body-small) /
			var(--m3-sys-typescale-body-small-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-body-small-tracking);
	}

	.m3-calendar__cell {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.m3-calendar__day {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--m3-touch-target);
		max-width: 100%;
		height: var(--m3-touch-target);
		margin: 0 auto;
		padding: 0;
		border: none;
		border-radius: var(--m3-sys-shape-full);
		background: transparent;
		color: inherit;
		font: var(--m3-sys-typescale-body-large-weight) var(--m3-sys-typescale-body-large) /
			var(--m3-sys-typescale-body-large-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-body-large-tracking);
		cursor: pointer;
		transition:
			background-color var(--m3-motion-fast),
			color var(--m3-motion-fast);
	}

	.m3-calendar__day:hover:not(:disabled, .selected) {
		background: var(--m3-sys-surface-container-high);
	}

	.m3-calendar__day:focus-visible {
		outline: 3px solid var(--m3-sys-primary);
		outline-offset: -3px;
	}

	.m3-calendar__day.today:not(.selected) {
		color: var(--m3-sys-primary);
		box-shadow: inset 0 0 0 1px var(--m3-sys-primary);
	}

	.m3-calendar__day.selected {
		background: var(--m3-sys-primary-container);
		color: var(--m3-sys-on-primary-container);
		font-weight: 500;
	}

	.m3-calendar__day.disabled {
		opacity: 0.38;
		pointer-events: none;
	}

	.m3-calendar__year {
		font: var(--m3-sys-typescale-label-large-weight) var(--m3-sys-typescale-label-large) /
			var(--m3-sys-typescale-label-large-line) var(--m3-sys-font);
		letter-spacing: var(--m3-sys-typescale-label-large-tracking);
	}

	.m3-calendar.year-mode .m3-calendar__row {
		grid-template-columns: repeat(4, 1fr);
	}

	@media (forced-colors: active) {
		.m3-calendar__day.selected {
			background: Highlight;
			color: HighlightText;
		}
	}
</style>
