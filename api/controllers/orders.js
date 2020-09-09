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
