/**
 * Minimal anchor positioning for menus/popovers.
 * Measures trigger once on open (no per-frame rAF), flips on viewport overflow.
 * Uses fixed positioning to escape overflow:hidden ancestors without popper deps.
 */

export interface AnchorRect {
	top: number;
	left: number;
	width: number;
	height: number;
}

export function placeNear(
	trigger: DOMRect,
	panel: { width: number; height: number },
	viewport: { width: number; height: number },
	placement: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'bottom' | 'top' = 'bottom-start'
): { top: number; left: number; maxHeight: number } {
	const gap = 4;
	let top: number;
	let left: number;
	let maxHeight: number;

	const preferBottom = placement.startsWith('bottom');
	const spaceBelow = viewport.height - trigger.bottom - gap;
	const spaceAbove = trigger.top - gap;

	let openBelow = preferBottom;
	if (preferBottom && panel.height > spaceBelow && spaceAbove > spaceBelow) {
		openBelow = false;
	} else if (!preferBottom && panel.height > spaceAbove && spaceBelow > spaceAbove) {
		openBelow = true;
	}

	if (openBelow) {
		top = trigger.bottom + gap;
		maxHeight = Math.max(120, spaceBelow);
	} else {
		top = Math.max(gap, trigger.top - gap - panel.height);
		maxHeight = Math.max(120, spaceAbove);
		top = trigger.top - gap - Math.min(panel.height, maxHeight);
		if (top < gap) top = gap;
	}

	if (placement === 'bottom-end' || placement === 'top-end') {
		left = trigger.right - panel.width;
	} else if (placement === 'bottom' || placement === 'top') {
		left = trigger.left + trigger.width / 2 - panel.width / 2;
	} else {
		left = trigger.left;
	}

	left = Math.min(Math.max(gap, left), viewport.width - panel.width - gap);

	return { top, left, maxHeight };
}
