import React, { useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { RootStore } from "../redux/store"
import { AiOutlineSearch } from "react-icons/ai"
import { OrdersBookings } from "../interfaces"
import BookingItem from "../components/BookingItem"
import OrderItem from "../components/OrderItem"

const Find = () => {
  const [data, setData] = useState<OrdersBookings>({ orders: [], bookings: [] })
  const [form, setForm] = useState<string>("")
  const location = useLocation()
  const isFind = location.pathname === "/find-buyer"
  const {
    auth: { userData },
  } = useSelector((state: RootStore) => state)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios({
          url: isFind ? "/orders/get-orders" : "/orders/get-orders-byowner",
          method: isFind ? "post" : "get",
          data: isFind ? { searchedText: form } : null,
          headers: userData && {
            Authorization: `Basic ${userData.token}`,
          },
        })

        setData(res.data)
      } catch (error) {}
    }

    fetchData()
  }, [form, userData, isFind])

  const bookingsItems = data.bookings.map((item) => (
    <BookingItem key={item._id} {...item} />
  ))
  const orderListItems = data.orders.map((item) => (
    <OrderItem key={item._id} {...item} />
  ))

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(event.target.value)
  }

  return (
    <div className='wrapper'>
      {isFind && (
        <div className='search'>
          <input
            type='text'
            className='field__input'
            value={form}
            onChange={handleChange}
            placeholder='Search buyer by firstname, lastname or email'
          />
          <AiOutlineSearch className='search__icon' />
        </div>
      )}

      <div className='found-items'>
        <div>
          <h3 className='title-orders'>
            {isFind ? "All bookings by searched buyer" : "All bookings"}
          </h3>
          {bookingsItems.length ? (
            bookingsItems
          ) : (
            <div className='plug-text'>Empty</div>
          )}
        </div>
        <div>
          <h3 className='title-orders'>
            {isFind ? "All orders by searched buyer" : "All orders"}
          </h3>
          {orderListItems.length ? (
            orderListItems
          ) : (
            <div className='plug-text'>Empty</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Find
