const express = require("express");
const router = express.Router();

const { get_room_type  } = require("../controllers/get_room_type_controller");

router.get("/get/roomType",  get_room_type);

module.exports = router;