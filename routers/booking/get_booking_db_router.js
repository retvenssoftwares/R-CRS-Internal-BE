const express = require("express");
const router = express.Router();

const  get_booking_db   = require("../../controllers/booking/get_booking_db_controller");

router.get("/get/allBookingDB",  get_booking_db);

module.exports = router;