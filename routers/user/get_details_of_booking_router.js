const express = require("express");
const router = express.Router();

const datahotel = require("../../controllers/user/get_details_of_booking");

router.get("/get/booking_details/:booking_id", datahotel.get_booking);
router.get("/get/booking_statistics", datahotel.confirm_booking);


module.exports = router;