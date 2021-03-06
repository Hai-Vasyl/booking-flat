const Apartment = require("../models/Apartment")
const Voucher = require("../models/Voucher")

exports.voucher_create = async (req, res) => {
  try {
    const { userId } = req

    let voucher = new Voucher({ ...req.body, owner: userId })

    voucher = await voucher.save()

    let apartment = await Apartment.findById(req.body.apartment)
    apartment.vouchers.push(voucher._id)
    await apartment.save()

    res.json("Voucher is created!")
  } catch (error) {
    res.status(400).json(`Voucher creating error: ${error.message}`)
  }
}

exports.voucher_update = async (req, res) => {
  try {
    const { voucherId } = req.params

    const { name, description, image, price, variant, quantity } = req.body

    await Voucher.findByIdAndUpdate(voucherId, {
      name,
      description,
      image,
      price,
      variant,
      quantity,
    })

    res.json("Voucher is updated!")
  } catch (error) {
    res.status(400).json(`Voucher updating error: ${error.message}`)
  }
}

exports.voucher_get = async (req, res) => {
  try {
    const { voucherId } = req.params

    const voucher = await Voucher.findById(voucherId)

    res.json(voucher)
  } catch (error) {
    res.status(400).json(`Voucher getting error: ${error.message}`)
  }
}

exports.voucher_delete = async (req, res) => {
  try {
    const { voucherId } = req.params

    const voucher = await Voucher.findById(voucherId)
    await Voucher.findByIdAndDelete(voucherId)

    await Apartment.findByIdAndUpdate(voucher.apartment, {
      $pull: { timeRanges: voucherId },
    })

    res.json("Voucher is deleted!")
  } catch (error) {
    res.status(400).json(`Voucher deleting error: ${error.message}`)
  }
}

exports.vouchers_get = async (req, res) => {
  try {
    const { pricefrom, priceto, variant } = req.body

    const query =
      pricefrom && priceto
        ? {
            $gte: pricefrom,
            $lte: priceto,
          }
        : !pricefrom && !priceto
        ? { $exists: true }
        : pricefrom && !priceto
        ? {
            $gte: pricefrom,
          }
        : {
            $lte: priceto,
          }

    let vouchers = await Voucher.find({
      price: query,
      variant: variant ? variant : { $exists: true },
    })
      .populate({ path: "owner", select: "firstname lastname ava" })
      .populate({
        path: "apartment",
        select: "name image",
      })
      .select("-description")

    res.json(vouchers)
  } catch (error) {
    res.status(400).json(`Vouchers getting error: ${error.message}`)
  }
}

exports.voucher_details_get = async (req, res) => {
  try {
    const { voucherId } = req.params
    const voucher = await Voucher.findById(voucherId)
      .populate({
        path: "owner",
        select: "firstname lastname ava",
      })
      .populate({ path: "apartment", select: "name image price numberRooms" })

    res.json(voucher)
  } catch (error) {
    res.status(400).json(`Voucher details getting error: ${error.message}`)
  }
}
