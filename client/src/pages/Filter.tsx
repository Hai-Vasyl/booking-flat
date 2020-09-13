import React, { useEffect, useState, useCallback } from "react"
import { useLocation, useHistory } from "react-router-dom"
import axios from "axios"
import { Link } from "react-router-dom"
import { FiShoppingCart } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import {
  ADD_CART_ORDER,
  ADD_CART_BOOKING,
  REMOVE_CART_ORDER,
  REMOVE_CART_BOOKING,
  AddCartBookingPayload,
  AddCartOrderPayload,
} from "../redux/orders/ordersTypes"
import { RootStore } from "../redux/store"

interface TimeRanges {
  bookedStatus: boolean
  eviction: string
  settlement: string
  _id: string
}

interface Data {
  image: string
  _id: string
  price: string
  name: string
  numberRooms: string
  owner: {
    _id: string
    firstname: string
    lastname: string
    ava: string
  }
  timeRanges: TimeRanges[]
  quantity: string
  variant: string
}

interface CompareItem extends Data {
  [key: string]: any
}

interface Form {
  type: string
  pricefrom: string
  priceto: string
  numberRooms: string
  variant: string
  settlement: string
  eviction: string
}

const Filter: React.FC = () => {
  const location = useLocation()
  const history = useHistory()
  const dispatch = useDispatch()
  const {
    orders: { bookings, orderList },
  } = useSelector((state: RootStore) => state)

  const [data, setData] = useState<Data[]>([])
  const [sortType, setSortType] = useState("price")
  const [sortBehaviour, setSortBehaviour] = useState(true)
  const [messageDate, setMessageDate] = useState("")
  const [form, setForm] = useState<Form>({
    type: "",
    pricefrom: "",
    priceto: "",
    numberRooms: "",
    variant: "",
    settlement: "",
    eviction: "",
  })

  useEffect(() => {
    const query: URLSearchParams = new URLSearchParams(location.search)

    const propsQuery = {
      type: query.get("type") || "",
      variant: query.get("variant") || "",
      pricefrom: query.get("pricefrom") || "",
      priceto: query.get("priceto") || "",
      numberRooms: query.get("numberRooms") || "",
      settlement: query.get("settlement") || "",
      eviction: query.get("eviction") || "",
    }

    setForm({ ...propsQuery })

    const fetchData = async () => {
      try {
        const res = await axios({
          url:
            propsQuery.type === "flats"
              ? "/apartments/get-filtered"
              : "/vouchers/get-filtered",
          method: "post",
          data: { ...propsQuery },
        })
        setData(res.data)
      } catch (error) {}
    }
    fetchData()
  }, [location])

  useEffect(() => {
    const compare = (firstItem: CompareItem, secondItem: CompareItem) => {
      const item1 = firstItem[sortType]
      const item2 = secondItem[sortType]
      if (item1 > item2) {
        return sortBehaviour ? 1 : -1
      } else if (item1 < item2) {
        return sortBehaviour ? -1 : 1
      } else {
        return 0
      }
    }

    setData((prevData) => [...prevData].sort(compare))
  }, [sortType, sortBehaviour])

  const handleChangeField = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const pushHistory = (value: string, isType: boolean) => {
    if (isType) {
      return history.push(`/filter?type=${value}`)
    }

    history.push(
      "/filter?type=" +
        form.type +
        (form.pricefrom ? `&pricefrom=${form.pricefrom}` : "") +
        (form.priceto ? `&priceto=${form.priceto}` : "") +
        (form.numberRooms ? `&numberRooms=${form.numberRooms}` : "") +
        (value && !isType
          ? value === "all"
            ? ""
            : `&variant=${value}`
          : form.variant
          ? `&variant=${form.variant}`
          : "") +
        (form.settlement ? `&settlement=${form.settlement}` : "") +
        (form.eviction ? `&eviction=${form.eviction}` : "")
    )
  }

  const handleSubmitSort = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    pushHistory("", false)
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target

    pushHistory(value, name === "type")
  }

  const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (new Date(event.target.value) <= new Date()) {
      return setMessageDate(`Wrong ${[event.target.name]} date!`)
    } else {
      setMessageDate("")
    }

    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const isIncudeInOrders = (id: string, timeId?: string) => {
    let isInclude = false

    if (form.type === "flats") {
      bookings.forEach((item) => {
        if (item._id === id && item.time._id === timeId) {
          isInclude = true
        }
      })
    } else {
      orderList.forEach((item) => {
        if (item._id === id) {
          isInclude = true
        }
      })
    }

    return isInclude
  }

  const handleChangeSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(event.target.value)
  }

  const handleChangeSortType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortBehaviour(!sortBehaviour)
  }

  const handleOrder = (
    itemData: AddCartOrderPayload | AddCartBookingPayload,
    dateId?: string
  ) => {
    const isFlatsType = form.type === "flats"
    const isInclude = isIncudeInOrders(itemData._id, dateId)

    if (isInclude) {
      dispatch({
        type: isFlatsType ? REMOVE_CART_BOOKING : REMOVE_CART_ORDER,
        payload: itemData._id,
      })
    } else {
      dispatch({
        type: isFlatsType ? ADD_CART_BOOKING : ADD_CART_ORDER,
        payload: { ...itemData },
      })
    }
  }

  const flats = data.map((item) => {
    return (
      <div key={item._id} className='flat-item'>
        <Link
          to={`/details/flat/${item._id}`}
          className='flat-item__image-side'
        >
          <img className='flat-item__image' src={item.image} alt='flatImg' />
          <span className='flat-item__price'>
            {item.price}
            <span className='flat-item__grivna-sign'>&#8372;</span>
          </span>
        </Link>
        <div className='flat-item__info'>
          <Link to={`/details/flat/${item._id}`} className='flat-item__title'>
            {item.name}
          </Link>
          <p className='flat-item__paragraph'>
            Number of rooms: {item.numberRooms}
          </p>
          <Link to={`/user/${item.owner._id}`} className='flat-item__owner'>
            <div className='flat-item__avatar'>
              <img
                className='flat-item__img-ava'
                src={item.owner.ava}
                alt='userAva'
              />
            </div>
            <div className='flat-item__fullname'>
              <span className='flat-item__firstname'>
                {item.owner.firstname}
              </span>
              <span className='flat-item__lastname'>{item.owner.lastname}</span>
            </div>
          </Link>
        </div>
        <div className='flat-item__date-slots'>
          {item.timeRanges &&
            item.timeRanges.map((elem) => {
              return (
                <button
                  key={elem._id}
                  className={`flat-item__slot ${
                    elem.bookedStatus
                      ? "flat-item__slot--booked"
                      : isIncudeInOrders(item._id, elem._id) &&
                        "flat-item__slot--ordered"
                  }`}
                  onClick={
                    elem.bookedStatus
                      ? () => {}
                      : () =>
                          handleOrder(
                            {
                              image: item.image,
                              name: item.name,
                              numberRooms: item.numberRooms,
                              price: item.price,
                              time: {
                                _id: elem._id,
                                settlement: elem.settlement,
                                eviction: elem.eviction,
                              },
                              _id: item._id,
                            },
                            elem._id
                          )
                  }
                >
                  <span className='flat-item__settlement'>
                    {elem.settlement.slice(0, 10)}
                  </span>
                  -
                  <span className='flat-item__eviction'>
                    {elem.eviction.slice(0, 10)}
                  </span>
                </button>
              )
            })}
        </div>
      </div>
    )
  })

  const vouchers = data.map((item) => {
    return (
      <div className='voucher-item flat-item' key={item._id}>
        <Link
          to={`/details/voucher/${item._id}`}
          className='voucher-item__image-side flat-item__image-side'
        >
          <img
            className='voucher-item__image flat-item__image'
            src={item.image}
            alt='flatImg'
          />
        </Link>
        <div className='voucher-item__info flat-item__info'>
          <Link
            to={`/details/voucher/${item._id}`}
            className='flat-item__title'
          >
            {item.name}
          </Link>
          <p className='voucher-item__paragraph flat-item__paragraph'>
            <span className='voucher-item__field'>Price: {item.price}</span>
            <span className='voucher-item__field'>
              Quantity: {item.quantity}
            </span>
            <span className='voucher-item__field'>Variant: {item.variant}</span>
          </p>
        </div>
        <div className='voucher-item__order'>
          <button
            className={`voucher-item__btn btn btn-simple ${
              isIncudeInOrders(item._id) && "voucher-item__btn--active"
            }`}
            onClick={() =>
              handleOrder({
                image: item.image,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                variant: item.variant,
                _id: item._id,
              })
            }
          >
            <FiShoppingCart className='btn__icon' />
            <span className='btn__name'>Order</span>
          </button>
        </div>
      </div>
    )
  })

  return (
    <div className='wrapper'>
      <div className='sort-panel'>
        <div className='sort-panel__block'>
          <span className='sort-panel__title'>Type:</span>
          <form>
            <label className='sort-panel__label-radio'>
              <input
                type='radio'
                name='type'
                value='flats'
                onChange={handleChange}
                className='sort-panel__radio'
                checked={form.type === "flats" ? true : false}
              />
              <span className='sort-panel__name'>Apartments</span>
            </label>
            <label className='sort-panel__label-radio'>
              <input
                type='radio'
                name='type'
                value='vouchers'
                className='sort-panel__radio'
                onChange={handleChange}
                checked={form.type === "vouchers" ? true : false}
              />
              <span className='sort-panel__name'>Vouchers</span>
            </label>
          </form>
        </div>
        <div className='sort-panel__block'>
          <span className='sort-panel__title'>Price:</span>
          <form className='sort-panel__form' onSubmit={handleSubmitSort}>
            <input
              type='text'
              name='pricefrom'
              value={form.pricefrom}
              className='sort-panel__input'
              onChange={handleChangeField}
            />
            <input
              type='text'
              name='priceto'
              className='sort-panel__input'
              value={form.priceto}
              onChange={handleChangeField}
            />
            <button className='sort-panel__btn'>Submit</button>
          </form>
        </div>
        {form.type === "flats" && (
          <>
            <div className='sort-panel__block'>
              <span className='sort-panel__title'>Date:</span>
              <form className='sort-panel__form' onSubmit={handleSubmitSort}>
                <input
                  type='date'
                  name='settlement'
                  className='sort-panel__input'
                  value={form.settlement}
                  onChange={handleChangeDate}
                />
                <input
                  type='date'
                  name='eviction'
                  className='sort-panel__input'
                  value={form.eviction}
                  onChange={handleChangeDate}
                />
                <button className='sort-panel__btn'>Submit</button>
              </form>
              <span>{messageDate}</span>
            </div>
            <div className='sort-panel__block'>
              <span className='sort-panel__title'>Nuber of rooms:</span>
              <form className='sort-panel__form' onSubmit={handleSubmitSort}>
                <input
                  type='text'
                  value={form.numberRooms}
                  className='sort-panel__input'
                  name='numberRooms'
                  onChange={handleChangeField}
                />
                <button className='sort-panel__btn'>Submit</button>
              </form>
            </div>
          </>
        )}
        {form.type === "vouchers" && (
          <div className='sort-panel__block'>
            <span className='sort-panel__title'>Variant:</span>
            <select
              className='sort-panel__btn sort-panel__select'
              value={form.variant}
              name='variant'
              onChange={handleChange}
            >
              <option className='sort-panel__option' value='all'>
                All
              </option>
              <option className='sort-panel__option' value='restaurant'>
                Restaurant
              </option>
              <option className='sort-panel__option' value='club'>
                Club
              </option>
              <option className='sort-panel__option' value='museum'>
                Museum
              </option>
              <option className='sort-panel__option' value='cinema'>
                Cinema
              </option>
            </select>
          </div>
        )}
        <div className='sort-panel__block'>
          <span className='sort-panel__title'>Sort by:</span>
          <form>
            <label className='sort-panel__label-radio'>
              <input
                type='radio'
                onChange={handleChangeSortType}
                className='sort-panel__radio'
                checked={sortBehaviour}
              />
              <span className='sort-panel__name'>Ascending</span>
            </label>
            <label className='sort-panel__label-radio'>
              <input
                type='radio'
                onChange={handleChangeSortType}
                className='sort-panel__radio'
                checked={!sortBehaviour}
              />
              <span className='sort-panel__name'>Descending</span>
            </label>
          </form>
          <select
            value={sortType}
            onChange={handleChangeSort}
            className='sort-panel__btn sort-panel__select'
          >
            {form.type === "flats" && (
              <option value='numberRooms' className='sort-panel__option'>
                Number of rooms
              </option>
            )}
            <option value='price' className='sort-panel__option'>
              Price
            </option>
            {form.type === "vouchers" && (
              <>
                <option value='quantity' className='sort-panel__option'>
                  Quantity
                </option>
                <option value='variant' className='sort-panel__option'>
                  Variant
                </option>
              </>
            )}
          </select>
        </div>
      </div>
      <div className='filtered-items'>
        {form.type === "flats" ? flats : vouchers}
      </div>
    </div>
  )
}

export default Filter
