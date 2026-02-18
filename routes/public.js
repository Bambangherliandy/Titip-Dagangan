const express = require("express");
const PublicController = require("../controllers/PublicController");

const router = express.Router();

router.get("/products", PublicController.list);
router.get("/products/:id", PublicController.detail);

router.get("/categories", PublicController.listCategory);

module.exports = router;
