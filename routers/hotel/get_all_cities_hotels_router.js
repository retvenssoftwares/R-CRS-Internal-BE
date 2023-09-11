const express = require("express");
const router = express.Router();

const allcity = require("../../controllers/hotel/get_all_cities_hotels");

router.get("/get/hotel_city",  allcity.city);
router.get("/get/hotel_by_city",  allcity.hotel_city);

module.exports = router;