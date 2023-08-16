const express = require("express");
const router = express.Router();

const { get_booking_byEmail  } = require("../controllers/get_booking_byEmail_controller");

router.get("/get/bookingByEmail",  get_booking_byEmail);

module.exports = router;