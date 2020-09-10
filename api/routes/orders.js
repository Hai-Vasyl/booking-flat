const { Router } = require("express")
const router = Router()
const { order_create, orders_get } = require("../controllers/orders")
const auth = require("../middlewares/auth.middleware")

router.post("/create", order_create)
router.post("/get-orders", auth, orders_get)

module.exports = router
