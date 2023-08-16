const express = require("express");
const router = express.Router();

const { get_hotel_info  } = require("../controllers/get_hotel_information_controller");

router.get("/get/hotelInfo",  get_hotel_info);

module.exports = router;