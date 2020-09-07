import { TOGGLE_DROP_MENU, RESET_MENU, MenuReducerTypes } from "./menuTypes"

interface InitialState {
  drop: boolean
}

const initialState: InitialState = {
  drop: false,
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
      }
    default:
      return state
  }
}

export default menuReducer
