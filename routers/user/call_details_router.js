const express = require("express");
const router = express.Router();

const call_details = require("../../controllers/user/call_deatils");

//ADMIN
router.post("/addcall",  call_details.post_call_details);

router.post('/get_all_details/:type_of_call', call_details.get_call_details)
router.get('/get_info/:guest_mobile_number',call_details.getCallDetailsByMobileNumber)
module.exports = router;