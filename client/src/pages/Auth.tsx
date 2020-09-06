import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootStore } from "../redux/store"
import {
  AiOutlineLogin,
  AiOutlineCheckCircle,
  AiOutlineWarning,
} from "react-icons/ai"
import { fetchAuth } from "../redux/auth/authActions"
import { CLEAR_ERROR_AUTH } from "../redux/auth/authTypes"

type FormField = {
  param: string
  name: string
  value: string
  type: string
}

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const dispatch = useDispatch()
  const [form, setForm] = useState<FormField[]>([
    { param: "firstname", name: "First name", value: "", type: "text" },
    { param: "lastname", name: "Last name", value: "", type: "text" },
    { param: "email", name: "Email address", value: "", type: "text" },
    { param: "password", name: "Password", value: "", type: "password" },
  ])

  const {
    auth: { load, errors },
  } = useSelector((state: RootStore) => state)

  const handleSubmit = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()

    const [firstname, lastname, email, password] = form
    const registerFileds = isLogin
      ? null
      : {
          firstname: firstname.value,
          lastname: lastname.value,
        }

    dispatch(
      fetchAuth(isLogin, {
        ...registerFileds,
        email: email.value,
        password: password.value,
      })
    )
  }

  const handleFlipForm = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.name)
    setForm(
      form.map((item) => {
        if (item.param === event.target.name) {
          dispatch({ type: CLEAR_ERROR_AUTH, payload: item.param })
          return { ...item, value: event.target.value }
        }
        return item
      })
    )
  }

  const getError = (fieldParam: string) => {
    let msg: string = ""
    errors.forEach((item) => {
      if (item.param === fieldParam) {
        msg = item.msg
      }
    })

    return msg
  }

  const fields = form.map((item) => {
    const msg = getError(item.param)
    return (
      <label
        key={item.param}
        className={`field ${
          isLogin &&
          (item.param === "firstname" || item.param === "lastname") &&
          "field--close"
        }`}
      >
        <span className='field__name'>{item.name}</span>
        <input
          className={`field__input ${msg && "field__input--error"}`}
          type={item.type}
          value={item.value}
          onChange={handleChange}
          autoComplete='off'
          name={item.param}
        />
        <span className={`error ${msg && "error--active"}`}>
          <AiOutlineWarning className='error__icon' />
          <span className='error__name'>{msg}</span>
        </span>
      </label>
    )
  })

  return (
    <div className='wrapper'>
      <div className='title'>
        <h2 className='title__name'>{isLogin ? "Login" : "Register"}</h2>
        <p className='title__description'>Authorization and registration</p>
      </div>

      <div className='auth-form'>
        <form onSubmit={handleSubmit} className='auth-form__fields'>
          {fields}
          <button className='btn-handler'></button>
        </form>
        <div className='auth-form__btns'>
          <button
            className='auth-form__btn btn btn-primary'
            onClick={handleSubmit}
          >
            {isLogin ? (
              <AiOutlineLogin className='btn__icon' />
            ) : (
              <AiOutlineCheckCircle className='btn__icon' />
            )}
            <span className='btn__name'>{isLogin ? "Sign in" : "Sign up"}</span>
          </button>
          <button onClick={handleFlipForm} className='btn btn-simple'>
            {isLogin ? (
              <AiOutlineCheckCircle className='btn__icon' />
            ) : (
              <AiOutlineLogin className='btn__icon' />
            )}
            <span className='btn__name'>{isLogin ? "Sign up" : "Sign in"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Auth
