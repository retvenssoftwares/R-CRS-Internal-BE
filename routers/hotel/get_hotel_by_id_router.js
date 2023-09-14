const express = require("express");
const router = express.Router();

const {get_hotel_by_id}   = require("../../controllers/hotel/get_hotel_by_id");

router.get("/get/hotelById/:hotel_id/:check_in_date/:check_out_date",  get_hotel_by_id);

module.exports = router;