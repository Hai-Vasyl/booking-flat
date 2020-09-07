import React, { useState, useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"
import { AiOutlineWarning } from "react-icons/ai"
import {
  BsCardImage,
  BsPlusCircle,
  BsTrash,
  BsPencilSquare,
} from "react-icons/bs"
import axios from "axios"
import { useSelector } from "react-redux"
import { RootStore } from "../redux/store"

interface PropsParams {
  id: string
}

interface PropsLocation {
  pathname: string
}

interface FormItem {
  param: string
  name: string
  msg: string
  value: string
}

const CreateEditVoucher = () => {
  const { id } = useParams<PropsParams>()
  const { pathname } = useLocation<PropsLocation>()
  const isCreate = pathname === `/create-voucher/${id}`
  const [form, setForm] = useState<FormItem[]>([
    { param: "name", value: "", name: "Name", msg: "" },
    { param: "description", value: "", name: "Description", msg: "" },
    { param: "image", value: "", name: "Image", msg: "" },
    { param: "price", value: "", name: "Price", msg: "" },
    { param: "variant", value: "restaurant", name: "Variant", msg: "" },
    { param: "quantity", value: "1", name: "Quantity", msg: "" },
  ])

  const {
    auth: { userData },
  } = useSelector((state: RootStore) => state)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios({
          url: `/vouchers/get/${id}`,
          method: "get",
          data: null,
        })

        const voucherData = res.data

        setForm((prevForm) =>
          prevForm.map((item) => {
            return { ...item, value: voucherData[item.param] }
          })
        )
      } catch (error) {}
    }

    if (isCreate) {
      return
    }
    fetchData()
  }, [isCreate, id])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm(
      form.map((item) => {
        if (item.param === event.target.name) {
          return { ...item, value: event.target.value, msg: "" }
        }
        return item
      })
    )
  }

  const handleSubmit = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      event.preventDefault()

      let isEmptyFields = false
      setForm(
        form.map((item) => {
          if (!item.value) {
            isEmptyFields = true
            return { ...item, msg: "Fill in this field!" }
          }
          return item
        })
      )

      if (isEmptyFields) {
        return
      }

      let dataVoucher: { [key: string]: string } = {
        name: "",
        description: "",
        image: "",
        price: "",
        numberRooms: "",
        variant: "",
        quantity: "",
      }

      form.forEach((item) => {
        dataVoucher[item.param] = item.value
      })

      const res = await axios({
        url: isCreate ? "/vouchers/create" : `/vouchers/update/${id}`,
        method: "post",
        data: {
          ...dataVoucher,
          apartment: isCreate ? id : null,
        },
        headers: userData && {
          Authorization: `Basic ${userData.token}`,
        },
      })

      console.log(res.data)
    } catch (error) {}
  }

  const handleDelete = async () => {
    try {
      const res = await axios({
        url: `/vouchers/delete/${id}`,
        method: "delete",
        data: null,
        headers: userData && {
          Authorization: `Basic ${userData.token}`,
        },
      })

      console.log(res.data)
    } catch (error) {}
  }

  const fields = form.map((item) => {
    if (item.param === "variant") {
      return (
        <div key={item.param} className='field'>
          <label className='select'>
            <span className='select__name field__name'>{item.name}</span>
            <select
              className='select__viewer'
              name={item.param}
              value={item.value}
              onChange={handleChange}
            >
              <option className='select__option' value='restaurant'>
                Restaurant
              </option>
              <option className='select__option' value='club'>
                Club
              </option>
              <option className='select__option' value='museum'>
                Museum
              </option>
              <option className='select__option' value='cinema'>
                Cinema
              </option>
            </select>
          </label>
          <span className={`error ${item.msg && "error--active"}`}>
            <AiOutlineWarning className='error__icon' />
            <span className='error__name'>{item.msg}</span>
          </span>
        </div>
      )
    }
    return (
      <label key={item.param} className='field'>
        <span className='field__name'>{item.name}</span>
        <input
          type='text'
          value={item.value}
          className={`field__input ${item.msg && "field__input--error"}`}
          onChange={handleChange}
          name={item.param}
          autoComplete='off'
        />
        <span className={`error ${item.msg && "error--active"}`}>
          <AiOutlineWarning className='error__icon' />
          <span className='error__name'>{item.msg}</span>
        </span>
      </label>
    )
  })

  const getImage = () => {
    let src: string = ""
    form.forEach((item) => {
      if (item.param === "image") {
        src = item.value
      }
    })
    return src
  }

  const imageSrc = getImage()

  return (
    <div className='wrapper'>
      <div className='form-voucher'>
        <div className='form-voucher__container'>
          <form onSubmit={handleSubmit}>
            {fields}
            <button className='btn-handler'></button>
          </form>
          <div className='form-voucher__btns'>
            {!isCreate && (
              <button className='btn btn-simple' onClick={handleDelete}>
                <BsTrash className='btn__icon' />
                <span className='btn__name'>Delete</span>
              </button>
            )}
            <button className='btn btn-primary' onClick={handleSubmit}>
              {isCreate ? (
                <BsPlusCircle className='btn__icon' />
              ) : (
                <BsPencilSquare className='btn__icon' />
              )}
              <span className='btn__name'>{isCreate ? "Create" : "Edit"}</span>
            </button>
          </div>
        </div>

        <div className='form-flat__image-side'>
          {imageSrc ? (
            <img src={imageSrc} className='form-flat__img' alt='previewImg' />
          ) : (
            <div className='plug-img'>
              <BsCardImage className='plug-img__icon' />
              <span className='plug-img__name'>No image preview</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateEditVoucher
