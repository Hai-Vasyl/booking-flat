const { Schema, model, Types } = require("mongoose")

const schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: String, required: true },
  variant: {
    type: String,
    required: true,
    default: "restaurant",
  },
  quantity: { type: Number, required: true, default: 1 },
  owner: { type: Types.ObjectId, ref: "User", required: true },
  apartment: { type: Types.ObjectId, ref: "Apartment", required: true },
  statusActive: { type: Boolean, required: true, default: true },
})

module.exports = model("Voucher", schema)
