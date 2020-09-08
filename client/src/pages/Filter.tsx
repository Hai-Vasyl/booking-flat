import React, { useEffect, useState } from "react"
import { useLocation, useHistory } from "react-router-dom"
import axios from "axios"
import { Link } from "react-router-dom"
import { FiShoppingCart } from "react-icons/fi"

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

interface Form {
  type: string
  pricefrom: string
  priceto: string
  numberRooms: string
  variant: string
}

const Filter: React.FC = () => {
  const location = useLocation()
  const history = useHistory()

  const [data, setData] = useState<Data[]>([])
  const [type, setType] = useState<string | null>()
  const [form, setForm] = useState<Form>({
    type: "flats",
    pricefrom: "",
    priceto: "",
    numberRooms: "",
    variant: "",
  })

  const [formDate, setFormDate] = useState({
    settlement: "",
    eviction: "",
  })

  useEffect(() => {
    const query: URLSearchParams = new URLSearchParams(location.search)

    setType(query.get("type"))

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

        console.log(res.data)
        setData(res.data)
      } catch (error) {}
    }

    fetchData()
  }, [location])

  const handleOrder = () => {}
  const handleChangeField = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const pushHistory = () => {
    return history.push(
      "/filter?type=" + form.type + form.pricefrom
        ? `&pricefrom=${form.pricefrom}`
        : "" + form.priceto
        ? `&priceto=${form.priceto}`
        : "" + form.numberRooms
        ? `&numberRooms=${form.numberRooms}`
        : "" + form.variant
        ? `&variant=${form.variant}`
        : "" + formDate.settlement
        ? `&settlement=${formDate.settlement}`
        : "" + formDate.eviction
        ? `&eviction=${formDate.eviction}`
        : ""
    )
  }

  const handleSubmitSort = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(form)
    // history.push("/filter")
    history.push(
      "/filter?type=" +
        form.type +
        (form.pricefrom ? `&pricefrom=${form.pricefrom}` : "") +
        (form.priceto ? `&priceto=${form.priceto}` : "") +
        (form.numberRooms ? `&numberRooms=${form.numberRooms}` : "") +
        (form.variant ? `&variant=${form.variant}` : "") +
        (formDate.settlement ? `&settlement=${formDate.settlement}` : "") +
        (formDate.eviction ? `&eviction=${formDate.eviction}` : "")
    )
    // pushHistory()
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value })

    pushHistory()
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
            item.timeRanges.map((item) => {
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
          <button className='btn btn-simple'>
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
          <span>Type:</span>
          <form>
            <input
              type='radio'
              name='type'
              value='flats'
              onChange={handleChange}
              checked={form.type === "flats" ? true : false}
            />
            Apartments
            <br />
            <input
              type='radio'
              name='type'
              value='vouchers'
              onChange={handleChange}
              checked={form.type === "vouchers" ? true : false}
            />
            Vouchers
            <br />
          </form>
        </div>
        <div className='sort-panel__block'>
          <span>Price</span>
          <form onSubmit={handleSubmitSort}>
            <input
              type='text'
              name='pricefrom'
              value={form.pricefrom}
              onChange={handleChangeField}
            />
            <input
              type='text'
              name='priceto'
              value={form.priceto}
              onChange={handleChangeField}
            />
            <button>Submit</button>
          </form>
        </div>
        <div className='sort-panel__block'>
          {/* <span>Date</span>
          <form>
            <input type="date" name="settlement" value="" onChange={handleChangeDate} />
            <input type="date" name="eviction"  onChange={handleChangeDate}/>
            </form> */}
        </div>
        <div className='sort-panel__block'></div>
        <div className='sort-panel__block'></div>
      </div>
      <div className='filtered-items'>
        {type === "flats" ? flats : vouchers}
      </div>
    </div>
  )
}

export default Filter
