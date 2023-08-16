const express = require("express");
const router = express.Router();

const { get_booking  } = require("../controllers/get_booking_controller");

router.get("/get/booking",  get_booking);

module.exports = router;