const express = require("express");
const router = express.Router();

const emp_call_details = require("../../controllers/user/employee_call_details");

//ADMIN
router.get("/all_employee",emp_call_details.get_all_employee)
router.get("/employee_call_details/:employee_id", emp_call_details);
//router.get("/employee_call_details_by_date", emp_call_details.get_all_calls);
router.post("/role_wise_guest_details", emp_call_details.get_guest_booking_by_role_emp_id)
router.post("/role_wise_calls_details", emp_call_details.get_call_by_role_emp_id)
router.post("/call_history",emp_call_details.call_history)
router.get("/get_employee_call_details_by_emp_id",emp_call_details.get_employee_calls)
router.get("/get_weekend_call_details",emp_call_details.total_calls_in_week_by_employee)
router.get("/get_top_five_employee_call",emp_call_details.findTopFiveEmployees)
router.get("/get_top_five_employee_booking",emp_call_details.findTopFiveBookingByEmployees)
router.get("/get_weekend_booking_details",emp_call_details.total_booking_in_week_by_employee)
//router.get("/testing",emp_call_details.testing)
module.exports = router;
