const bcrypt = require("bcryptjs");

function hashPass(password) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

function comparePass(value, value2) {
  let password = bcrypt.compareSync(value, value2);
  return password;
}

module.exports = { hashPass, comparePass };
