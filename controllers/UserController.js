const { User } = require("../models");

class UserController {
  // GET /user/profile
  static async profile(req, res, next) {
    try {
      const { id } = req.user;

      const user = await User.findByPk(id, {
        attributes: { exclude: ["password"] },
      });

      if (!user) throw { name: "NotFound", message: "User not found" };

      res.status(200).json({ data: user });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.user;
      const { name, phone, address, city_id } = req.body;

      const user = await User.findByPk(id);
      if (!user) throw { name: "NotFound", message: "User not found" };

      await user.update({
        name,
        phone,
        address,
        city_id,
      });

      const updatedUser = await User.findByPk(id, {
        attributes: { exclude: ["password"] },
      });

      res.status(200).json({
        message: "Profile updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
