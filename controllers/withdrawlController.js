class WithdrawlController {
  static async create(req, res, next) {
    try {
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  }
  static async history(req, res, next) {
    try {
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  }
}

module.exports = WithdrawlController;
