const express = require("express");
const PaymentController = require("../Controller/paymentController");
const router = express.Router();
router.post("/order", PaymentController.createPayment);
router.post("/verify", PaymentController.verifypayment);

module.exports = router;
