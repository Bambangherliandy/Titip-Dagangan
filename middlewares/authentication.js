const { verifyToken } = require("../helpers/jwt");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw { name: "Unauthorized" };

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    if (!payload) throw { name: "Unauthorized" };

    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};
