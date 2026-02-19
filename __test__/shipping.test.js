process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const axios = require("axios");

jest.mock("axios");

afterAll(async () => {
  // kalau pakai sequelize global close di test lain,
  // tidak perlu tutup lagi di sini
});

describe("GET /shipping/provinces", () => {
  it("should return provinces", async () => {
    axios.get.mockResolvedValue({
      data: {
        data: [
          { id: 1, name: "DKI Jakarta" },
          { id: 2, name: "Jawa Barat" },
        ],
      },
    });

    const response = await request(app).get("/shipping/provinces");

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(2);
    expect(response.body.data[0].name).toBe("DKI Jakarta");
  });

  it("should handle API error", async () => {
    axios.get.mockRejectedValue({
      response: { data: "API Error" },
    });

    const response = await request(app).get("/shipping/provinces");

    expect(response.status).toBeGreaterThanOrEqual(400);
  });
});

describe("GET /shipping/cities", () => {
  it("should return cities", async () => {
    axios.get.mockResolvedValue({
      data: {
        data: [
          { id: 10, name: "Jakarta Selatan" },
          { id: 11, name: "Jakarta Barat" },
        ],
      },
    });

    const response = await request(app).get("/shipping/cities?province_id=1");

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(2);
  });

  it("should return 400 if province_id missing", async () => {
    const response = await request(app).get("/shipping/cities");

    expect(response.status).toBe(400);
  });
});
