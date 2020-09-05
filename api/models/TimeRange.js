const { Schema, model, Types } = require("mongoose")

const schema = new Schema({
  settlement: { type: String, required: true },
  eviction: { type: String, required: true },
  apartment: { type: Types.ObjectId, ref: "Apartment", required: true },
  owner: { type: Types.ObjectId, ref: "User", required: true },
  bookedStatus: { type: Boolean, required: true, default: false },
})

module.exprots = model("TimeRange", schema)
