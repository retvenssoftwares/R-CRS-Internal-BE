const express = require("express");
const router = express.Router();

const { retreive_inventory  } = require("../controllers/room_inventory_controller");

router.get("/get/roomInventory",  retreive_inventory);

module.exports = router;