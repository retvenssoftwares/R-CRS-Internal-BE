const express = require("express");
const router = express.Router();

const call_details = require("../../controllers/user/call_deatils");

//ADMIN
router.post("/addcall",  call_details);


module.exports = router;