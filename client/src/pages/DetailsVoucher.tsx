import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux"
import { RootStore } from "../redux/store"
import { Link } from "react-router-dom"
import {
  AddCartOrderPayload,
  ADD_CART_ORDER,
  REMOVE_CART_ORDER,
} from "../redux/orders/ordersTypes"
import { FiShoppingCart } from "react-icons/fi"
import { BsPencilSquare } from "react-icons/bs"

interface PropsParams {
  voucherId: string
}

interface DataProps {
  apartment: {
    image: string
    name: string
    numberRooms: number
    price: number
    _id: string
  }
  description: string
  image: string
  name: string
  owner: {
    ava: string
    firstname: string
    lastname: string
    _id: string
  }
  price: string
  quantity: string
  variant: string
  _id: string
}

const DetailsVoucher = () => {
  const [data, setData] = useState<DataProps>({
    apartment: {
      image: "",
      name: "",
      numberRooms: 0,
      price: 0,
      _id: "",
    },
    description: "",
    image: "",
    name: "",
    owner: {
      ava: "",
      firstname: "",
      lastname: "",
      _id: "",
    },
    price: "",
    quantity: "0",
    variant: "",
    _id: "",
  })
  const { voucherId } = useParams<PropsParams>()
  const {
    orders: { orderList },
    auth: { userData },
  } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios({
          url: `/vouchers/get-details/${voucherId}`,
          method: "get",
          data: null,
        })

        setData(res.data)
      } catch (error) {}
    }

    fetchData()
  }, [voucherId])

  const isIncudeInOrders = () => {
    let isInclude = false
    orderList.forEach((item) => {
      if (item._id === voucherId) {
        isInclude = true
      }
    })
    return isInclude
  }

  const handleOrder = (isInclude: boolean, itemData: AddCartOrderPayload) => {
    if (isInclude) {
      dispatch({
        type: REMOVE_CART_ORDER,
        payload: itemData._id,
      })
    } else {
      dispatch({
        type: ADD_CART_ORDER,
        payload: { ...itemData },
      })
    }
  }

  const isInclude = isIncudeInOrders()

  return (
    <div className='wrapper'>
      <div className='voucher'>
        <div className='voucher__left-side'>
          <div className='voucher__container-img'>
            <img className='voucher__img' src={data.image} alt='voucherImg' />
          </div>
          <Link
            className='flat-link'
            to={`/details/flat/${data.apartment._id}`}
          >
            <span className='flat-link__container-img'>
              <img
                className='flat-link__img'
                src={data.apartment.image}
                alt='flatImg'
              />
            </span>
            <span className='flat-link__info'>
              <span className='flat-link__name'>{data.apartment.name}</span>
              <span className='flat-link__field'>
                Price: {data.apartment.price}
              </span>
              <span className='flat-link__field'>
                Number of rooms: {data.apartment.numberRooms}
              </span>
            </span>
          </Link>
          {userData.user && userData.user._id === data.owner._id && (
            <Link to={`/edit-voucher/${voucherId}`} className='btn btn-primary'>
              <BsPencilSquare className='btn__icon' />
              <span className='btn__name'>Edit voucher</span>
            </Link>
          )}
        </div>

        <div className='voucher__right-side'>
          <h3 className='voucher__name'>{data.name}</h3>
          <span className='voucher__info'>
            <span className='voucher__field'>Price:</span> {data.price}
          </span>
          <span className='voucher__info voucher__paragraph'>
            <span className='voucher__field'>Description:</span>
            {data.description}
          </span>
          <span className='voucher__info'>
            <span className='voucher__field'>Variant:</span> {data.variant}
          </span>
          <span className='voucher__info'>
            <span className='voucher__field'>Quantity:</span> {data.quantity}
          </span>
          <Link to={`/user/${data.owner._id}`} className='flat__owner'>
            <div className='flat__avatar'>
              <img
                className='flat__ava-img'
                src={data.owner.ava}
                alt='userAva'
              />
            </div>
            <div className='flat__fullname'>
              <span className='flat__firstname'>{data.owner.firstname}</span>
              <span className='flat__lastname'>{data.owner.lastname}</span>
            </div>
          </Link>
          <button
            className={`voucher-item__btn btn btn-simple ${
              isInclude && "voucher-item__btn--active"
            }`}
            onClick={() =>
              handleOrder(isInclude, {
                image: data.image,
                name: data.name,
                price: data.price,
                quantity: data.quantity,
                variant: data.variant,
                _id: data._id,
              })
            }
          >
            <FiShoppingCart className='btn__icon' />
            <span className='btn__name'>Order</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DetailsVoucher
