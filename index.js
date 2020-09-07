const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
require("dotenv").config()
const app = express()
const PORT = process.env.PORT || 4000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const startServer = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
      () => console.log("MongoDB started successfully!")
    )

    app.use("/auth", require("./api/routes/users"))
    app.use("/vouchers", require("./api/routes/vouchers"))
    app.use("/apartments", require("./api/routes/apartments"))

    app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
  } catch (error) {
    console.log(`Server error: ${error.message}`)
  }
}

startServer()
