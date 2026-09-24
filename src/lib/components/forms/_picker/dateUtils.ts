export function isLeapYear(year: number): boolean {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
	return new Date(year, month + 1, 0).getDate();
}

export function startOfMonth(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addDays(date: Date, amount: number): Date {
	const next = new Date(date);
	next.setDate(next.getDate() + amount);
	return next;
}

export function addMonths(date: Date, amount: number): Date {
	const day = date.getDate();
	const next = new Date(date.getFullYear(), date.getMonth() + amount, 1);
	const clamped = Math.min(day, daysInMonth(next.getFullYear(), next.getMonth()));
	next.setDate(clamped);
	return next;
}

export function sameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
	if (!a || !b) return false;
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

export function isBeforeDay(a: Date, b: Date): boolean {
	return startOfDay(a).getTime() < startOfDay(b).getTime();
}

export function isAfterDay(a: Date, b: Date): boolean {
	return startOfDay(a).getTime() > startOfDay(b).getTime();
}

export function startOfDay(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isDayDisabled(date: Date, min?: Date | null, max?: Date | null): boolean {
	if (min && isBeforeDay(date, min)) return true;
	if (max && isAfterDay(date, max)) return true;
	return false;
}

const MONTH_LABELS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
] as const;

export const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

export function monthLabel(date: Date): string {
	return `${MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}`;
}

export function dayLabel(date: Date): string {
	const weekday = WEEKDAY_LABELS[date.getDay()];
	return `${MONTH_LABELS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} (${weekday})`;
}

export function toISODate(date: Date): string {
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${date.getFullYear()}-${month}-${day}`;
}

export function parseISODate(input: string): Date | null {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.trim());
	if (!match) return null;
	const year = Number(match[1]);
	const month = Number(match[2]) - 1;
	const day = Number(match[3]);
	if (month < 0 || month > 11) return null;
	if (day < 1 || day > daysInMonth(year, month)) return null;
	const date = new Date(year, month, day);
	if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
		return null;
	}
	return date;
}
