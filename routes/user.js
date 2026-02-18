const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.get("/profile", UserController.profile);
router.put("/profile", UserController.update);

module.exports = router;
