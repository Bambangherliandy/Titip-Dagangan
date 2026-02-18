const express = require("express");
const router = express.Router();

const publicRouter = require("./public");
const authRouter = require("./auth");
const userRouter = require("./user");
const sellerRouter = require("./seller");
const productRouter = require("./product");
const categoryRouter = require("./category");
const cartRouter = require("./cart");
const orderRouter = require("./order");
const reviewRouter = require("./review");
const withdrawlRouter = require("./withdrawl");
const shippingRouter = require("./shipping");

const authentication = require("../middlewares/authentication");

router.get("/", (req, res) => {
  res.redirect("/pub/products");
});

//public
router.use("/pub", publicRouter);
router.use("/auth", authRouter);

//private
router.use(authentication);

router.use("/user", userRouter);
router.use("/seller", sellerRouter);
router.use("/products", productRouter);
router.use("/category", categoryRouter);
router.use("/cart", cartRouter);
router.use("/orders", orderRouter);
router.use("/reviews", reviewRouter);
router.use("/withdraw", withdrawlRouter);
router.use("/cities", withdrawlRouter);
router.use("/shipping", shippingRouter);

module.exports = router;
