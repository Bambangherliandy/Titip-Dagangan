const { Seller } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const seller = await Seller.findOne({
      where: { user_id: req.user.id },
    });

    if (!seller) throw { name: "Forbidden" };

    req.seller = seller;

    next();
  } catch (err) {
    next(err);
  }
};
