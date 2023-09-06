const express = require("express");
const router = express.Router();

const { get_payment_link_by_orderID_controller  } = require("../../controllers/payment/get_payment_links_by_orderID");

router.get("/get/check-payment-status/:orderId", get_payment_link_by_orderID_controller);

module.exports = router;
