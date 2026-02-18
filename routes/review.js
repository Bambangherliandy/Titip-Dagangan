const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/ReviewController");

router.post("/:productId", ReviewController.create);
router.get("/:productId", ReviewController.listByProduct);

module.exports = router;
