const { Schema, model, Types } = require("mongoose")

const schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  numberRooms: { type: Number, required: true },
  owner: { type: Types.ObjectId, ref: "User", required: true },
  timeRanges: [{ type: Types.ObjectId, ref: "TimeRange" }],
  vouchers: [{ type: Types.ObjectId, ref: "Voucher" }],
})

module.exports = model("Apartment", schema)
