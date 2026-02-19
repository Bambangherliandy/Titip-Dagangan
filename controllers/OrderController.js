const {
  Order,
  OrderItem,
  Cart,
  CartItem,
  Product,
  Seller,
} = require("../models");
const axios = require("axios");

const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY;
const RAJAONGKIR_BASE_URL = process.env.RAJAONGKIR_BASE_URL;

class OrderController {
  static async calculateShippingCost(origin, destination, weight, courier) {
    const response = await axios.post(
      `${RAJAONGKIR_BASE_URL}/calculate/domestic-cost`,
      { origin, destination, weight, courier },
      {
        headers: {
          key: RAJAONGKIR_API_KEY,
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = response.data?.data;
    if (!data || data.length === 0) {
      throw {
        name: "BadRequest",
        message: "Shipping cost not available for this route",
      };
    }

    return data;
  }

  static async getCities(req, res, next) {
    try {
      const { province_id } = req.query;

      const url = province_id
        ? `${RAJAONGKIR_BASE_URL}/destination/city/${province_id}`
        : `${RAJAONGKIR_BASE_URL}/destination/province`;

      const response = await axios.get(url, {
        headers: { key: RAJAONGKIR_API_KEY, Accept: "application/json" },
      });

      res.status(200).json({ data: response.data?.data });
    } catch (error) {
      next(error);
    }
  }

  static async getShippingCost(req, res, next) {
    try {
      const { origin, destination, courier } = req.query;
      const { id: user_id } = req.user;

      if (!origin) throw { name: "BadRequest", message: "Origin is required" };
      if (!destination)
        throw { name: "BadRequest", message: "Destination is required" };
      if (!courier)
        throw { name: "BadRequest", message: "Courier is required" };

      // Hitung total weight dari cart
      const cart = await Cart.findOne({ where: { user_id } });
      if (!cart) throw { name: "NotFound", message: "Cart not found" };

      const cartItems = await CartItem.findAll({
        where: { cart_id: cart.id },
        include: [{ model: Product, attributes: ["weight"] }],
      });

      if (cartItems.length === 0) {
        throw { name: "BadRequest", message: "Cart is empty" };
      }

      const totalWeight = cartItems.reduce(
        (sum, item) => sum + item.quantity * item.Product.weight,
        0
      );

      const costs = await OrderController.calculateShippingCost(
        origin,
        destination,
        totalWeight,
        courier
      );

      res.status(200).json({
        data: {
          courier,
          origin,
          destination,
          weight: totalWeight,
          services: costs,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async checkout(req, res, next) {
    try {
      const { id: buyer_id } = req.user;
      const {
        shipping_address,
        payment_method,
        courier,
        courier_service,
        origin,
        destination,
      } = req.body;

      if (!shipping_address)
        throw { name: "BadRequest", message: "Shipping address is required" };
      if (!payment_method)
        throw { name: "BadRequest", message: "Payment method is required" };
      if (!courier)
        throw { name: "BadRequest", message: "Courier is required" };
      if (!courier_service)
        throw { name: "BadRequest", message: "Courier service is required" };
      if (!origin) throw { name: "BadRequest", message: "Origin is required" };
      if (!destination)
        throw { name: "BadRequest", message: "Destination is required" };

      const cart = await Cart.findOne({ where: { user_id: buyer_id } });
      if (!cart) throw { name: "NotFound", message: "Cart not found" };

      const cartItems = await CartItem.findAll({
        where: { cart_id: cart.id },
        include: [
          {
            model: Product,
            attributes: [
              "id",
              "name",
              "price",
              "stock",
              "weight",
              "seller_id",
              "commission_percentage",
              "status",
            ],
          },
        ],
      });

      if (cartItems.length === 0)
        throw { name: "BadRequest", message: "Cart is empty" };

      for (const item of cartItems) {
        if (item.Product.status !== "active") {
          throw {
            name: "BadRequest",
            message: `Product ${item.Product.name} is no longer available`,
          };
        }
        if (item.Product.stock < item.quantity) {
          throw {
            name: "BadRequest",
            message: `Insufficient stock for ${item.Product.name}`,
          };
        }
      }

      const totalWeight = cartItems.reduce(
        (sum, item) => sum + item.quantity * item.Product.weight,
        0
      );

      const costs = await OrderController.calculateShippingCost(
        origin,
        destination,
        totalWeight,
        courier
      );

      const selectedService = costs.find(
        (c) => c.service.toUpperCase() === courier_service.toUpperCase()
      );
      if (!selectedService) {
        throw {
          name: "BadRequest",
          message: `Service ${courier_service} not available`,
        };
      }

      const shipping_cost = selectedService.cost;

      const total_price = cartItems.reduce(
        (sum, item) => sum + item.quantity * item.Product.price,
        0
      );

      const grand_total = total_price + shipping_cost;

      const order = await Order.create({
        buyer_id,
        total_price,
        shipping_cost,
        grand_total,
        status: "pending",
        payment_status: "unpaid",
        payment_method,
        shipping_address,
      });

      const orderItemsData = cartItems.map((item) => {
        const commission_amount = Math.floor(
          (item.Product.commission_percentage / 100) *
            item.Product.price *
            item.quantity
        );
        const seller_income =
          item.Product.price * item.quantity - commission_amount;

        return {
          order_id: order.id,
          buyer_id,
          product_id: item.Product.id,
          seller_id: item.Product.seller_id,
          quantity: item.quantity,
          price: item.Product.price,
          commission_amount,
          seller_income,
        };
      });

      await OrderItem.bulkCreate(orderItemsData);

      for (const item of cartItems) {
        await Product.decrement("stock", {
          by: item.quantity,
          where: { id: item.Product.id },
        });
      }

      await CartItem.destroy({ where: { cart_id: cart.id } });

      res.status(201).json({
        message: "Order created successfully",
        data: {
          order_id: order.id,
          total_price,
          shipping_cost,
          grand_total,
          status: order.status,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async list(req, res, next) {
    try {
      const { id: buyer_id } = req.user;

      const orders = await Order.findAll({
        where: { buyer_id },
        include: [
          {
            model: OrderItem,
            foreignKey: "buyer_id",
            include: [{ model: Product, attributes: ["id", "name", "price"] }],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({ data: orders });
    } catch (error) {
      next(error);
    }
  }

  static async detail(req, res, next) {
    try {
      const { id: buyer_id } = req.user;
      const { id } = req.params;

      const order = await Order.findOne({
        where: { id, buyer_id },
        include: [
          {
            model: OrderItem,
            foreignKey: "buyer_id",
            include: [
              { model: Product, attributes: ["id", "name", "price", "weight"] },
              { model: Seller, attributes: ["id", "store_name"] },
            ],
          },
        ],
      });

      if (!order) throw { name: "NotFound", message: "Order not found" };

      res.status(200).json({ data: order });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const { id: seller_id } = req.seller;

      const allowedStatus = [
        "pending",
        "processing",
        "shipped",
        "completed",
        "cancelled",
      ];
      if (!allowedStatus.includes(status)) {
        throw {
          name: "BadRequest",
          message: `Status must be one of: ${allowedStatus.join(", ")}`,
        };
      }

      const orderItem = await OrderItem.findOne({ where: { seller_id } });
      if (!orderItem)
        throw {
          name: "Forbidden",
          message: "You don't have access to this order",
        };

      const order = await Order.findByPk(id);
      if (!order) throw { name: "NotFound", message: "Order not found" };

      await order.update({ status });

      res.status(200).json({
        message: "Order status updated successfully",
        data: { order_id: order.id, status: order.status },
      });
    } catch (error) {
      next(error);
    }
  }

  static async sellerOrders(req, res, next) {
    try {
      const { id: seller_id } = req.seller; // dari authorizationSeller

      const orderItems = await OrderItem.findAll({
        where: { seller_id },
        include: [
          {
            model: Order,
            attributes: [
              "id",
              "status",
              "payment_status",
              "shipping_address",
              "grand_total",
              "createdAt",
            ],
          },
          {
            model: Product,
            attributes: ["id", "name", "price"],
          },
        ],
        order: [[Order, "createdAt", "DESC"]],
      });

      res.status(200).json({ data: orderItems });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderController;
