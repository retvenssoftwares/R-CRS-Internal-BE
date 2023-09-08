const express = require("express");
const router = express.Router();

const get_room_db   = require("../../controllers/hotel/add_room_details");

router.patch("/get/roomDB/:hotel_id",  get_room_db);

module.exports = router;