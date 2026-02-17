const jwt = require("jsonwebtoken");
const secretkey = process.env.JWT_SECRET_KEY;

function signToken(payload) {
  return jwt.sign(payload, secretkey);
}

function verifyToken(token) {
  try {
    return jwt.verify(token, secretkey);
  } catch (error) {
    return null;
  }
}

module.exports = { signToken, verifyToken };
