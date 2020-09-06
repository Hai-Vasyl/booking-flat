import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { AiOutlineWarning } from "react-icons/ai"
import {
  BsArrowRight,
  BsArrowLeft,
  BsCalendar,
  BsLayoutTextSidebar,
  BsCheck,
  BsPlus,
  BsCardImage,
  BsX,
} from "react-icons/bs"
import axios from "axios"
import { useSelector } from "react-redux"
import { RootStore } from "../redux/store"

interface PropsParams {
  flatId: string
}

interface FormItem {
  param: string
  name: string
  msg: string
  value: string
}

interface TimeRange {
  param: string
  value: string
}

interface TimeSlots {
  id: number
  settlement: string
  eviction: string
}

type StatusDates = {
  status: boolean
}

const CreateEditFlat: React.FC = () => {
  const { flatId } = useParams<PropsParams>()
  const [isFormFlipped, setIsFormFlipped] = useState(false)
  const [message, setMessage] = useState("")
  const [form, setForm] = useState<FormItem[]>([
    { param: "name", msg: "", name: "Name", value: "" },
    { param: "description", msg: "", name: "Description", value: "" },
    { param: "image", msg: "", name: "Image", value: "" },
    { param: "price", msg: "", name: "Price", value: "" },
    { param: "numberRooms", msg: "", name: "Number of rooms", value: "" },
  ])
  const [timeForm, setTimeForm] = useState<TimeRange[]>([
    {
      param: "settlement",
      value: "",
    },
    {
      param: "eviction",
      value: "",
    },
  ])
  const [timeRanges, setTimeRanges] = useState<TimeSlots[]>([])
  const {
    auth: { userData },
  } = useSelector((state: RootStore) => state)

  const onFlip = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>,
    isMainForm: boolean
  ) => {
    event.preventDefault()

    if (isMainForm) {
      setIsFormFlipped(false)
    } else {
      let isEmptyField: boolean = false
      setForm(
        form.map((item) => {
          if (!item.value) {
            isEmptyField = true
            return { ...item, msg: "Fill in this field!" }
          }
          return item
        })
      )

      if (isEmptyField) {
        return
      }

      setIsFormFlipped(true)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(
      form.map((item) => {
        if (item.param === event.target.name) {
          return { ...item, value: event.target.value, msg: "" }
        }
        return item
      })
    )
  }

  const checkEachFormDateParam = (
    itemDateRange: string,
    isSettlement: boolean
  ) => {
    const statusDates: StatusDates[] = timeForm.map((item) => {
      const itemToDate = new Date(item.value)
      const status = isSettlement
        ? itemToDate < new Date(itemDateRange)
        : itemToDate > new Date(itemDateRange)
      return { status }
    })

    return statusDates[0].status && statusDates[1].status
  }

  const checkDateRepeating = () => {
    let isNotRepeating: boolean = true

    timeRanges.forEach((item) => {
      if (
        checkEachFormDateParam(item.settlement, true) ||
        checkEachFormDateParam(item.eviction, false)
      ) {
        return
      } else {
        isNotRepeating = false
      }
    })

    return isNotRepeating
  }

  const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setTimeForm(
      timeForm.map((item) => {
        if (item.param === name) {
          if (new Date(value) <= new Date()) {
            setMessage(`Wrong ${name} date!`)
          } else {
            setMessage("")
            return { ...item, value }
          }
        }
        return item
      })
    )
  }

  const handleAddTime = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const [settlement, eviction] = timeForm
    if (new Date(settlement.value) >= new Date(eviction.value)) {
      return setMessage("Not appropriate dates!")
    }
    if (!checkDateRepeating()) {
      return setMessage("Duplicate or incorrect date ranges found!")
    }
    setMessage("")
    setTimeRanges((prevTimeRanges) => [
      ...prevTimeRanges,
      {
        settlement: settlement.value,
        eviction: eviction.value,
        id: Date.now(),
      },
    ])
  }

  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()

    let dataApartment: { [key: string]: string } = {
      name: "",
      description: "",
      image: "",
      price: "",
      numberRooms: "",
    }

    form.forEach((item) => {
      dataApartment[item.param] = item.value
    })

    const res = await axios({
      url: "/apartments/create",
      method: "post",
      data: { ...dataApartment, timeRanges },
      headers: userData && {
        Authorization: `Basic ${userData.token}`,
      },
    })

    console.log(res.data)
  }

  const getImage = () => {
    let src: string = ""
    form.forEach((item) => {
      if (item.param === "image") {
        src = item.value
      }
    })
    return src
  }

  const handleDeleteSlot = (id: number) => {
    setTimeRanges((prevTimeRanges) =>
      prevTimeRanges.filter((item) => item.id !== id)
    )
  }

  const timeForms = timeForm.map((item) => {
    return (
      <label className='field' key={item.param}>
        <span className='field__name field__date-name'>{item.param}</span>
        <input
          type='date'
          name={item.param}
          className='field__date'
          value={item.value}
          onChange={handleChangeDate}
        />
      </label>
    )
  })

  const fields = form.map((item) => {
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

  const timeRangeSlots = timeRanges.map((item) => {
    return (
      <div key={item.id} className='time-slot'>
        <span className='time-slot__date'>{item.settlement}</span>-
        <span className='time-slot__date'>{item.eviction}</span>
        <button
          className='time-slot__btn-delete'
          onClick={() => handleDeleteSlot(item.id)}
        >
          <BsX />
        </button>
      </div>
    )
  })

  const isEmptyDateFields = () => {
    let isEmptyField: boolean = false

    timeForm.forEach((item) => {
      if (!item.value) {
        isEmptyField = true
      }
    })

    return isEmptyField
  }

  const imageSrc = getImage()
  const isEmptyFields = isEmptyDateFields()

  return (
    <div className='wrapper'>
      <div className='form-flat'>
        <div className='form-flat__container'>
          <div className='form-flat__btns'>
            <button
              className={`btn form-flat__btn-tab ${
                !isFormFlipped && "form-flat__btn-tab--active"
              }`}
              onClick={(event) => onFlip(event, true)}
            >
              <BsLayoutTextSidebar className='btn__icon' />
              <span className='btn__name'>Main form</span>
            </button>
            <button
              className={`btn form-flat__btn-tab ${
                isFormFlipped && "form-flat__btn-tab--active"
              }`}
              onClick={(event) => onFlip(event, false)}
            >
              <BsCalendar className='btn__icon' />
              <span className='btn__name'>Time slots</span>
            </button>
          </div>
          <form
            onSubmit={(event) => onFlip(event, false)}
            className={`form-flat__page ${
              !isFormFlipped && "form-flat__page--active"
            }`}
          >
            {fields}
            <button className='form-flat__btn-go btn btn-primary'>
              <span className='btn__name'>Move forward</span>
              <BsArrowRight className='btn__icon' />
            </button>
          </form>
          <div
            className={`form-flat__page ${
              isFormFlipped && "form-flat__page--active"
            }`}
          >
            <div className='form-flat__date'>
              {timeForms}
              <button
                className={`form-flat__btn-add-time ${
                  isEmptyFields && "form-flat__btn-add-time--disabled"
                }`}
                onClick={isEmptyFields ? () => {} : handleAddTime}
              >
                <BsPlus />
              </button>
              <span
                className={`form-flat__error error ${
                  message && "error--active"
                }`}
              >
                <AiOutlineWarning className='error__icon' />
                <span className='error__name'>{message}</span>
              </span>
            </div>
            <div className='form-flat__container-slots'>{timeRangeSlots}</div>
            <div className='form-flat__btns-submit'>
              <button className='btn btn-primary'>
                <BsArrowLeft className='btn__icon' />
                <span className='btn__name'>Move back</span>
              </button>
              <button
                className={`form-flat__btn-apply btn btn-primary ${
                  !timeRanges.length && "form-flat__btn-apply--disabled"
                }`}
                onClick={timeRanges.length ? handleSubmit : () => {}}
              >
                <BsCheck className='btn__icon' />
                <span className='btn__name'>Submit</span>
              </button>
            </div>
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

export default CreateEditFlat
