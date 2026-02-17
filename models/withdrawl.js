'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Withdrawl extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Withdrawl.init({
    SellerId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    bankName: DataTypes.STRING,
    accountNumber: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Withdrawl',
  });
  return Withdrawl;
};