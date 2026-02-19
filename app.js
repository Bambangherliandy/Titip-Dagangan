// app.js
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const cors = require("cors"); // ← tambahkan ini
const router = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const app = express();

app.use(cors()); // ← tambahkan ini, sebelum routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);
router.use(errorHandler);

module.exports = app;
