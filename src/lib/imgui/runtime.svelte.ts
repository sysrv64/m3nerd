/**
 * ImGUI interaction runtime — single active/hover owner (ImGui ActiveId model).
 * Module-level $state; widgets set/clear on pointer events.
 */

export type IgId = string;

const state = $state({
	activeId: null as IgId | null,
	hoverId: null as IgId | null
});

export function igSetActive(id: IgId | null): void {
	state.activeId = id;
}

export function igSetHover(id: IgId | null): void {
	state.hoverId = id;
}

export function igIsActive(id: IgId): boolean {
	return state.activeId === id;
}

export function igIsHover(id: IgId): boolean {
	return state.hoverId === id;
}

export function igRuntime() {
	return state;
}
