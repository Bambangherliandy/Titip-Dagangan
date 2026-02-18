const express = require("express");
const CartController = require("../controllers/CartController");
const router = express.Router();

router.get("/", CartController.viewCart);
router.post("/add", CartController.addToCart);
router.delete("/remove/:id", CartController.removeItem);
router.delete("/clear", CartController.clearCart);

module.exports = router;
