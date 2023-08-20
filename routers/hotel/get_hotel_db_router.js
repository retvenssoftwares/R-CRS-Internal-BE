const express = require("express");
const router = express.Router();

const { get_hotel_db  } = require("../../controllers/hotel/get_hotels_db_controller");

router.get("/get/hotelDB",  get_hotel_db);

module.exports = router;