const express = require("express");
const router = express.Router();

const { get_booking_db_by_userID  } = require("../../controllers/booking/get_booking_db_by_userID_controller");

router.get("/get/allBookingByUserDB",  get_booking_db_by_userID);

module.exports = router;