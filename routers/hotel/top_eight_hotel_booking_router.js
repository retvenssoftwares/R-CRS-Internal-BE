const express = require("express");
const router = express.Router();

const  top_hotel  = require("../../controllers/hotel/top_eight_hotel_booking");

router.get("/get/top_eight_hotels_booking",  top_hotel);

module.exports = router;