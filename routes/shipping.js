const express = require("express");
const router = express.Router();
const ShippingController = require("../controllers/ShippingController");

router.get("/provinces", ShippingController.getProvinces);
router.get("/cities", ShippingController.getCities);

module.exports = router;
