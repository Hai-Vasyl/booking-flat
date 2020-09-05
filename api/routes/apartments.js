const { Router } = require("express")
const auth = require("../middlewares/auth.middleware")
const router = Router()
const { apartment_create } = require("../controllers/apartments")

router.post("/create", auth, apartment_create)

module.exports = router
