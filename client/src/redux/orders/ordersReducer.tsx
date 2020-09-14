import {
  AddCartBookingPayload,
  AddCartOrderPayload,
  OrderReducerTypes,
  ADD_CART_BOOKING,
  REMOVE_CART_BOOKING,
  ADD_CART_ORDER,
  REMOVE_CART_ORDER,
  SET_ORDERS,
  CHANGE_QUANTITY_ORDERS,
  RESET_ORDERS,
} from "./ordersTypes"

interface InitialState {
  bookings: AddCartBookingPayload[]
  orderList: AddCartOrderPayload[]
}

const initialState: InitialState = {
  bookings: [],
  orderList: [],
}

const ordersReducer = (
  state: InitialState = initialState,
  action: OrderReducerTypes
): InitialState => {
  switch (action.type) {
    case ADD_CART_BOOKING:
      const { _id, settlement, eviction } = action.payload.time

      let isInclude = false
      const newBookings = state.bookings.map((item) => {
        if (item._id === action.payload._id) {
          isInclude = true
          return { ...item, time: { _id, settlement, eviction } }
        }
        return item
      })
      return {
        ...state,
        bookings: isInclude
          ? newBookings
          : [{ ...action.payload }, ...state.bookings],
      }
    case REMOVE_CART_BOOKING:
      return {
        ...state,
        bookings: state.bookings.filter((item) => item._id !== action.payload),
      }
    case ADD_CART_ORDER:
      return {
        ...state,
        orderList: [{ ...action.payload }, ...state.orderList],
      }
    case REMOVE_CART_ORDER:
      return {
        ...state,
        orderList: state.orderList.filter(
          (item) => item._id !== action.payload
        ),
      }
    case SET_ORDERS:
      return action.payload
    case RESET_ORDERS:
      return initialState
    case CHANGE_QUANTITY_ORDERS:
      const { value, id } = action.payload

      const newOrderList = state.orderList.map((item) => {
        if (item._id === id) {
          return { ...item, quantity: value }
        }
        return item
      })

      return {
        ...state,
        orderList: newOrderList,
      }
    default:
      return state
  }
}

export default ordersReducer
