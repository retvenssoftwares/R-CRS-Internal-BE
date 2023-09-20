const express = require("express");
const router = express.Router();

const call_details = require("../../controllers/user/call_deatils");

//ADMIN
router.post("/addcall",  call_details.post_call_details);
router.get("/get_call_collection",call_details.get_call_collection)

router.post('/get_all_details/:type_of_call', call_details.get_call_details)
// Route for finding records by guest_mobile
router.get("/call_details/:guest_mobile?/:date?/:hotel_name?/:disposition?", call_details.getCallDetails_by_guest_mobile_number);

// Route for finding records by date
router.get('/get_info_by_date/:date', call_details.get_details_by_date);

// Route for finding records by hotel_name
router.get('/get_info_by_hotel_name/:hotel_name', call_details.get_details_by_hotel_name);

// Route for finding records by disposition
router.get('/get_info_disposition/:disposition', call_details.get_details_by_disposition );


module.exports = router;