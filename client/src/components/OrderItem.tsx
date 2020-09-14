import React from "react"
import { Order } from "../interfaces"
import { Link } from "react-router-dom"

const OrderItem: React.FC<Order> = ({
  _id,
  voucher,
  name,
  variant,
  price,
  quantity,
  firstname,
  lastname,
  email,
}) => {
  return (
    <div className='order-item booking-item'>
      <Link
        to={`/details/voucher/${voucher._id}`}
        className='order-item__container-img booking-item__container-img'
      >
        <img
          className='order-item__img booking-item__img'
          src={voucher.image}
          alt='orderImg'
        />
      </Link>
      <div className='booking-item__info'>
        <Link
          className='booking-item__name'
          to={`/details/voucher/${voucher._id}`}
        >
          {name}
        </Link>
        <p className='booking-item__paragraph'>
          <span>Variant: {variant}</span>
          <span>Price: {price}</span>
          <span>Quantity: {quantity}</span>
          <span>
            Full name: {firstname} {lastname} {`<${email}>`}
          </span>
        </p>
      </div>
    </div>
  )
}

export default OrderItem
