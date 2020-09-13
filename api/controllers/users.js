const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Apartment = require("../models/Apartment")
const Voucher = require("../models/Voucher")
const { validationResult } = require("express-validator")
require("dotenv").config()

exports.user_register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    }

    const { firstname, lastname, email, password, typeUser } = req.body

    const userByEmail = await User.findOne({ email })
    if (userByEmail) {
      return res.status(400).json({
        errors: [
          { param: "email", msg: "User with this email already exists!" },
        ],
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    let userNew = new User({
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
      return res.status(400).json({
        errors: [
          { param: "email", msg: "User with this email is not exists!" },
        ],
      })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(400).json({
        errors: [{ param: "password", msg: "Password is wrong!" }],
      })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
    res.json({ token, user })
  } catch (error) {
    res.json(`Login error: ${error.message}`)
  }
}

exports.user_details_get = async (req, res) => {
  try {
    const { userId } = req.params

    const user = await User.findById(userId).select("-password")
    const apartments = await Apartment.find({ owner: userId })
      .select("name image")
      .populate({ path: "vouchers", select: "name image" })

    res.json({ user, apartments })
  } catch (error) {
    res.json(`User details getting error: ${error.message}`)
  }
}

exports.user_update = async (req, res) => {
  try {
    const { userId } = req

    const date = new Date()
    await User.findByIdAndUpdate(userId, { ...req.body, date })

    res.json(date)
  } catch (error) {
    res.json(`User updating error: ${error.message}`)
  }
}
