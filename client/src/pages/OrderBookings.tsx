import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootStore } from "../redux/store"
import { Link } from "react-router-dom"
import { BsX, BsArrowRight } from "react-icons/bs"
import {
  CHANGE_QUANTITY_ORDERS,
  REMOVE_CART_ORDER,
  REMOVE_CART_BOOKING,
  AddCartBookingPayload,
  AddCartOrderPayload,
} from "../redux/orders/ordersTypes"
import { TOGGLE_POPUP_MENU } from "../redux/menu/menuTypes"

const OrderBookings = () => {
  const {
    orders: { bookings, orderList },
    menu: { popup },
  } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()
  const [generalPrice, setGeneralPrice] = useState(0)

  console.log(bookings, orderList)

  useEffect(() => {
    setGeneralPrice(
      CountPriceByOrders(bookings) + CountPriceByOrders(orderList)
    )
  }, [bookings, orderList])

  const CountPriceByOrders = (
    orders: AddCartOrderPayload[] | AddCartBookingPayload[]
  ) => {
    let generalPrice: number = 0

    orders.forEach((item: AddCartOrderPayload | AddCartBookingPayload) => {
      generalPrice += +item.price
    })

    return generalPrice
  }

  const handleChangeQuantity = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const { value } = event.target
    dispatch({
      type: CHANGE_QUANTITY_ORDERS,
      payload: { value, id },
    })
  }

  const bookingsItems = bookings.map((item) => {
    return (
      <div key={item._id} className='booking-item'>
        <Link
          to={`/details/flat/${item._id}`}
          className='booking-item__container-img'
        >
          <img className='booking-item__img' src={item.image} alt='orderImg' />
        </Link>
        <div className='booking-item__info'>
          <Link className='booking-item__name' to={`/details/flat/${item._id}`}>
            {item.name}
          </Link>
          <p className='booking-item__paragraph'>
            <span className='booking-item__numberRooms'>
              Number of rooms: {item.numberRooms}
            </span>
            <span className='booking-item__price'>Price: {item.price}</span>
            <span className='booking-item__date'>
              <span className='booking-item__settlement'>
                Settlement: {item.time.settlement.slice(0, 10)}
              </span>
              <span className='booking-item__eviction'>
                Eviction: {item.time.eviction.slice(0, 10)}
              </span>
            </span>
          </p>
        </div>
        <div className='booking-item__btn-container'>
          <button
            className='booking-item__btn btn btn-simple'
            onClick={() =>
              dispatch({ type: REMOVE_CART_BOOKING, payload: item._id })
            }
          >
            <BsX />
          </button>
        </div>
      </div>
    )
  })

  const orderListItems = orderList.map((item) => {
    return (
      <div key={item._id} className='order-item booking-item'>
        <Link
          to={`/details/voucher/${item._id}`}
          className='order-item__container-img booking-item__container-img'
        >
          <img
            className='order-item__img booking-item__img'
            src={item.image}
            alt='orderImg'
          />
        </Link>
        <div className='booking-item__info'>
          <Link
            className='booking-item__name'
            to={`/details/voucher/${item._id}`}
          >
            {item.name}
          </Link>
          <p className='booking-item__paragraph'>
            <span>Variant: {item.variant}</span>
            <span>Price: {item.price}</span>
            <span className='order-item__quantity'>
              Quantity:
              <input
                className='order-item__quantity-input'
                value={item.quantity}
                type='text'
                onChange={(event) => handleChangeQuantity(event, item._id)}
              />
            </span>
          </p>
        </div>
        <div className='booking-item__btn-container'>
          <button
            className='booking-item__btn btn btn-simple'
            onClick={() =>
              dispatch({ type: REMOVE_CART_ORDER, payload: item._id })
            }
          >
            <BsX />
          </button>
        </div>
      </div>
    )
  })

  return (
    <div className='wrapper'>
      <div className='ordered-items'>
        <div className='title-orders'>All bookings</div>
        {bookingsItems}
        <div className='title-orders'>Order list</div>
        {orderListItems}
        <div className='purchase'>
          <div className='purchase__label'>
            General price:
            <span className='purchase__price'>{generalPrice}</span>
          </div>
          <div className='purchase__container-btn'>
            <button
              className='purchase__btn btn btn-primary'
              onClick={() => dispatch({ type: TOGGLE_POPUP_MENU })}
            >
              <span className='btn__name'>Purchase</span>
              <BsArrowRight className='btn__icon' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderBookings
