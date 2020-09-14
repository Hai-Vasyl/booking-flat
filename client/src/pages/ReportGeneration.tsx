import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { useSelector } from "react-redux"
import { RootStore } from "../redux/store"

interface TimeRangeFlat {
  settlement: string
  eviction: string
  _id: string
}

interface UnorderedFlat {
  image: string
  name: string
  numberRooms: string
  owner: {
    ava: string
    firstname: string
    lastname: string
    _id: string
  }
  price: string
  timeRanges: TimeRangeFlat[]
  _id: string
}

interface SortedFlat {
  id: number
  numberRooms: string
  nodes: UnorderedFlat[]
}

const ReportGeneration: React.FC = () => {
  const [data, setData] = useState<SortedFlat[]>([])
  const [dataRange, setDataRange] = useState({
    settlement: "",
    eviction: "",
  })
  const {
    auth: { userData },
  } = useSelector((state: RootStore) => state)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const compare = (firstItem: SortedFlat, secondItem: SortedFlat) => {
          const item1 = firstItem.nodes.length
          const item2 = secondItem.nodes.length

          if (item1 > item2) {
            return -1
          } else if (item1 < item2) {
            return 1
          } else {
            return 0
          }
        }

        const res = await axios({
          url: "/apartments/get-unbooked",
          method: "post",
          data: {
            settlement: dataRange.settlement,
            eviction: dataRange.eviction,
          },
          headers: userData && {
            Authorization: `Basic ${userData.token}`,
          },
        })

        let flats: UnorderedFlat[] = res.data
        let sortedFlats: SortedFlat[] = []

        const isIncludeInCollection = (number: string) => {
          let isInclude = false
          let indexIncluded: number = 0

          sortedFlats.forEach((item, index: number) => {
            if (number === item.numberRooms) {
              isInclude = true
              indexIncluded = index
            }
          })
          return { isInclude, indexIncluded }
        }

        let counterId = 0
        flats.forEach((item) => {
          const { isInclude, indexIncluded } = isIncludeInCollection(
            item.numberRooms
          )
          if (isInclude) {
            sortedFlats[indexIncluded].nodes.push(item)
          } else {
            sortedFlats.push({
              id: counterId++,
              numberRooms: item.numberRooms,
              nodes: [{ ...item }],
            })
          }
        })

        setData(sortedFlats.sort(compare))
      } catch (error) {}
    }

    fetchData()
  }, [dataRange, userData])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target

    setDataRange({ ...dataRange, [name]: value })
  }

  const flats = data.map((item) => {
    return (
      <div key={item.id} className='flat-unbooked'>
        <div className='flat-unbooked__title'>
          <span className='flat-unbooked__title-name'>
            Rooms: {item.numberRooms}
          </span>
          -
          <span className='flat-unbooked__title-name'>
            Apartments: {item.nodes.length}
          </span>
        </div>
        <div className='flat-unbooked__container-flats'>
          {item.nodes.map((elem) => {
            return (
              <div key={elem._id} className='flat-unbooked__flat'>
                <Link
                  to={`/details/flat/${elem._id}`}
                  className='flat-unbooked__container-img'
                >
                  <img
                    src={elem.image}
                    alt='flatImg'
                    className='flat-unbooked__img'
                  />
                  <span className='flat-unbooked__price'>{elem.price}</span>
                </Link>
                <div className='flat-unbooked__info'>
                  <Link
                    className='flat-unbooked__name'
                    to={`/details/flat/${elem._id}`}
                  >
                    {elem.name}
                  </Link>
                  <span className='flat-unbooked__numberRooms'>
                    Number of rooms: {elem.numberRooms}
                  </span>
                  <Link
                    className='flat-unbooked__owner'
                    to={`/user/${elem.owner._id}`}
                  >
                    <span className='flat-unbooked__avatart'>
                      <img
                        className='flat-unbooked__ava-img'
                        src={elem.owner.ava}
                        alt='avaImg'
                      />
                    </span>
                    <span className='flat-unbooked__user-name'>
                      {elem.owner.firstname}
                    </span>
                    <span className='flat-unbooked__user-name'>
                      {elem.owner.lastname}
                    </span>
                  </Link>
                </div>
                <div className='flat-unbooked__container-dates'>
                  {elem.timeRanges.map((item) => {
                    return (
                      <div className='flat-unbooked__date-slot' key={item._id}>
                        <span className='flat-unbooked__date'>
                          {item.settlement.slice(0, 10)}
                        </span>
                        -
                        <span className='flat-unbooked__date'>
                          {item.eviction.slice(0, 10)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  })

  return (
    <div className='wrapper'>
      <div className='date-panel'>
        <div className='date-panel__container'>
          <input
            type='date'
            name='settlement'
            value={dataRange.settlement}
            onChange={handleChange}
            className='field__date'
          />
          <input
            type='date'
            className='date-panel__date-field field__date'
            name='eviction'
            value={dataRange.eviction}
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        {flats.length ? (
          flats
        ) : (
          <div className='plug-text'>No unbooked flats</div>
        )}
      </div>
    </div>
  )
}

export default ReportGeneration
