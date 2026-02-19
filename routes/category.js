const express = require("express");
const CategoryController = require("../controllers/CategoryController");
const router = express.Router();

router.get("/", CategoryController.list);
router.post("/", CategoryController.create);
router.delete("/:id", CategoryController.delete);

module.exports = router;
