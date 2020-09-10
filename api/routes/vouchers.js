const { Router } = require("express")
const auth = require("../middlewares/auth.middleware")
const router = Router()
const {
  voucher_create,
  voucher_update,
  voucher_get,
  voucher_delete,
  vouchers_get,
  voucher_details_get,
} = require("../controllers/vouchers")

router.post("/create", auth, voucher_create)
router.post("/update/:voucherId", auth, voucher_update)
router.get("/get/:voucherId", voucher_get)
router.delete("/delete/:voucherId", auth, voucher_delete)
router.post("/get-filtered", vouchers_get)
router.post("/get-filtered", vouchers_get)
router.get("/get-details/:voucherId", voucher_details_get)

module.exports = router
