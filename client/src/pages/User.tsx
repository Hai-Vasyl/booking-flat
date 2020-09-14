import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { BsCheck, BsGear, BsPencilSquare, BsX } from "react-icons/bs"
import { Link } from "react-router-dom"
import { AiOutlineWarning } from "react-icons/ai"
import { useSelector, useDispatch } from "react-redux"
import { RootStore } from "../redux/store"
import { SET_UPDATED_AUTH } from "../redux/auth/authTypes"

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
  const { userId } = useParams<UserParam>()
  const {
    auth: { userData },
  } = useSelector((state: RootStore) => state)
  const isAuthUserPage = userId === (userData.user && userData.user._id)
  const dispatch = useDispatch()
  const initialForm = [
    {
      param: "firstname",
      msg: "",
      value: userData.user ? userData.user.firstname : "",
      name: "First name",
      type: "text",
    },
    {
      param: "lastname",
      msg: "",
      value: userData.user ? userData.user.lastname : "",
      name: "Last name",
      type: "text",
    },
    {
      param: "email",
      msg: "",
      value: userData.user ? userData.user.email : "",
      name: "Email address",
      type: "email",
    },
  ]

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

  const [form, setForm] = useState(initialForm)
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

        const dataProps = isAuthUserPage
          ? { apartments: res.data.apartments }
          : res.data

        setData((prevData) => ({ ...prevData, ...dataProps }))
      } catch (error) {}
    }

    fetchData()
  }, [userId, isAuthUserPage])

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImage(event.target.value)
  }

  const handleSubmit = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>,
    isImage: boolean
  ) => {
    try {
      event.preventDefault()

      let isEmpty = false
      if (isImage && !image) {
        return
      } else if (!isImage) {
        setForm(
          form.map((item) => {
            if (!item.value) {
              isEmpty = true
              return { ...item, msg: "Fill in this field!" }
            }
            return item
          })
        )
      }
      if (isEmpty) {
        return
      }

      const [firstname, lastname, email] = form
      const dataPayload = {
        firstname: firstname.value,
        lastname: lastname.value,
        email: email.value,
      }

      const res = await axios({
        url: "/auth/user-update",
        method: "post",
        data: isImage ? { ava: image } : { ...dataPayload },
        headers: userData && {
          Authorization: `Basic ${userData.token}`,
        },
      })

      dispatch({
        type: SET_UPDATED_AUTH,
        payload: {
          ...dataPayload,
          ava: image ? image : userData.user.ava,
          date: res.data,
        },
      })
      setImage("")
      setFlipPage(true)
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

  const handleReset = () => {
    setFlipPage(true)
    setForm(initialForm)
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

  const user = {
    ava: isAuthUserPage ? userData.user.ava : data.user.ava,
    firstname: isAuthUserPage ? userData.user.firstname : data.user.firstname,
    lastname: isAuthUserPage ? userData.user.lastname : data.user.lastname,
    email: isAuthUserPage ? userData.user.email : data.user.email,
    date: isAuthUserPage ? userData.user.date : data.user.date,
  }

  return (
    <div className='wrapper'>
      <div className='user'>
        <div className='user__img-side'>
          <div className='user__avatar'>
            <img
              className='user__ava-img'
              src={image || user.ava}
              alt='userAva'
            />
          </div>
          {isAuthUserPage && (
            <form
              className='user__img-form'
              onSubmit={(event) => handleSubmit(event, true)}
            >
              <input
                className=' field__input'
                type='text'
                value={image}
                onChange={handleChangeImage}
                placeholder='Image address'
              />
              <button
                className={`user__img-btn btn btn-primary ${
                  !image && "btn-disabled"
                }`}
              >
                <BsPencilSquare className='btn__icon' />
                <span className='btn__name'>Image</span>
              </button>
            </form>
          )}
        </div>

        <div className='user__content-side'>
          <div className='user__pages'>
            <div className={`user__page ${flipPage && "user__page--open"}`}>
              <h3 className='user__fullname'>
                {user.firstname} {user.lastname}
              </h3>
              <p className='user__info'>
                <span>Email: {user.email}</span>
                <span>Last updated: {user.date.slice(0, 10)}</span>
              </p>
              {isAuthUserPage && (
                <button
                  className={`user__btn-flip btn btn-simple ${
                    !flipPage && "user__btn-flip--disabled"
                  }`}
                  onClick={() => setFlipPage((prevFlipPage) => !prevFlipPage)}
                >
                  <BsGear className='btn__icon' />
                </button>
              )}
            </div>

            <div className={`user__page ${!flipPage && "user__page--open"}`}>
              <form onSubmit={(event) => handleSubmit(event, false)}>
                {fields}
                <button className='btn-handler'></button>
              </form>
              <div className='user__btns'>
                <button className='btn btn-simple' onClick={handleReset}>
                  <BsX className='btn__icon' />
                  <span className='btn__name'>Cancel</span>
                </button>
                <button
                  className='btn btn-primary'
                  onClick={(event) => handleSubmit(event, false)}
                >
                  <BsCheck className='btn__icon' />
                  <span className='btn__name'>Apply</span>
                </button>
              </div>
            </div>
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
                  <div
                    className={`user__vouchers ${
                      !item.vouchers.length && "user__vouchers--close"
                    }`}
                  >
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
                          <span>{elem.name}</span>
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
