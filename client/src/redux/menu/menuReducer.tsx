import {
  TOGGLE_DROP_MENU,
  RESET_MENU,
  TOGGLE_POPUP_MENU,
  TOGGLE_MAIN_MENU,
  MenuReducerTypes,
} from "./menuTypes"

interface InitialState {
  drop: boolean
  popup: boolean
  dropMenu: boolean
}

const initialState: InitialState = {
  drop: false,
  popup: false,
  dropMenu: false,
}

const menuReducer = (
  state: InitialState = initialState,
  action: MenuReducerTypes
): InitialState => {
  switch (action.type) {
    case TOGGLE_DROP_MENU:
      return {
        ...state,
        drop: !state.drop,
      }
    case RESET_MENU:
      return {
        drop: false,
        popup: false,
        dropMenu: false,
      }
    case TOGGLE_POPUP_MENU:
      return {
        ...state,
        popup: !state.popup,
      }
    case TOGGLE_MAIN_MENU:
      return {
        ...state,
        dropMenu: !state.dropMenu,
      }
    default:
      return state
  }
}

export default menuReducer
