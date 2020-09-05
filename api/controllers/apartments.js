const Apartment = require("../models/Apartment")
const TimeRange = require("../models/TimeRange")

exports.apartment_create = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      price,
      numberRooms,
      timeRanges,
    } = req.body
    const { userId } = req

    let apartment = new Apartment({
      name,
      description,
      image,
      price,
      numberRooms,
      owner: userId,
    })

    apartment = await apartment.save()

    for (let i = 0; i < timeRanges.length; i++) {
      let timeRange = new TimeRange({
        settlement: timeRanges[i].settlement,
        eviction: timeRanges[i].eviction,
        apartment: apartment._id,
        owner: userId,
      })
      timeRange = await timeRange.save()

      apartment.timeRanges.push(timeRange._id)
    }
    apartment = await apartment.save()

    res.json("Apartment created!")
  } catch (error) {
    res.status(400).json(`Apartment creating error: ${error.messsage}`)
  }
}
