const express = require("express");
const router = express.Router();

const { create_booking  } = require("../controllers/booking_controller");

router.post("/create/booking",  create_booking);

module.exports = router;
