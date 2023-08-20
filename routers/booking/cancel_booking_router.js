const express = require("express");
const router = express.Router();

const { cancel_booking  } = require("../../controllers/booking/cancel_booking_controller");

router.post("/cancel/booking",  cancel_booking);

module.exports = router;
