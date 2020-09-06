import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { AiOutlineWarning } from "react-icons/ai"
import {
  BsArrowRight,
  BsCalendar,
  BsLayoutTextSidebar,
  BsCheck,
  BsPlus,
  BsCardImage,
  BsX,
} from "react-icons/bs"

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
  msg: string
  value: string
}

interface TimeSlots {
  settlement: string
  eviction: string
}

const CreateEditFlat: React.FC = () => {
  const { flatId } = useParams<PropsParams>()
  const [isFormFlipped, setIsFormFlipped] = useState(false)
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
      msg: "",
      value: "",
    },
    {
      param: "eviction",
      msg: "",
      value: "",
    },
  ])

  const [timeRanges, setTimeRanges] = useState<TimeSlots[]>([])

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
    const statusDates = timeForm.map((item) => {
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
        // console.log(checkEachFormDateParam(item.settlement, true))
        // console.log(checkEachFormDateParam(item.eviction, false))
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
            return { ...item, msg: "Not valid date!" }
          } else {
            return { ...item, value, msg: "" }
          }
        }
        return item
      })
    )
  }

  const handleAddTime = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!checkDateRepeating()) {
      console.log("Repeat!!!!!")
      return
    }

    const [settlement, eviction] = timeForm
    setTimeRanges((prevTimeRanges) => [
      { settlement: settlement.value, eviction: eviction.value },
      ...prevTimeRanges,
    ])
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(form)
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
        <span className={`error ${item.msg && "error--active"}`}>
          <span className='error__name'>{item.msg}</span>
          <AiOutlineWarning className='error__icon' />
        </span>
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
          <span className='error__name'>{item.msg}</span>
          <AiOutlineWarning className='error__icon' />
        </span>
      </label>
    )
  })

  const timeRangeSlots = timeRanges.map((item) => {
    return (
      <div key={item.eviction} className='time-slot'>
        <span className='time-slot__date'>{item.settlement}</span>-
        <span className='time-slot__date'>{item.eviction}</span>
        <button className='time-slot__btn-delete'>
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
              <span className='btn__name'>Go forward</span>
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
            </div>
            <div>{timeRangeSlots}</div>
            <div>
              <button className='btn btn-primary'>
                <span className='btn__name'>Go back</span>
                <BsArrowRight className='btn__icon' />
              </button>

              <button className='btn btn-primary'>
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
