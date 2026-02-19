"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Seller, { foreignKey: "seller_id" });
      Product.belongsTo(models.Category, { foreignKey: "category_id" });
      Product.hasMany(models.CartItem, { foreignKey: "product_id" });
      Product.hasMany(models.OrderItem, { foreignKey: "product_id" });
    }
  }
  Product.init(
    {
      seller_id: DataTypes.INTEGER,
      category_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      weight: DataTypes.INTEGER,
      commission_percentage: DataTypes.INTEGER,
      status: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
