const { Review, Product, User, OrderItem } = require("../models");

class ReviewController {
  static async create(req, res, next) {
    try {
      const { id: buyer_id } = req.user;
      const { product_id } = req.params;
      const { rating, comment } = req.body;

      if (!rating) throw { name: "BadRequest", message: "Rating is required" };
      if (rating < 1 || rating > 5)
        throw { name: "BadRequest", message: "Rating must be between 1 and 5" };
      if (!comment)
        throw { name: "BadRequest", message: "Comment is required" };

      const product = await Product.findByPk(product_id);
      if (!product) throw { name: "NotFound", message: "Product not found" };

      const hasPurchased = await OrderItem.findOne({
        where: { buyer_id, product_id },
      });
      if (!hasPurchased) {
        throw {
          name: "Forbidden",
          message: "You can only review products you have purchased",
        };
      }

      const existingReview = await Review.findOne({
        where: { buyer_id, product_id },
      });
      if (existingReview) {
        throw {
          name: "BadRequest",
          message: "You have already reviewed this product",
        };
      }

      const review = await Review.create({
        buyer_id,
        product_id,
        rating,
        comment,
      });

      res.status(201).json({
        message: "Review created successfully",
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }

  static async listByProduct(req, res, next) {
    try {
      const { product_id } = req.params;

      const product = await Product.findByPk(product_id);
      if (!product) throw { name: "NotFound", message: "Product not found" };

      const reviews = await Review.findAll({
        where: { product_id },
        include: [
          {
            model: User,
            attributes: ["id", "name"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      const averageRating =
        reviews.length > 0
          ? (
              reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            ).toFixed(1)
          : 0;

      res.status(200).json({
        data: {
          product_id,
          total_reviews: reviews.length,
          average_rating: parseFloat(averageRating),
          reviews,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReviewController;
