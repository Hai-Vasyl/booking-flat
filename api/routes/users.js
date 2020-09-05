const { Router } = require("express")
const { check } = require("express-validator")
const { user_register, user_login } = require("../controllers/users")

const router = Router()

router.post(
  "/register",
  [
    check("firstname", "First name can contain up to 20 characters!").isLength({
      max: 20,
    }),
    check("lastname", "Last name can contain up to 20 characters!").isLength({
      max: 20,
    }),
    check("email", "Email is not correct!").isEmail(),
    check("password", "Password must contain at least 4 characters!").isLength({
      min: 4,
    }),
  ],
  user_register
)

router.post(
  "/login",
  [
    check("email", "Email is not correct!").isEmail(),
    check("password", "Password is not correct!").isLength({
      min: 4,
    }),
  ],
  user_login
)

module.exports = router
