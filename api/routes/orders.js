const { Router } = require("express")
const router = Router()
const { order_create } = require("../controllers/orders")

router.post("/create", order_create)

module.exports = router
