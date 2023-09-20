const express = require("express");
const router = express.Router();

const emp_call_details = require("../../controllers/user/employee_call_details");

//ADMIN
router.get("/employee_call_details/:employee_id", emp_call_details);
router.post("/role_wise_guest_details", emp_call_details.get_guest_booking_by_role_emp_id)
router.post("/role_wise_calls_details", emp_call_details.get_call_by_role_emp_id)
router.get("/get_employee_call_details_by_emp_id/:employeeId",emp_call_details.get_employee_calls)
router.get("/get_weekend_call_details/:employeeId",emp_call_details.total_calls_in_week_by_employee)
router.get("/get_top_five_employee_call",emp_call_details.findTopFiveEmployees)

module.exports = router;
