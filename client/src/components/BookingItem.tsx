import React from "react"
import { Booking } from "../interfaces"
import { Link } from "react-router-dom"

const BookingItem: React.FC<Booking> = ({
  _id,
  apartment,
  name,
  numberRooms,
  price,
  settlement,
  eviction,
  firstname,
  lastname,
  email,
}) => {
  return (
    <div key={_id} className='booking-item'>
      <Link
        to={`/details/flat/${apartment._id}`}
        className='booking-item__container-img'
      >
        <img
          className='booking-item__img'
          src={apartment.image}
          alt='orderImg'
        />
      </Link>
      <div className='booking-item__info'>
        <Link
          className='booking-item__name'
          to={`/details/flat/${apartment._id}`}
        >
          {name}
        </Link>
        <p className='booking-item__paragraph'>
          <span className='booking-item__numberRooms'>
            Number of rooms: {numberRooms}
          </span>
          <span className='booking-item__price'>Price: {price}</span>
          <span className='booking-item__date'>
            <span className='booking-item__settlement'>
              Settlement: {settlement.slice(0, 10)}
            </span>
            <span className='booking-item__eviction'>
              Eviction: {eviction.slice(0, 10)}
            </span>
          </span>
          <span>
            Full name: {firstname} {lastname} {`<${email}>`}
          </span>
        </p>
      </div>
    </div>
  )
}

export default BookingItem
