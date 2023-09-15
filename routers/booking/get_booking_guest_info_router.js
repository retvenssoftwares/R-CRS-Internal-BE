const express = require("express");
const router = express.Router();

const  get_guest_details   = require("../../controllers/booking/get_booking_guest_details");

router.get("/retvens/frmCustomerSearch.aspx",  get_guest_details.getdata);
router.post("/post/retvens/frmCustomerSearch.aspx",  get_guest_details.postdata);

module.exports = router;