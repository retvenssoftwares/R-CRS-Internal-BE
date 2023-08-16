const express = require("express");
const router = express.Router();

const { get_transaction  } = require("../controllers/get_transaction_controller");

router.get("/get/transaction",  get_transaction);

module.exports = router;