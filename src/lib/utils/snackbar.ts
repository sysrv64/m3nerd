/**
 * Imperative snackbar API — call from anywhere after the Snackbar root is mounted.
 * Module-level queue; single consumer component drains it. No observers, no timers
 * beyond one per visible message.
 */

export interface SnackbarMessage {
	text: string;
	action?: { label: string; onClick: () => void };
	duration?: number;
}

type Listener = (queue: SnackbarMessage[]) => void;

const queue: SnackbarMessage[] = [];
const listeners = new Set<Listener>();

function notify(): void {
	const snapshot = queue.slice();
	for (const l of listeners) l(snapshot);
}

export function snackbar(text: string, options?: Omit<SnackbarMessage, 'text'>): void {
	queue.push({ text, ...options });
	notify();
}

/** @internal Used by the Snackbar component. */
export function subscribeSnackbars(listener: Listener): () => void {
	listeners.add(listener);
	listener(queue.slice());
	return () => listeners.delete(listener);
}

/** @internal */
export function shiftSnackbar(): void {
	queue.shift();
	notify();
}
