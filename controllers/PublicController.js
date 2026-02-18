class PublicController {
  static async list(req, res, next) {
    try {
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  }
  static async detail(req, res, next) {
    try {
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  }
  static async listCategory(req, res, next) {
    try {
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PublicController;
