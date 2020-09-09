import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootStore } from "../redux/store"
import { Link, useHistory } from "react-router-dom"
import { BsX, BsArrowRight, BsPlus } from "react-icons/bs"
import { AiOutlineWarning } from "react-icons/ai"
import {
  CHANGE_QUANTITY_ORDERS,
  REMOVE_CART_ORDER,
  REMOVE_CART_BOOKING,
  AddCartBookingPayload,
  AddCartOrderPayload,
  RESET_ORDERS,
} from "../redux/orders/ordersTypes"
import { TOGGLE_POPUP_MENU } from "../redux/menu/menuTypes"
import axios from "axios"

const OrderBookings = () => {
  const {
    orders: { bookings, orderList },
    menu: { popup },
  } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()
  const history = useHistory()
  const [generalPrice, setGeneralPrice] = useState(0)
  const [form, setForm] = useState([
    {
      param: "firstname",
      name: "First name",
      msg: "",
      type: "text",
      value: "",
    },
    { param: "lastname", name: "Last name", msg: "", type: "text", value: "" },
    { param: "email", name: "Email", msg: "", type: "email", value: "" },
  ])

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(
      form.map((item) => {
        if (item.param === event.target.name) {
          return { ...item, value: event.target.value, msg: "" }
        }
        return item
      })
    )
  }

  const handleSubmit = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      event.preventDefault()

      let isEmptyFields = false
      setForm(
        form.map((item) => {
          if (!item.value) {
            isEmptyFields = true
            return { ...item, msg: "Fill in this field!" }
          }
          return item
        })
      )

      if (isEmptyFields) {
        return
      }

      const [firstname, lastname, email] = form

      const buyer = {
        firstname: firstname.value,
        lastname: lastname.value,
        email: email.value,
      }

      const bookingsNew = bookings.map((item) => {
        return {
          apartment: item._id,
          name: item.name,
          numberRooms: item.numberRooms,
          price: item.price,
          timeRange: item.time._id,
          settlement: item.time.settlement,
          eviction: item.time.eviction,
          ...buyer,
        }
      })

      const orderListNew = orderList.map((item) => {
        return {
          voucher: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          variant: item.variant,
          ...buyer,
        }
      })

      await axios({
        url: "/orders/create",
        method: "post",
        data: { bookings: bookingsNew, orderList: orderListNew },
      })

      dispatch({ type: TOGGLE_POPUP_MENU })
      dispatch({ type: RESET_ORDERS })
      history.push("/filter?type=flats")
    } catch (error) {}
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

  const fields = form.map((item) => {
    return (
      <label key={item.param} className='field'>
        <span className='field__name'>{item.name}</span>
        <input
          type={item.type}
          value={item.value}
          className={`field__input ${item.msg && "field__input--error"}`}
          onChange={handleChange}
          name={item.param}
          autoComplete='off'
        />
        <span className={`error ${item.msg && "error--active"}`}>
          <AiOutlineWarning className='error__icon' />
          <span className='error__name'>{item.msg}</span>
        </span>
      </label>
    )
  })

  const formPurchase = (
    <div className={`purchase-form ${popup && "purchase-form--open"}`}>
      <h3 className='purchase-form__title'>Purchase orders</h3>
      <form onSubmit={handleSubmit}>
        {fields}
        <button className='btn-handler'></button>
        <span>Total price: {generalPrice}</span>
      </form>
      <div className='purchase-form__btns'>
        <button className='btn btn-primary' onClick={handleSubmit}>
          <BsPlus className='btn__icon' />
          <span className='btn__name'>Buy/Book</span>
        </button>
        <button
          className='btn btn-simple'
          onClick={() => dispatch({ type: TOGGLE_POPUP_MENU })}
        >
          <BsX className='btn__icon' />
          <span className='btn__name'>Cancel</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className='wrapper'>
      <div className='ordered-items'>
        <div className='title-orders'>All bookings</div>
        {bookingsItems.length ? (
          bookingsItems
        ) : (
          <div className='plug-text'>Empty</div>
        )}
        <div className='title-orders'>Order list</div>
        {orderListItems.length ? (
          orderListItems
        ) : (
          <div className='plug-text'>Empty</div>
        )}
        {formPurchase}
        {(!!bookings.length || !!orderList.length) && (
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
        )}
      </div>
    </div>
  )
}

export default OrderBookings
