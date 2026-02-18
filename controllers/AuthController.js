const { User } = require("../models");
const { comparePass } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

class AuthController {
  static async register(req, res, next) {
    try {
      const { name, email, password, Role, phone, address } = req.body;
      let newUser = await User.create({
        name,
        email,
        password,
        Role,
        phone,
        address,
      });

      console.log(newUser);

      res.status(201).json({
        status: "Success Register User",
        data: {
          email: newUser.email,
          phone: newUser.phone,
          address: newUser.address,
        },
      });
    } catch (error) {
      console.log(error);

      next(error);
    }
  }
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw {
          name: "BadRequest",
          message: "Invalid E-mail / Password",
        };
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw {
          name: "BadRequest",
          message: "Invalid E-mail / Password",
        };
      }

      let isPasswordValid = comparePass(password, user.password);

      if (!isPasswordValid) {
        throw {
          name: "Unauthorized",
          message: "Invalid E-mail / Password",
        };
      }

      const access_token = signToken({ id: user.id, email: user.email });

      res.status(200).json({
        status: "Success",
        data: { access_token },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
