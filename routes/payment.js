const express = require("express");
const PaymentController = require("../controllers/PaymentController");
const authentication = require("../middlewares/authentication");
const router = express.Router();

router.post("/notification", PaymentController.handleNotification);

router.post(
  "/create-transaction",
  authentication,
  PaymentController.createTransaction
);

module.exports = router;
