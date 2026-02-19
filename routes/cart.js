const express = require("express");
const CartController = require("../controllers/CartController");
const router = express.Router();

router.get("/", CartController.viewCart);
router.post("/", CartController.addToCart);
router.delete("/clear", CartController.clearCart);
router.delete("/:id", CartController.removeItem);

module.exports = router;
