const express = require("express");
const router = express.Router();

const { get_amenities  } = require("../controllers/get_ameneties_controller");

router.get("/get/amenities",  get_amenities);

module.exports = router;