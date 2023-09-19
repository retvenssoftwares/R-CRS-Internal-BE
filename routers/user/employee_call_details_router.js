const express = require("express");
const router = express.Router();

const emp_call_details = require("../../controllers/user/employee_call_details");

//ADMIN
router.get("/employee_call_details/:employee_id", emp_call_details);
router.post("/role_wise_guest_details", emp_call_details.get_guest_booking_by_role_emp_id)


module.exports = router;
