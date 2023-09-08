const express = require("express");
const router = express.Router();

const  retreive_room_info   = require("../../controllers/hotel/room_information_controller");

router.get("/get/roomInfo",  retreive_room_info);

module.exports = router;