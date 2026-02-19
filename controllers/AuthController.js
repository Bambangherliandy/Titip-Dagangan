const { User } = require("../models");
const { comparePass } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthController {
  static async register(req, res, next) {
    try {
      const { name, email, password, role, phone, address, city_id } = req.body;

      if (!name) throw { name: "BadRequest", message: "Name is required" };
      if (!email) throw { name: "BadRequest", message: "Email is required" };
      if (!password)
        throw { name: "BadRequest", message: "Password is required" };

      const newUser = await User.create({
        name,
        email,
        password,
        role,
        phone,
        address,
        city_id,
      });

      res.status(201).json({
        message: "Register success",
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          address: newUser.address,
          city_id: newUser.city_id,
          role: newUser.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw { name: "BadRequest", message: "Invalid E-mail / Password" };
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw { name: "BadRequest", message: "Invalid E-mail / Password" };
      }

      const isPasswordValid = comparePass(password, user.password);
      if (!isPasswordValid) {
        throw { name: "Unauthorized", message: "Invalid E-mail / Password" };
      }

      const access_token = signToken({ id: user.id, email: user.email });

      res.status(200).json({
        message: "Login success",
        data: { access_token },
      });
    } catch (error) {
      next(error);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const { googleToken } = req.body;

      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { email, name } = payload;

      // cari user, kalau tidak ada buat baru
      let user = await User.findOne({ where: { email } });
      if (!user) {
        user = await User.create({
          name,
          email,
          password: Math.random().toString(36), // random password
          role: "user",
        });
      }

      const access_token = signToken({ id: user.id, email: user.email });

      res.status(200).json({
        message: "Login success",
        data: { access_token, role: user.role },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
