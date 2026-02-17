"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrderItem.belongsTo(models.Product, { foreignKey: "product_id" });
      OrderItem.belongsTo(models.Seller, { foreignKey: "seller_id" });
      OrderItem.belongsTo(models.User, { foreignKey: "buyer_id" });
    }
  }
  OrderItem.init(
    {
      buyer_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      seller_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      commission_amount: DataTypes.INTEGER,
      seller_income: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "OrderItem",
    }
  );

  return OrderItem;
};
