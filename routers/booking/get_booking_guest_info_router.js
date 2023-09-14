const express = require("express");
const router = express.Router();

const  get_guest_details   = require("../../controllers/booking/get_booking_guest_details");

router.get("/retvens/frmCustomerSearch.aspx",  get_guest_details);

module.exports = router;