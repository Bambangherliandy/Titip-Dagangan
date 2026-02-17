"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Seller extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Seller.belongsTo(models.User, { foreignKey: "user_id" });
      Seller.hasMany(models.Product, { foreignKey: "seller_id" });
      Seller.hasMany(models.OrderItem, { foreignKey: "seller_id" });
      Seller.hasMany(models.Withdrawal, { foreignKey: "seller_id" });
    }
  }
  Seller.init(
    {
      user_id: DataTypes.INTEGER,
      store_name: DataTypes.STRING,
      store_description: DataTypes.TEXT,
      store_address: DataTypes.STRING,
      balance: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Seller",
    }
  );
  return Seller;
};
