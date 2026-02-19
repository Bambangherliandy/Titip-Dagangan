process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const { sequelize, User, Seller, Withdrawal } = require("../models");
const { signToken } = require("../helpers/jwt");

let user;
let access_token;
let seller;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  user = await User.create({
    name: "Seller User",
    email: "seller@test.com",
    password: "123456",
    role: "seller",
  });

  seller = await Seller.create({
    user_id: user.id,
    store_name: "Test Store",
    balance: 1000000,
  });

  access_token = signToken({ id: user.id });
});

afterAll(async () => {
  await sequelize.close();
});

describe("POST /withdraw", () => {
  it("should create withdrawal request", async () => {
    const response = await request(app)
      .post("/withdraw")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        amount: 500000,
        bank_name: "BCA",
        account_number: "1234567890",
      });

    expect(response.status).toBe(201);
    expect(response.body.data.amount).toBe(500000);
    expect(response.body.data.status).toBe("pending");

    const updatedSeller = await Seller.findByPk(seller.id);
    expect(updatedSeller.balance).toBe(500000);
  });

  it("should return 400 if insufficient balance", async () => {
    const response = await request(app)
      .post("/withdraw")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        amount: 9999999,
        bank_name: "BCA",
        account_number: "1234567890",
      });

    expect(response.status).toBe(400);
  });

  it("should return 400 if amount missing", async () => {
    const response = await request(app)
      .post("/withdraw")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        bank_name: "BCA",
        account_number: "1234567890",
      });

    expect(response.status).toBe(400);
  });

  it("should return 401 if no token", async () => {
    const response = await request(app).post("/withdraw").send({
      amount: 100000,
      bank_name: "BCA",
      account_number: "1234567890",
    });

    expect(response.status).toBe(401);
  });
});

describe("GET /withdraw/history", () => {
  it("should return withdrawal history", async () => {
    const response = await request(app)
      .get("/withdraw/history")
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should return 401 if no token", async () => {
    const response = await request(app).get("/withdraw/history");

    expect(response.status).toBe(401);
  });
});
