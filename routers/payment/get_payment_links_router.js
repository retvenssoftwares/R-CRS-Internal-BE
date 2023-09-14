const express = require("express");
const router = express.Router();

const { send_payment_link_controller  } = require("../../controllers/payment/get_payment_links_controller");

router.get("/create/paymentLink", send_payment_link_controller);

module.exports = router;
