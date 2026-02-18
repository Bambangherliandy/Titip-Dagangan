const { Seller } = require("../models");

class SellerController {
  static async register(req, res, next) {
    try {
      const { id: user_id } = req.user;
      const { store_name, store_description, store_address, city_id } =
        req.body;

      const existingSeller = await Seller.findOne({ where: { user_id } });
      if (existingSeller) {
        throw { name: "BadRequest", message: "You already have a store" };
      }

      if (!store_name) {
        throw { name: "BadRequest", message: "Store name is required" };
      }
      if (!store_address) {
        throw { name: "BadRequest", message: "Store address is required" };
      }

      const seller = await Seller.create({
        user_id,
        store_name,
        store_description,
        store_address,
        balance: 0,
        status: "active",
        city_id,
      });

      res.status(201).json({
        message: "Store registered successfully",
        data: seller,
      });
    } catch (error) {
      console.log("error:", error);

      next(error);
    }
  }

  static async profile(req, res, next) {
    try {
      const { id: user_id } = req.user;

      const seller = await Seller.findOne({
        where: { user_id },
        include: ["Products"],
      });

      if (!seller) {
        throw { name: "NotFound", message: "Store not found" };
      }

      res.status(200).json({
        data: seller,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id: user_id } = req.user;
      const { store_name, store_description, store_address, city_id } =
        req.body;

      const seller = await Seller.findOne({ where: { user_id } });

      if (!seller) {
        throw { name: "NotFound", message: "Store not found" };
      }

      await seller.update({
        store_name: store_name || seller.store_name,
        store_description: store_description || seller.store_description,
        store_address: store_address || seller.store_address,
      });

      res.status(200).json({
        message: "Store updated successfully",
        data: seller,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SellerController;
