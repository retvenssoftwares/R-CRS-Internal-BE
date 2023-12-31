const express = require("express");
const router = express.Router();

const call_details_date = require("../../controllers/user/call_details_by_date");

//ADMIN
//router.get("/getcall/:date",  call_details_date.get_all_calls);
router.get("/getdisposition/:date",  call_details_date.get_disposition);
router.get('/getall_calls',call_details_date.get_calls)
router.get("/call_history",call_details_date.get_inbound_calls_and_outbounds_callDetails)
//router.get("/total_out_bounds_calls",call_details_date.get_outbound_calls)
router.get("/get_calls_summary",call_details_date.get_calls_summary)
router.get("/agent_summary",call_details_date.get_agent_summary)
router.get('/top_5_disposition',call_details_date.getTop5Dispositions)
router.get('/get_weekend_call_details',call_details_date.total_calls_in_week)

module.exports = router;