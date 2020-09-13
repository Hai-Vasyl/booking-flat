const { Router } = require("express")
const { check } = require("express-validator")
const {
  user_register,
  user_login,
  user_details_get,
  user_update,
} = require("../controllers/users")
const auth = require("../middlewares/auth.middleware")

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

router.get("/user-details-get/:userId", user_details_get)
router.post("/user-update", auth, user_update)

module.exports = router
