import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { BsCheck, BsGear, BsPencilSquare, BsX } from "react-icons/bs"
import { Link } from "react-router-dom"
import { AiOutlineWarning } from "react-icons/ai"

interface UserParam {
  userId: string
}

interface ItemLink {
  image: string
  _id: string
  name: string
}

interface Apartment extends ItemLink {
  vouchers: ItemLink[]
}

interface User {
  ava: string
  date: string
  email: string
  firstname: string
  lastname: string
  typeUser: string
  _id: string
}

interface DataProps {
  apartments: Apartment[]
  user: User
}

const User = () => {
  const [data, setData] = useState<DataProps>({
    apartments: [],
    user: {
      ava: "",
      date: "",
      email: "",
      firstname: "",
      lastname: "",
      _id: "",
      typeUser: "",
    },
  })
  const { userId } = useParams<UserParam>()
  const [form, setForm] = useState([
    {
      param: "firstname",
      msg: "",
      value: "",
      name: "First name",
      type: "text",
    },
    { param: "lastname", msg: "", value: "", name: "Last name", type: "text" },
    {
      param: "email",
      msg: "",
      value: "",
      name: "Email address",
      type: "email",
    },
  ])

  const [image, setImage] = useState("")
  const [flipPage, setFlipPage] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios({
          url: `/auth/user-details-get/${userId}`,
          method: "get",
          data: null,
        })

        console.log(res.data)
        setData(res.data)
      } catch (error) {}
    }

    fetchData()
  }, [userId])

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImage(event.target.value)
  }

  const handleSubmitImage = (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault()
      console.log(image)
    } catch (error) {}
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setForm(
      form.map((item) => {
        if (item.param === name) {
          return { ...item, value, msg: "" }
        }
        return item
      })
    )
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault()
      console.log(form)
    } catch (error) {}
  }

  const fields = form.map((item) => {
    return (
      <label key={item.param} className='field'>
        <span className='field__name'>{item.name}</span>
        <input
          className={`field__input ${item.msg && "field__input--error"}`}
          type={item.type}
          value={item.value}
          onChange={handleChange}
          autoComplete='off'
          name={item.param}
        />
        <span className={`error ${item.msg && "error--active"}`}>
          <AiOutlineWarning className='error__icon' />
          <span className='error__name'>{item.msg}</span>
        </span>
      </label>
    )
  })

  return (
    <div className='wrapper'>
      <div className='user'>
        <div className='user__img-side'>
          <div className='user__avatar'>
            <img
              className='user__ava-img'
              src={image || data.user.ava}
              alt='userAva'
            />
          </div>
          <form className='user__img-form' onSubmit={handleSubmitImage}>
            <input
              className=' field__input'
              type='text'
              value={image}
              onChange={handleChangeImage}
              placeholder='Image addresss'
            />
            <button className='user__img-btn btn btn-primary'>
              <BsPencilSquare className='btn__icon' />
              <span className='btn__name'>Image</span>
            </button>
          </form>
        </div>

        <div className='user__content-side'>
          <div className='user__pages'>
            <div className={`user__page ${flipPage && "user__page--open"}`}>
              <h3 className='user__fullname'>
                {data.user.firstname} {data.user.lastname}
              </h3>
              <p className='user__info'>
                <span>Email: {data.user.email}</span>
                <span>Last updated: {data.user.date.slice(0, 10)}</span>
              </p>
            </div>

            <div className={`user__page ${!flipPage && "user__page--open"}`}>
              <form onSubmit={handleSubmit}>{fields}</form>
              <div className='user__btns'>
                <button className='btn btn-simple'>
                  <BsX className='btn__icon' />
                  <span className='btn__name'>Cancel</span>
                </button>
                <button className='btn btn-primary'>
                  <BsCheck className='btn__icon' />
                  <span className='btn__name'>Apply</span>
                </button>
              </div>
            </div>
            <button
              className={`user__btn-flip btn btn-simple ${
                !flipPage && "user__btn-flip--disabled"
              }`}
              onClick={() => setFlipPage((prevFlipPage) => !prevFlipPage)}
            >
              <BsGear className='btn__icon' />
              <span className='btn__name'>Edit info</span>
            </button>
          </div>

          <div className='user__flats'>
            {data.apartments.map((item) => {
              return (
                <div key={item._id} className='user__container-flat'>
                  <div className='user__flat-link'>
                    <Link
                      className='flat-user'
                      to={`/details/flat/${item._id}`}
                    >
                      <span className='flat-user__container-img'>
                        <img
                          className='flat-user__img'
                          src={item.image}
                          alt='flatImg'
                        />
                      </span>
                      <span>{item.name}</span>
                    </Link>
                  </div>
                  <div className='user__vouchers'>
                    {item.vouchers.map((elem) => {
                      return (
                        <Link
                          key={elem._id}
                          className='voucher-user flat-user'
                          to={`/edit-voucher/${elem._id}`}
                        >
                          <span className='voucher-user__container-img flat-user__container-img'>
                            <img
                              className='voucher-user__img flat-user__img'
                              src={elem.image}
                              alt='voucherImg'
                            />
                          </span>
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default User
