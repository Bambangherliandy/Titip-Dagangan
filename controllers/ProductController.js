const { Product } = require("../models");
const slugify = require("slugify");

class ProductController {
  static async create(req, res, next) {
    try {
      const { id: seller_id } = req.seller;
      const {
        category_id,
        name,
        description,
        price,
        stock,
        weight,
        commission_percentage,
      } = req.body;

      if (!name) throw { name: "BadRequest", message: "Name is required" };
      if (price == null)
        throw { name: "BadRequest", message: "Price is required" };
      if (stock == null)
        throw { name: "BadRequest", message: "Stock is required" };
      if (!category_id)
        throw { name: "BadRequest", message: "Category is required" };

      const slug = slugify(name, { lower: true, strict: true });

      const product = await Product.create({
        seller_id,
        category_id,
        name,
        slug,
        description,
        price,
        stock,
        weight,
        commission_percentage,
        status: "active",
      });

      res.status(201).json({
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { id: seller_id } = req.seller;
      const {
        category_id,
        name,
        description,
        price,
        stock,
        weight,
        commission_percentage,
      } = req.body;

      const product = await Product.findOne({ where: { id, seller_id } });
      if (!product) throw { name: "NotFound", message: "Product not found" };

      const slug = name
        ? slugify(name, { lower: true, strict: true })
        : product.slug;

      await product.update({
        category_id: category_id ?? product.category_id,
        name: name ?? product.name,
        slug,
        description: description ?? product.description,
        price: price ?? product.price,
        stock: stock ?? product.stock,
        weight: weight ?? product.weight,
        commission_percentage:
          commission_percentage ?? product.commission_percentage,
      });

      res.status(200).json({
        message: "Product updated successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const { id: seller_id } = req.seller;

      const product = await Product.findOne({ where: { id, seller_id } });
      if (!product) throw { name: "NotFound", message: "Product not found" };

      await product.update({ status: "inactive" });

      res.status(200).json({
        message: "Product deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;
