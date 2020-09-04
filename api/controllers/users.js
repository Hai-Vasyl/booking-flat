const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")

exports.user_register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    }

    const { firstname, lastname, email, password, typeUser } = req.body

    const userByEmail = await User.findOne({ email })
    if (userByEmail) {
      return res.status(400).json("User with this email already exists!")
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const userNew = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      typeUser,
      date: new Date(),
    })

    userNew = await userNew.save()

    const token = jwt.sign({ userId: userNew._id }, process.env.JWT_SECRET)
    res.json({ token, user: userNew })
  } catch (error) {
    res.json(`Register error: ${error.message}`)
  }
}

exports.user_login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    }

    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json("User is not exists!")
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const userNew = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      typeUser,
      date: new Date(),
    })

    userNew = await userNew.save()

    const token = jwt.sign({ userId: userNew._id }, process.env.JWT_SECRET)
    res.json({ token, user: userNew })
  } catch (error) {
    res.json(`Register error: ${error.message}`)
  }
}
