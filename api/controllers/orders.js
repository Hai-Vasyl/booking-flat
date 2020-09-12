const Order = require("../models/Order")
const Booking = require("../models/Booking")
const TimeRange = require("../models/TimeRange")

exports.order_create = async (req, res) => {
  try {
    const { orderList, bookings } = req.body

    await Order.insertMany(orderList)
    await Booking.insertMany(bookings)

    for (let i = 0; i < bookings.length; i++) {
      await TimeRange.findByIdAndUpdate(bookings[i].timeRange, {
        bookedStatus: true,
      })
    }

    res.json("Orders created!")
  } catch (error) {
    res.status(400).json(`Order creating error: ${error.message}`)
  }
}

exports.orders_get = async (req, res) => {
  try {
    const { searchedText } = req.body

    const query = searchedText ? { $text: { $search: searchedText } } : {}
    const orders = await Order.find(query).populate({
      path: "voucher",
      select: "image",
    })
    const bookings = await await Booking.find(query).populate({
      path: "apartment",
      select: "image",
    })

    res.json({ orders, bookings })
  } catch (error) {
    res.status(400).json(`Order creating error: ${error.message}`)
  }
}

exports.orders_byowner_get = async (req, res) => {
  try {
    const { userId } = req

    const reduceUnmatched = (collection, isBooking) => {
      let newCollection = []
      collection.forEach((item) => {
        if (item.apartment || item.voucher) {
          newCollection.push(item)
        }
      })
      return newCollection
    }

    let bookings = await Booking.find().populate({
      path: "apartment",
      select: "owner image",
      match: { owner: userId },
    })
    let orders = await Order.find().populate({
      path: "voucher",
      select: "owner image",
      match: { owner: userId },
    })

    bookings = reduceUnmatched(bookings, true)
    orders = reduceUnmatched(orders, false)

    res.json({ orders, bookings })
  } catch (error) {
    res.status(400).json(`Order creating error: ${error.message}`)
  }
}
