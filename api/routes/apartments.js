const { Router } = require("express")
const auth = require("../middlewares/auth.middleware")
const router = Router()
const {
  apartment_create,
  apartment_update,
  apartment_get,
  apartment_delete,
  apartments_get,
} = require("../controllers/apartments")

router.post("/create", auth, apartment_create)
router.post("/update/:apartmentId", auth, apartment_update)
router.get("/get/:apartmentId", apartment_get)
router.delete("/delete/:apartmentId", auth, apartment_delete)
router.post("/get-filtered", apartments_get)

module.exports = router
