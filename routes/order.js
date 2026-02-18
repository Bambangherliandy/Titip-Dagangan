const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const AuthorizationSeller = require("../middlewares/authorizationSeller");

router.get("/orders/cities", OrderController.getCities);
router.get(
  "/orders/shipping-cost",

  OrderController.getShippingCost
);
router.post("/orders/checkout", OrderController.checkout);
router.get("/orders", OrderController.list);
router.get("/orders/:id", OrderController.detail);
router.put(
  "/orders/:id/status",
  AuthorizationSeller,
  OrderController.updateStatus
);

module.exports = router;
