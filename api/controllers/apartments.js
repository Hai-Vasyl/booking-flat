const Apartment = require("../models/Apartment")
const TimeRange = require("../models/TimeRange")
const Voucher = require("../models/Voucher")

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
    res.status(400).json(`Apartment creating error: ${error.message}`)
  }
}

exports.apartment_update = async (req, res) => {
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
    const { apartmentId } = req.params

    await TimeRange.deleteMany({ apartment: apartmentId })

    let idTimeRanges = []
    for (let i = 0; i < timeRanges.length; i++) {
      let timeRange = new TimeRange({
        settlement: timeRanges[i].settlement,
        eviction: timeRanges[i].eviction,
        apartment: apartmentId,
        owner: userId,
      })

      timeRange = await timeRange.save()

      idTimeRanges.push(timeRange._id)
    }

    await Apartment.findByIdAndUpdate(apartmentId, {
      name,
      description,
      image,
      price,
      numberRooms,
      $set: { timeRanges: idTimeRanges },
    })

    res.json("Apartment updated!")
  } catch (error) {
    res.status(400).json(`Apartment editing error: ${error.messsage}`)
  }
}

exports.apartment_get = async (req, res) => {
  try {
    const { apartmentId } = req.params

    const apartment = await Apartment.findById(apartmentId).populate({
      path: "timeRanges",
    })

    res.json(apartment)
  } catch (error) {
    res.status(400).json(`Apartment getting error: ${error.messsage}`)
  }
}

exports.apartment_delete = async (req, res) => {
  try {
    const { apartmentId } = req.params

    await Apartment.findByIdAndDelete(apartmentId)
    await TimeRange.deleteMany({ apartment: apartmentId })
    await Voucher.deleteMany({ apartment: apartmentId })

    res.json("Apartment deleted!")
  } catch (error) {
    res.status(400).json(`Apartment deleting error: ${error.messsage}`)
  }
}

exports.apartments_get = async (req, res) => {
  try {
    const { price, numberRooms, settlement, eviction } = req.body

    let apartments = await Apartment.find({
      price: price ? price : { $exists: true },
      numberRooms: numberRooms ? numberRooms : { $exists: true },
    })
      .populate({ path: "owner", select: "firstname lastname ava" })
      .populate({
        path: "timeRanges",
        match: {
          settlement: settlement ? { $gte: settlement } : { $exists: true },
          eviction: eviction ? { $lte: eviction } : { $exists: true },
        },
      })
      .populate({ path: "vouchers", select: "name image variant" })

    let apartmentsFiltred = []
    apartments.forEach((item) => {
      if (!item.timeRanges.length) {
        return
      }
      apartmentsFiltred.push(item)
    })

    // let apartments = await Apartment.find({
    //   price: price ? price : { $exists: true },
    // })
    // let apartments = await Apartment.find({}).populate({
    //   path: "timeRanges",
    //   match: {
    //     settlement: { $lte: "2020-09-15" },
    //   },
    // })
    // let apartments = await TimeRange.find({
    //   settlement: { $gte: "2020-09-15" },
    // })
    res.json(apartmentsFiltred)
  } catch (error) {
    res.status(400).json(`Apartments getting error: ${error.message}`)
  }
}
