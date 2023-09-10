const express = require("express");
const router = express.Router();

const get_hotel_db   = require("../../controllers/hotel/get_newly_added_hotels");

router.get("/get/newHotels",  get_hotel_db);

module.exports = router;