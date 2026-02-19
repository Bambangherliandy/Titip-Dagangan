const { Withdrawal, Seller } = require("../models");

class WithdrawlController {
  static async create(req, res, next) {
    try {
      const { id: user_id } = req.user;
      const { amount, bank_name, account_number } = req.body;

      const seller = await Seller.findOne({ where: { user_id } });
      if (!seller) throw { name: "NotFound", message: "Store not found" };

      if (!amount) throw { name: "BadRequest", message: "Amount is required" };
      if (!bank_name)
        throw { name: "BadRequest", message: "Bank name is required" };
      if (!account_number)
        throw { name: "BadRequest", message: "Account number is required" };
      if (amount > seller.balance)
        throw { name: "BadRequest", message: "Insufficient balance" };

      const withdrawal = await Withdrawal.create({
        seller_id: seller.id,
        amount,
        bank_name,
        account_number,
        status: "pending",
      });

      // kurangi saldo seller
      await seller.decrement("balance", { by: amount });

      res.status(201).json({
        message: "Withdrawal request created successfully",
        data: withdrawal,
      });
    } catch (error) {
      next(error);
    }
  }

  static async history(req, res, next) {
    try {
      const { id: user_id } = req.user;

      const seller = await Seller.findOne({ where: { user_id } });
      if (!seller) throw { name: "NotFound", message: "Store not found" };

      const withdrawals = await Withdrawal.findAll({
        where: { seller_id: seller.id },
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({ data: withdrawals });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = WithdrawlController;
