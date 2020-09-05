import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { AiOutlineWarning } from "react-icons/ai"

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
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([])

  const handleForward = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsFormFlipped(true)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(
      form.map((item) => {
        if (item.param === event.target.name) {
          return { ...item, value: event.target.value }
        }
        return item
      })
    )
  }

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

  return (
    <div className='wrapper'>
      <div className='form'>
        <div className='form__container'>
          <div className=''>
            <form onSubmit={handleForward}>
              {fields}
              <button></button>
            </form>
            <div className=''></div>
          </div>
          <div className=''>
            <form>
              form
              <button></button>
            </form>
            <div className=''></div>
          </div>
        </div>

        <div className='form__image'></div>
      </div>
    </div>
  )
}

export default CreateEditFlat
