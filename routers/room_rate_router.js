const express = require("express");
const router = express.Router();

const { retreive_room_rate  } = require("../controllers/room_rate_controller");

router.get("/get/roomRates",  retreive_room_rate);

module.exports = router;