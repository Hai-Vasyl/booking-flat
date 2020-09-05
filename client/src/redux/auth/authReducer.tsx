import {
  SuccessPayloadAuth,
  ErrorPayload,
  FETCH_START_AUTH,
  FETCH_SUCCESS_AUTH,
  FETCH_FAILURE_AUTH,
  CLEAR_ERROR_AUTH,
  SET_AUTH,
  AuthReducerTypes,
} from "./authTypes"

interface InitialState {
  load: boolean
  userData: SuccessPayloadAuth
  errors: ErrorPayload[]
}

const initialState: InitialState = {
  load: false,
  userData: {
    token: "",
    user: {
      typeUser: "",
      ava: "",
      _id: "",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      date: "",
    },
  },
  errors: [],
}

const authReducer = (
  state: InitialState = initialState,
  action: AuthReducerTypes
): InitialState => {
  switch (action.type) {
    case FETCH_START_AUTH:
      return {
        ...state,
        load: true,
      }
    case FETCH_SUCCESS_AUTH:
      localStorage.setItem("auth", JSON.stringify(action.payload))
      return {
        ...state,
        load: false,
        userData: action.payload,
      }
    case FETCH_FAILURE_AUTH:
      return {
        ...state,
        load: false,
        errors: action.payload,
      }
    case CLEAR_ERROR_AUTH:
      const errors = state.errors.map((item) => {
        if (item.param === action.payload) {
          return { ...item, msg: "" }
        }
        return item
      })
      return {
        ...state,
        errors,
      }
    case SET_AUTH:
      const auth: SuccessPayloadAuth = JSON.parse(
        localStorage.getItem("auth") || JSON.stringify(initialState)
      )
      return {
        ...state,
        userData: auth,
      }
    default:
      return state
  }
}

export default authReducer
