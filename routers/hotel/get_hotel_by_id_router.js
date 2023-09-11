const express = require("express");
const router = express.Router();

const {get_hotel_by_id}   = require("../../controllers/hotel/get_hotel_by_id");

router.get("/get/hotelById/:hotel_id",  get_hotel_by_id);

module.exports = router;