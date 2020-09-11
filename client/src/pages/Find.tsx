import React, { useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { RootStore } from "../redux/store"
import { Link } from "react-router-dom"
import { AiOutlineSearch } from "react-icons/ai"

interface Order {
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

interface Booking {
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

interface DataProps {
  orders: Order[]
  bookings: Booking[]
}

const Find = () => {
  const [data, setData] = useState<DataProps>({ orders: [], bookings: [] })
  const [form, setForm] = useState<string>("")
  const {
    auth: { userData },
  } = useSelector((state: RootStore) => state)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios({
          url: "/orders/get-orders",
          method: "post",
          data: { searchedText: form },
          headers: userData && {
            Authorization: `Basic ${userData.token}`,
          },
        })

        setData(res.data)
      } catch (error) {}
    }

    fetchData()
  }, [form, userData])

  const bookingsItems = data.bookings.map((item) => {
    return (
      <div key={item._id} className='booking-item'>
        <Link
          to={`/details/flat/${item.apartment._id}`}
          className='booking-item__container-img'
        >
          <img
            className='booking-item__img'
            src={item.apartment.image}
            alt='orderImg'
          />
        </Link>
        <div className='booking-item__info'>
          <Link
            className='booking-item__name'
            to={`/details/flat/${item.apartment._id}`}
          >
            {item.name}
          </Link>
          <p className='booking-item__paragraph'>
            <span className='booking-item__numberRooms'>
              Number of rooms: {item.numberRooms}
            </span>
            <span className='booking-item__price'>Price: {item.price}</span>
            <span className='booking-item__date'>
              <span className='booking-item__settlement'>
                Settlement: {item.settlement.slice(0, 10)}
              </span>
              <span className='booking-item__eviction'>
                Eviction: {item.eviction.slice(0, 10)}
              </span>
            </span>
            <span>
              Full name: {item.firstname} {item.lastname} {`<${item.email}>`}
            </span>
          </p>
        </div>
      </div>
    )
  })

  const orderListItems = data.orders.map((item) => {
    return (
      <div key={item._id} className='order-item booking-item'>
        <Link
          to={`/details/voucher/${item.voucher._id}`}
          className='order-item__container-img booking-item__container-img'
        >
          <img
            className='order-item__img booking-item__img'
            src={item.voucher.image}
            alt='orderImg'
          />
        </Link>
        <div className='booking-item__info'>
          <Link
            className='booking-item__name'
            to={`/details/voucher/${item.voucher._id}`}
          >
            {item.name}
          </Link>
          <p className='booking-item__paragraph'>
            <span>Variant: {item.variant}</span>
            <span>Price: {item.price}</span>
            <span>Quantity: {item.quantity}</span>
            <span>
              Full name: {item.firstname} {item.lastname} {`<${item.email}>`}
            </span>
          </p>
        </div>
      </div>
    )
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(event.target.value)
  }

  return (
    <div className='wrapper'>
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

      <div className='found-items'>
        <div>
          <h3 className='title-orders'>All bookings by searched buyer</h3>
          {bookingsItems.length ? (
            bookingsItems
          ) : (
            <div className='plug-text'>Empty</div>
          )}
        </div>
        <div>
          <h3 className='title-orders'>All orders by searched buyer</h3>
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
