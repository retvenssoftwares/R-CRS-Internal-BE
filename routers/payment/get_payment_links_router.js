const express = require("express");
const router = express.Router();

const { send_payment_link_cont  } = require("../../controllers/payment/get_payment_links_controller");

router.get("/paymentLink", send_payment_link_cont);

module.exports = router;
