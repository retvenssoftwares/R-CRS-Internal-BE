const express = require("express");
const router = express.Router();

const  top_5   = require("../../controllers/booking/get_top_5_booking");

router.get("/get/top_five_booking",  top_5.findTopFiveEmployees);

module.exports = router;