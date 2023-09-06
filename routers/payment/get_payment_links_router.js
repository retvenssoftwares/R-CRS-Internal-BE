const express = require("express");
const router = express.Router();

const { send_payment_link_controller  } = require("../../controllers/payment/send_payment_link_controller");

router.get("/create/paymentLink", send_payment_link_controller);

module.exports = router;
