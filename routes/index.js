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
const withdrawlRouter = require("./withdrawl");
const shippingRouter = require("./shipping");
const paymentRouter = require("./payment");
const chatRoute = require("./chat");

const authentication = require("../middlewares/authentication");
const { Chat } = require("openai/resources.js");

router.get("/", (req, res) => {
  res.redirect("/pub/products");
});

//public
router.use("/pub", publicRouter);
router.use("/chat", chatRoute);
router.use("/auth", authRouter);
router.use("/shipping", shippingRouter);
router.use("/payment", paymentRouter);

router.get("/favicon.ico", (req, res) => res.status(204).end());
//private
router.use(authentication);

router.use("/user", userRouter);
router.use("/seller", sellerRouter);
router.use("/products", productRouter);
router.use("/category", categoryRouter);
router.use("/cart", cartRouter);
router.use("/orders", orderRouter);
router.use("/withdraw", withdrawlRouter);
router.use("/cities", withdrawlRouter);

module.exports = router;
