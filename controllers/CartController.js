const { Cart, CartItem, Product } = require("../models");

class CartController {
  static async viewCart(req, res, next) {
    try {
      const { id: user_id } = req.user;

      const [cart] = await Cart.findOrCreate({ where: { user_id } });

      const cartItems = await CartItem.findAll({
        where: { cart_id: cart.id },
        include: [
          {
            model: Product,
            attributes: ["id", "name", "price", "stock", "status"],
          },
        ],
      });

      res.status(200).json({
        data: {
          cart_id: cart.id,
          items: cartItems,
          total_price: cartItems.reduce(
            (sum, item) => sum + item.quantity * item.Product.price,
            0
          ),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async addToCart(req, res, next) {
    try {
      const { id: user_id } = req.user;
      const { product_id, quantity } = req.body;

      if (!product_id)
        throw { name: "BadRequest", message: "Product is required" };
      if (!quantity || quantity < 1)
        throw { name: "BadRequest", message: "Quantity must be at least 1" };

      const product = await Product.findOne({
        where: { id: product_id, status: "active" },
      });
      if (!product) throw { name: "NotFound", message: "Product not found" };

      if (product.stock < quantity) {
        throw { name: "BadRequest", message: "Insufficient stock" };
      }

      const [cart] = await Cart.findOrCreate({ where: { user_id } });

      const existingItem = await CartItem.findOne({
        where: { cart_id: cart.id, product_id },
      });

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        if (product.stock < newQuantity) {
          throw { name: "BadRequest", message: "Insufficient stock" };
        }

        await existingItem.update({ quantity: newQuantity });

        res.status(200).json({
          message: "Cart updated successfully",
          data: existingItem,
        });
      } else {
        const cartItem = await CartItem.create({
          cart_id: cart.id,
          product_id,
          quantity,
        });

        res.status(201).json({
          message: "Product added to cart",
          data: cartItem,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async removeItem(req, res, next) {
    try {
      const { id: user_id } = req.user;
      const { id } = req.params; // cart_item id

      const cart = await Cart.findOne({ where: { user_id } });
      if (!cart) throw { name: "NotFound", message: "Cart not found" };

      const cartItem = await CartItem.findOne({
        where: { id, cart_id: cart.id },
      });
      if (!cartItem)
        throw { name: "NotFound", message: "Item not found in cart" };

      await cartItem.destroy();

      res.status(200).json({
        message: "Item removed from cart",
      });
    } catch (error) {
      next(error);
    }
  }

  static async clearCart(req, res, next) {
    try {
      const { id: user_id } = req.user;

      const cart = await Cart.findOne({ where: { user_id } });
      if (!cart) throw { name: "NotFound", message: "Cart not found" };

      await CartItem.destroy({ where: { cart_id: cart.id } });

      res.status(200).json({
        message: "Cart cleared successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CartController;
