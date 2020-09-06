const { Schema, model, Types } = require("mongoose")

const schema = new Schema({
  settlement: { type: Date, required: true },
  eviction: { type: Date, required: true },
  apartment: { type: Types.ObjectId, ref: "Apartment", required: true },
  owner: { type: Types.ObjectId, ref: "User", required: true },
  bookedStatus: { type: Boolean, required: true, default: false },
})

module.exports = model("TimeRange", schema)
