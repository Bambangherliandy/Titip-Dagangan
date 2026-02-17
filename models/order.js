'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    BuyerId: DataTypes.INTEGER,
    totalprice: DataTypes.INTEGER,
    shippingcost: DataTypes.INTEGER,
    grandtotal: DataTypes.INTEGER,
    status: DataTypes.STRING,
    paymentstatus: DataTypes.STRING,
    paymentmethod: DataTypes.STRING,
    shippingaddress: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};