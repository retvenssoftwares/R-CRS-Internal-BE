const express = require("express");
const router = express.Router();

const { retreive_room_rate  } = require("../../controllers/hotel/room_rate_controller");

router.get("/get/roomRates",  retreive_room_rate);

module.exports = router;