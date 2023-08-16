const express = require("express");
const router = express.Router();

const { create_hotel  } = require("../controllers/hotel_controller_controller");

router.post("/add/hotel",  create_hotel);

module.exports = router;