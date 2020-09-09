import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux"
import { RootStore } from "../redux/store"
import {
  AddCartBookingPayload,
  REMOVE_CART_BOOKING,
  ADD_CART_BOOKING,
} from "../redux/orders/ordersTypes"

interface PropsParams {
  flatId: string
}

interface TimeRange {
  bookedStatus: boolean
  eviction: string
  settlement: string
  _id: string
}

interface Voucher {
  image: string
  name: string
  variant: string
  _id: string
  price: number
}

interface DataProps {
  image: string
  _id: string
  description: string
  name: string
  numberRooms: string
  owner: {
    ava: string
    firstname: string
    lastname: string
    _id: string
  }
  price: string
  timeRanges: TimeRange[]
  vouchers: Voucher[]
}

interface IndexOrder {
  index: number
  isInclude: boolean
}

const DetailsFlat = () => {
  const [data, setData] = useState<DataProps>({
    image: "",
    _id: "",
    description: "",
    name: "",
    numberRooms: "0",
    owner: {
      ava: "",
      firstname: "",
      lastname: "",
      _id: "",
    },
    price: "0",
    timeRanges: [],
    vouchers: [],
  })
  const { flatId } = useParams<PropsParams>()
  const {
    orders: { bookings },
  } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()
  const [indexOrder, setIndexOrder] = useState<IndexOrder>({
    index: 0,
    isInclude: false,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios({
          url: `/apartments/get-details/${flatId}`,
          method: "get",
          data: null,
        })

        console.log(res.data)
        setData(res.data)
      } catch (error) {}
    }

    fetchData()
  }, [flatId])

  useEffect(() => {
    let indexItem = { index: 0, isInclude: false }
    bookings.forEach((item, index) => {
      if (item._id === flatId) {
        indexItem = { index, isInclude: true }
      }
    })

    setIndexOrder(indexItem)
  }, [bookings, flatId])

  const isIncudeInOrders = (id: string) => {
    const { isInclude, index } = indexOrder

    return isInclude && bookings[index] && bookings[index].time._id === id
  }

  const handleOrder = (isInclude: boolean, itemData: AddCartBookingPayload) => {
    if (isInclude) {
      dispatch({
        type: REMOVE_CART_BOOKING,
        payload: itemData._id,
      })
    } else {
      dispatch({
        type: ADD_CART_BOOKING,
        payload: { ...itemData },
      })
    }
  }

  return (
    <div className='wrapper'>
      <div className='flat'>
        <div className='flat__left-side'>
          <div className='flat__container-img'>
            <img className='flat__img' src={data.image} alt='flatImg' />
          </div>
          <div className='flat__container-slots'>
            {data.timeRanges.map((item) => {
              const isInclude = isIncudeInOrders(item._id)
              return (
                <button
                  key={item._id}
                  className={`flat-item__slot ${
                    item.bookedStatus
                      ? "flat-item__slot--booked"
                      : isInclude && "flat-item__slot--ordered"
                  }`}
                  onClick={
                    item.bookedStatus
                      ? () => {}
                      : () =>
                          handleOrder(isInclude, {
                            image: data.image,
                            numberRooms: data.numberRooms,
                            price: data.price,
                            _id: data._id,
                            name: data.name,
                            time: {
                              _id: item._id,
                              settlement: item.settlement,
                              eviction: item.eviction,
                            },
                          })
                  }
                >
                  <span className='flat-item__settlement'>
                    {item.settlement.slice(0, 10)}
                  </span>
                  -
                  <span className='flat-item__eviction'>
                    {item.eviction.slice(0, 10)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className='flat__right-side'>
          <div>
            <h3 className='flat__name'>{data.name}</h3>
            <div>
              <span className='flat__info-item'>Price: {data.price}</span>
              <p>
                <span>Description:</span>
                {data.description}
              </p>
              <span className='flat__info-item'>
                Number of rooms: {data.numberRooms}
              </span>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  )
}

export default DetailsFlat
