const { Schema, model, Types } = require("mongoose")

const schema = new Schema({
  apartment: { type: Types.ObjectId, ref: "Apartment", required: true },
  name: { type: String, required: true },
  numberRooms: { type: Number, required: true },
  price: { type: Number, required: true },
  timeRange: { type: Types.ObjectId, ref: "TimeRange", required: true },
  settlement: { type: Date, required: true },
  eviction: { type: Date, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
})

module.exports = model("Booking", schema)
