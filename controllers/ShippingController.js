const axios = require("axios");

const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY;
const RAJAONGKIR_BASE_URL = "https://rajaongkir.komerce.id/api/v1";

class ShippingController {
  static async getProvinces(req, res, next) {
    try {
      const response = await axios.get(
        `${RAJAONGKIR_BASE_URL}/destination/province`,
        {
          headers: { key: RAJAONGKIR_API_KEY, Accept: "application/json" },
        }
      );

      res.status(200).json({ data: response.data?.data });
    } catch (error) {
      next(error);
    }
  }

  static async getCities(req, res, next) {
    try {
      const { province_id } = req.query;
      if (!province_id)
        throw { name: "BadRequest", message: "Province ID is required" };

      const response = await axios.get(
        `${RAJAONGKIR_BASE_URL}/destination/city/${province_id}`,
        {
          headers: { key: RAJAONGKIR_API_KEY, Accept: "application/json" },
        }
      );

      res.status(200).json({ data: response.data?.data });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ShippingController;
