const express = require("express");
const router = express.Router();

const get_hotel_reports = require("../../controllers/hotel/get_hotel_reports");

router.get("/get/hotelreports",  get_hotel_reports);

module.exports = router;