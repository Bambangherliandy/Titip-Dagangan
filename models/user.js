"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Seller, { foreignKey: "user_id" });
      User.hasMany(models.Cart, { foreignKey: "user_id" });
      User.hasMany(models.Order, { foreignKey: "buyer_id" });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: {
        defaultValue: "buyer",
        type: DataTypes.STRING,
      },
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      city_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate(ins) {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(ins.password, salt);
          ins.password = hash;
        },
      },
    }
  );
  return User;
};
