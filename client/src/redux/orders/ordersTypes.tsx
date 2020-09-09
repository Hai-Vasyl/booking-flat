export const ADD_CART_BOOKING = "ADD_CART_BOOKING"
export const REMOVE_CART_BOOKING = "REMOVE_CART_BOOKING"
export const ADD_CART_ORDER = "ADD_CART_ORDER"
export const REMOVE_CART_ORDER = "REMOVE_CART_ORDER"
export const SET_ORDERS = "SET_ORDERS"

interface Time {
  _id: string
  settlement: string
  eviction: string
}

export interface AddCartBookingPayload {
  image: string
  numberRooms: string
  price: string
  _id: string
  name: string
  time: Time
}

export interface AddCartOrderPayload {
  name: string
  image: string
  price: string
  quantity: string
  variant: string
  _id: string
}

interface Orders {
  orderList: AddCartOrderPayload[]
  bookings: AddCartBookingPayload[]
}

export interface AddCartBooking {
  type: typeof ADD_CART_BOOKING
  payload: AddCartBookingPayload
}

export interface AddCartOrder {
  type: typeof ADD_CART_ORDER
  payload: AddCartOrderPayload
}

export interface RemoveCartBooking {
  type: typeof REMOVE_CART_BOOKING
  payload: string
}

export interface RemoveCartOrder {
  type: typeof REMOVE_CART_ORDER
  payload: string
}

export interface SetOrders {
  type: typeof SET_ORDERS
  payload: Orders
}

export type OrderReducerTypes =
  | AddCartBooking
  | AddCartOrder
  | RemoveCartBooking
  | RemoveCartOrder
  | SetOrders
