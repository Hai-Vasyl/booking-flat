const { Router } = require("express")
const auth = require("../middlewares/auth.middleware")
const router = Router()
const {
  apartment_create,
  apartment_update,
} = require("../controllers/apartments")

router.post("/create", auth, apartment_create)
router.post(`/edit/${apartmentId}`, auth, apartment_update)

module.exports = router
