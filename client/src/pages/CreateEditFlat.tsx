import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { AiOutlineWarning } from "react-icons/ai"
import {
  BsArrowRight,
  BsArrowLeft,
  BsCalendar,
  BsLayoutTextSidebar,
  BsPlus,
  BsCardImage,
  BsX,
  BsPlusSquare,
  BsTrash,
  BsPencilSquare,
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
  _id: number
  settlement: string
  eviction: string
  bookedStatus: boolean
}

type StatusDates = {
  status: boolean
}

type ResponseTimeRange = {
  bookedStatus: boolean
  _id: string
  name: string
  settlement: string
  eviction: string
  apartment: string
  owner: string
  __v?: number
}

const CreateEditFlat: React.FC = () => {
  const { flatId } = useParams<PropsParams>()
  const [isFormFlipped, setIsFormFlipped] = useState(false)
  const [message, setMessage] = useState("")

  const [form, setForm] = useState<FormItem[]>([])
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios({
          url: `/apartments/get/${flatId}`,
          method: "get",
          data: null,
        })

        const apartmentData = res.data

        setForm((prevForm) =>
          prevForm.map((item) => {
            return { ...item, value: apartmentData[item.param] }
          })
        )

        setTimeRanges(
          apartmentData.timeRanges.map((item: ResponseTimeRange) => {
            return {
              ...item,
              settlement: item.settlement.slice(0, 10),
              eviction: item.eviction.slice(0, 10),
            }
          })
        )
      } catch (error) {}
    }

    setForm([
      { param: "name", msg: "", name: "Name", value: "" },
      { param: "description", msg: "", name: "Description", value: "" },
      { param: "image", msg: "", name: "Image", value: "" },
      { param: "price", msg: "", name: "Price", value: "" },
      { param: "numberRooms", msg: "", name: "Number of rooms", value: "" },
    ])
    if (flatId) {
      fetchData()
    } else {
      setTimeRanges([])
      setIsFormFlipped(false)
    }
  }, [flatId])

  const onFlip = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>,
    isMainForm: boolean
  ) => {
    event.preventDefault()

    if (isMainForm) {
      setIsFormFlipped(false)
      setMessage("")
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

    if (new Date(value) <= new Date()) {
      return setMessage(`Wrong ${name} date!`)
    } else {
      setMessage("")
    }

    setTimeForm(
      timeForm.map((item) => {
        if (item.param === name) {
          return { ...item, value }
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
        bookedStatus: false,
        _id: Date.now(),
      },
    ])
  }

  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      event.preventDefault()
      setMessage("")
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
        url: flatId ? `/apartments/update/${flatId}` : "/apartments/create",
        method: "post",
        data: { ...dataApartment, timeRanges },
        headers: userData && {
          Authorization: `Basic ${userData.token}`,
        },
      })

      console.log(res.data)
    } catch (error) {}
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
      prevTimeRanges.filter((item) => item._id !== id)
    )
  }

  const handleDelete = async () => {
    try {
      const res = await axios({
        url: `/apartments/delete/${flatId}`,
        method: "delete",
        data: null,
        headers: userData && {
          Authorization: `Basic ${userData.token}`,
        },
      })

      console.log(res.data)
    } catch (error) {}
  }

  const timeForms = timeForm.map((item) => {
    return (
      <label className='field field-date' key={item.param}>
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
      <div
        key={item._id}
        className={`time-slot ${item.bookedStatus && "time-slot--disabled"}`}
      >
        <span className='time-slot__date'>{item.settlement}</span>-
        <span className='time-slot__date'>{item.eviction}</span>
        {!item.bookedStatus && (
          <button
            className='time-slot__btn-delete'
            onClick={() => handleDeleteSlot(item._id)}
          >
            <BsX />
          </button>
        )}
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
              <div className='form-flat__date-fields'>
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
              <button
                className='form-flat__btn-go-left btn btn-primary'
                onClick={(event) => onFlip(event, true)}
              >
                <BsArrowLeft className='btn__icon' />
                <span className='btn__name'>Move back</span>
              </button>
              {flatId && (
                <button className='btn btn-simple' onClick={handleDelete}>
                  <BsTrash className='btn__icon' />
                  <span className='btn__name'>Delete</span>
                </button>
              )}
              <button
                className={`form-flat__btn-apply btn btn-primary ${
                  !timeRanges.length && "form-flat__btn-apply--disabled"
                }`}
                onClick={timeRanges.length ? handleSubmit : () => {}}
              >
                {flatId ? (
                  <BsPencilSquare className='btn__icon' />
                ) : (
                  <BsPlusSquare className='btn__icon' />
                )}
                <span className='btn__name'>{flatId ? "Edit" : "Create"}</span>
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
