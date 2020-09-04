const { Schema, model } = require("mongoose")

const schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  typeUser: { type: String, required: true, default: "user" },
  date: { type: Date, required: true },
  ava: {
    type: String,
    required: true,
    default: "https://spark.ru/public/img/user_ava_big.png",
  },
})

module.exports = model("User", schema)
