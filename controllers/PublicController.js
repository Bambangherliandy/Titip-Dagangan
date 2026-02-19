const { Product, Category, Seller, ProductImage } = require("../models");

class PublicController {
  static async list(req, res, next) {
    try {
      const { search, category_id } = req.query;

      const where = { status: "active" };
      if (category_id) where.category_id = category_id;

      if (search) {
        const { Op } = require("sequelize");
        where.name = { [Op.iLike]: `%${search}%` };
      }

      const products = await Product.findAll({
        where,
        include: [
          { model: Category, attributes: ["id", "name"] },
          { model: Seller, attributes: ["id", "store_name"] },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({ data: products });
    } catch (error) {
      next(error);
    }
  }

  static async detail(req, res, next) {
    try {
      const { id } = req.params;

      const product = await Product.findOne({
        where: { id, status: "active" },
        include: [
          { model: Category, attributes: ["id", "name"] },
          { model: Seller, attributes: ["id", "store_name", "store_address"] },
        ],
      });

      if (!product) throw { name: "NotFound", message: "Product not found" };

      res.status(200).json({ data: product });
    } catch (error) {
      next(error);
    }
  }

  static async listCategory(req, res, next) {
    try {
      const categories = await Category.findAll({
        order: [["name", "ASC"]],
      });

      res.status(200).json({ data: categories });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PublicController;
