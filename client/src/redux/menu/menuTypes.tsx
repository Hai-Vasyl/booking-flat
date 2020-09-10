export const TOGGLE_DROP_MENU = "TOGGLE_DROP_MENU"
export const RESET_MENU = "RESET_MENU"
export const TOGGLE_POPUP_MENU = "TOGGLE_POPUP_MENU"
export const TOGGLE_MAIN_MENU = "TOGGLE_MAIN_MENU"

export interface ToggleDropMenu {
  type: typeof TOGGLE_DROP_MENU
}

export interface ResetMenu {
  type: typeof RESET_MENU
}

export interface TogglePopupMenu {
  type: typeof TOGGLE_POPUP_MENU
}

export interface ToggleMainMenu {
  type: typeof TOGGLE_MAIN_MENU
}

export type MenuReducerTypes =
  | ToggleDropMenu
  | ResetMenu
  | TogglePopupMenu
  | ToggleMainMenu
