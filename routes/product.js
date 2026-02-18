const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const authorizationSeller = require("../middlewares/authorizationSeller");

router.post("/", authorizationSeller, ProductController.create);
router.put("/:id", authorizationSeller, ProductController.update);
router.delete("/:id", authorizationSeller, ProductController.delete);

module.exports = router;
