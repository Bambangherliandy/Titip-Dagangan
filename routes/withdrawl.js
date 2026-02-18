const express = require("express");
const router = express.Router();
const WithdrawlController = require("../controllers/WithdrawlController");

router.post("/", WithdrawlController.create);
router.get("/history", WithdrawlController.history);

module.exports = router;
