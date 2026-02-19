const express = require("express");
const router = express.Router();
const SellerController = require("../controllers/SellerController");
const authorizationSeller = require("../middlewares/authorizationSeller");
const OrderController = require("../controllers/OrderController");

router.post("/register", SellerController.register);
router.get("/profile", authorizationSeller, SellerController.profile);
router.put("/profile", authorizationSeller, SellerController.update);
router.get("/orders", authorizationSeller, OrderController.sellerOrders);

module.exports = router;
