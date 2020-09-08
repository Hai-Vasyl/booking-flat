import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { Link } from "react-router-dom"

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
}

const Filter: React.FC = () => {
  const location = useLocation()

  const [data, setData] = useState<Data[]>([])

  useEffect(() => {
    const query = new URLSearchParams(location.search)

    const fetchData = async () => {
      try {
        const propsQuery = {
          type: query.get("type"),
          variant: query.get("variant"),
          price: query.get("price"),
          numberRooms: query.get("numberRooms"),
          settlement: query.get("settlement"),
          eviction: query.get("eviction"),
        }

        const res = await axios({
          url:
            propsQuery.type === "flats"
              ? "/apartments/get-filtered"
              : "/vouchers/get-filtered",
          method: "post",
          data: { ...propsQuery },
        })

        console.log(res.data)
        setData(res.data)
      } catch (error) {}
    }

    fetchData()
  }, [location])

  const handleOrder = () => {}

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
          {item.timeRanges.map((item) => {
            return (
              <button
                key={item._id}
                className={`flat-item__slot ${
                  item.bookedStatus && "flat-item__slot--booked"
                }`}
                onClick={item.bookedStatus ? () => {} : handleOrder}
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
    )
  })

  return (
    <div className='wrapper'>
      <div className='filtered-items'>{flats}</div>
    </div>
  )
}

export default Filter
