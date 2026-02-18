const { Category } = require("../models");

class CategoryController {
  static async list(req, res, next) {
    try {
      const categories = await Category.findAll({
        order: [["name", "ASC"]],
      });

      res.status(200).json({
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { name } = req.body;

      if (!name)
        throw { name: "BadRequest", message: "Category name is required" };

      const existingCategory = await Category.findOne({ where: { name } });
      if (existingCategory) {
        throw { name: "BadRequest", message: "Category already exists" };
      }

      const category = await Category.create({ name });

      res.status(201).json({
        message: "Category created successfully",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);
      if (!category) throw { name: "NotFound", message: "Category not found" };

      await category.destroy();

      res.status(200).json({
        message: "Category deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
