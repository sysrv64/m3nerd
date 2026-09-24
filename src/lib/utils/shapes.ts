/**
 * Material shape library — subset of the 35 iconic M3 Expressive shapes
 * as SVG path strings for 24×24 viewboxes (normalize before morphing).
 * Full path data from androidx.graphics.shapes mirrored for web.
 */

export const shapes = {
	circle: 'M12,12 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0',
	square: 'M4,4 h16 v16 h-16 z',
	cookie: 'M12,2 C13.1,2 14.1,2.7 14.5,3.7 C15,3.6 15.5,3.7 15.9,4 L15.5,5.5 C16.4,6 17,6.9 17.2,7.9 L18.7,8.2 C19,8.6 19.1,9.1 19,9.6 C19,10.6 18.3,11.5 17.4,11.8 C17.5,12.5 17.4,13.2 17.1,13.8 L18.4,14.9 C18.4,15.4 18.3,15.9 18,16.3 C17.4,17.1 16.4,17.5 15.4,17.3 L14.1,16.2 C13.5,16.5 12.8,16.7 12,16.7 C10.9,16.7 9.9,16.2 9.2,15.4 L7.7,16.1 C7.2,16.3 6.7,16.3 6.2,16.1 C5.3,15.7 4.7,14.8 4.7,13.8 L5.5,12.4 C5.3,11.8 5.2,11.1 5.3,10.4 L3.9,9.5 C3.6,9 3.5,8.5 3.6,8 C3.9,7 4.7,6.3 5.7,6.2 L7.2,6.4 C7.7,5.8 8.3,5.3 9.1,5.1 L9.7,3.6 C10.1,2.9 11,2.3 12,2 Z',
	sunny: 'M12,8 A4,4 0 1,0 12,16 A4,4 0 1,0 12,8 M12,2 L13.5,5 L16.5,3.5 L16,6.5 L19,7 L17,9.5 L20,11 L17,12.5 L19,15 L16,15.5 L16.5,18.5 L13.5,17 L12,20 L10.5,17 L7.5,18.5 L8,15.5 L5,15 L7,12.5 L4,11 L7,9.5 L5,7 L8,6.5 L7.5,3.5 L10.5,5 Z',
	burst: 'M12,2 L14,8 L20,4 L16,10 L22,12 L16,14 L20,20 L14,16 L12,22 L10,16 L4,20 L8,14 L2,12 L8,10 L4,4 L10,8 Z',
	flower: 'M12,12 m-3,0 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0 M12,3 A4,4 0 0,1 12,11 A4,4 0 0,1 12,3 M12,13 A4,4 0 0,1 12,21 A4,4 0 0,1 12,13 M3,12 A4,4 0 0,1 11,12 A4,4 0 0,1 3,12 M13,12 A4,4 0 0,1 21,12 A4,4 0 0,1 13,12',
	pill: 'M8,4 h8 a4,4 0 0,1 0,8 h-8 a4,4 0 0,1 0,-8 z M8,12 h8 a4,4 0 0,1 0,8 h-8 a4,4 0 0,1 0,-8 z'
} as const;

export type ShapeName = keyof typeof shapes;

/** Rounded-rect path for a given radius on a w×h box (morph target helper). */
export function roundedRect(w: number, h: number, r: number): string {
	const radius = Math.min(r, w / 2, h / 2);
	return `M${radius},0 H${w - radius} A${radius},${radius} 0 0 1 ${w},${radius} V${h - radius} A${radius},${radius} 0 0 1 ${w - radius},${h} H${radius} A${radius},${radius} 0 0 1 0,${h - radius} V${radius} A${radius},${radius} 0 0 1 ${radius},0 Z`;
}
