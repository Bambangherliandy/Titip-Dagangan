const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const AuthorizationSeller = require("../middlewares/authorizationSeller");

router.get("/cities", OrderController.getCities);
router.get(
  "/shipping-cost",

  OrderController.getShippingCost
);
router.post("/checkout", OrderController.checkout);
router.get("/", OrderController.list);
router.get("/:id", OrderController.detail);
router.put("/:id/status", AuthorizationSeller, OrderController.updateStatus);

module.exports = router;
