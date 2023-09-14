const express = require("express");
const router = express.Router();

<<<<<<< HEAD
const { send_payment_link_cont  } = require("../../controllers/payment/get_payment_links_controller");
=======
const { send_payment_link_controller  } = require("../../controllers/payment/get_payment_links_controller");
>>>>>>> d9676c2c434fa6d7086586618010c17f7ac52680

router.get("/paymentLink", send_payment_link_cont);

module.exports = router;
