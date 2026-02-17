"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: "buyer_id" });
      Order.hasMany(models.OrderItem, { foreignKey: "buyer_id" });
    }
  }
  Order.init(
    {
      buyer_id: DataTypes.INTEGER,
      total_price: DataTypes.INTEGER,
      shipping_cost: DataTypes.INTEGER,
      grand_total: DataTypes.INTEGER,
      status: DataTypes.STRING,
      payment_status: DataTypes.STRING,
      payment_method: DataTypes.STRING,
      shipping_address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
