const express = require("express");
const router = express.Router();

const loginuser = require("../../controllers/user/sign_up");

//ADMIN
router.post("/create/user", loginuser.sign_up);
router.post("/login/user", loginuser.login);
router.delete('/delete_employee',loginuser.delete_employee)

module.exports = router;
