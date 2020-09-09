import {
  AddCartBookingPayload,
  AddCartOrderPayload,
  OrderReducerTypes,
  ADD_CART_BOOKING,
  REMOVE_CART_BOOKING,
  ADD_CART_ORDER,
  REMOVE_CART_ORDER,
  SET_ORDERS,
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
      return {
        ...state,
        bookings: [{ ...action.payload }, ...state.bookings],
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
    default:
      return state
  }
}

export default ordersReducer
