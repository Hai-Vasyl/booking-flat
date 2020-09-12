export interface Order {
  _id: string
  voucher: { _id: string; image: string }
  name: string
  quantity: string
  price: string
  variant: string
  firstname: string
  lastname: string
  email: string
}

export interface Booking {
  _id: string
  apartment: { _id: string; image: string }
  name: string
  numberRooms: string
  price: string
  timeRange: string
  settlement: string
  eviction: string
  firstname: string
  lastname: string
  email: string
}

export interface OrdersBookings {
  orders: Order[]
  bookings: Booking[]
}
