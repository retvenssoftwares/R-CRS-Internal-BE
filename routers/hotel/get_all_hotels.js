const express = require("express");
const router = express.Router();

const get_hotel = require("../../controllers/hotel/get_all_hotels");

router.get("/get/hotels",  get_hotel);

module.exports = router;