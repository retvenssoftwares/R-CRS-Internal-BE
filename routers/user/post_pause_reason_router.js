const express = require("express");
const router = express.Router();

const pause_reason = require("../../controllers/user/post_pause_reason");

router.post("/pause_reason", pause_reason.call_pause);

module.exports = router;