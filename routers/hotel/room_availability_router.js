const express = require("express");
const router = express.Router();

const { room_availability  } = require("../../controllers/hotel/room_availability_controller");

router.get("/get/roomAvailablity",  room_availability);

module.exports = router;