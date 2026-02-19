const midtransClient = require("midtrans-client");
const { Order, OrderItem, Seller } = require("../models");

const snap = new midtransClient.Snap({
  isProduction: false, // gunakan true jika sudah production
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

class PaymentController {
  static async createTransaction(req, res, next) {
    try {
      const { order_id, amount } = req.body;
      const { id: user_id } = req.user;

      const parameter = {
        transaction_details: {
          order_id: `order-${order_id}-${Date.now()}`,
          gross_amount: amount,
        },
        credit_card: {
          secure: true,
        },
      };

      const transaction = await snap.createTransaction(parameter);

      res.status(201).json({
        data: {
          token: transaction.token,
          redirect_url: transaction.redirect_url,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async handleNotification(req, res, next) {
    try {
      const notification = await snap.transaction.notification(req.body);

      const { order_id, transaction_status, fraud_status } = notification;

      // ambil order_id asli (format: order-{id}-{timestamp})
      const realOrderId = order_id.split("-")[1];

      let paymentStatus = "unpaid";
      if (transaction_status === "capture" && fraud_status === "accept") {
        paymentStatus = "paid";
      } else if (transaction_status === "settlement") {
        paymentStatus = "paid";
      } else if (["cancel", "deny", "expire"].includes(transaction_status)) {
        paymentStatus = "failed";
      }

      // update payment_status di order
      const order = await Order.findByPk(realOrderId);
      if (order) {
        await order.update({ payment_status: paymentStatus });

        // kalau paid, update saldo seller
        if (paymentStatus === "paid") {
          const orderItems = await OrderItem.findAll({
            where: { order_id: realOrderId },
          });

          for (const item of orderItems) {
            await Seller.increment("balance", {
              by: item.seller_income,
              where: { id: item.seller_id },
            });
          }
        }
      }

      res.status(200).json({ message: "OK" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = PaymentController;
