const { Schema, model, Types } = require("mongoose")

const schema = new Schema({
  voucher: { type: Types.ObjectId, ref: "Voucher", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  variant: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
})

module.exports = model("Order", schema)
