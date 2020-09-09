import React, { useEffect, useState } from "react"
import "./App.scss"
import { useDispatch, useSelector } from "react-redux"
import { SET_AUTH } from "./redux/auth/authTypes"
import {
  AddCartBookingPayload,
  AddCartOrderPayload,
  SET_ORDERS,
} from "./redux/orders/ordersTypes"
import Routes from "./components/Routes"
import { RootStore } from "./redux/store"

const App: React.FC = () => {
  const dispatch = useDispatch()
  const [load, setLoad] = useState(true)
  const {
    orders: { bookings, orderList },
  } = useSelector((state: RootStore) => state)

  useEffect(() => {
    dispatch({ type: SET_AUTH })
    setTimeout(() => setLoad(false), 3000)
  }, [dispatch])

  useEffect(() => {
    const bookings: AddCartBookingPayload[] = JSON.parse(
      localStorage.getItem("ordersFlats") || "[]"
    )
    const orderList: AddCartOrderPayload[] = JSON.parse(
      localStorage.getItem("ordersVouchers") || "[]"
    )

    dispatch({ type: SET_ORDERS, payload: { bookings, orderList } })
  }, [dispatch])

  useEffect(() => {
    localStorage.setItem("ordersFlats", JSON.stringify(bookings))
    localStorage.setItem("ordersVouchers", JSON.stringify(orderList))
  }, [bookings, orderList])

  return (
    <div className='App'>
      <div className={`background ${!load && "background--close"}`}></div>
      {!load && <Routes />}
    </div>
  )
}

export default App
