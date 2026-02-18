"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.Product, { foreignKey: "product_id" });
      Review.belongsTo(models.User, { foreignKey: "buyer_id" });
    }
  }
  Review.init(
    {
      product_id: DataTypes.INTEGER,
      buyer_id: DataTypes.INTEGER,
      rating: DataTypes.INTEGER,
      comment: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
