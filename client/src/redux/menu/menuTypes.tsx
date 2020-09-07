export const TOGGLE_DROP_MENU = "TOGGLE_DROP_MENU"
export const RESET_MENU = "RESET_MENU"

export interface ToggleDropMenu {
  type: typeof TOGGLE_DROP_MENU
}
export interface ResetMenu {
  type: typeof RESET_MENU
}

export type MenuReducerTypes = ToggleDropMenu | ResetMenu
