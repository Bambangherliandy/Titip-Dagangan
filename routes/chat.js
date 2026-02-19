const express = require("express");
const router = express.Router();
const ChatController = require("../controllers/ChatController");

router.post("/", ChatController.chat);

module.exports = router;
