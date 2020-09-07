import { combineReducers } from "redux"
import authReducer from "./auth/authReducer"
import menuReducer from "./menu/menuReducer"

const rootReducer = combineReducers({
  auth: authReducer,
  menu: menuReducer,
})

export default rootReducer
