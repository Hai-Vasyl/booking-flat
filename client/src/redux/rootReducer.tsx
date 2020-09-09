import { combineReducers } from "redux"
import authReducer from "./auth/authReducer"
import menuReducer from "./menu/menuReducer"
import ordersReducer from "./orders/ordersReducer"

const rootReducer = combineReducers({
  auth: authReducer,
  menu: menuReducer,
  orders: ordersReducer,
})

export default rootReducer
