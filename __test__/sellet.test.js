process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const { sequelize, User, Seller, Product } = require("../models");
const { signToken } = require("../helpers/jwt");

let user;
let access_token;
let seller;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  user = await User.create({
    name: "Test Seller",
    email: "seller@test.com",
    password: "123456",
    role: "seller",
  });

  access_token = signToken({ id: user.id });
});

afterAll(async () => {
  await sequelize.close();
});

describe("POST /seller/register", () => {
  it("should register seller successfully", async () => {
    const response = await request(app)
      .post("/seller/register")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        store_name: "My Store",
        store_description: "Best Store",
        store_address: "Jakarta",
        city_id: 1,
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("id");

    seller = response.body.data;
  });

  it("should return 400 if already have store", async () => {
    const response = await request(app)
      .post("/seller/register")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        store_name: "Another Store",
        store_address: "Bandung",
      });

    expect(response.status).toBe(400);
  });

  it("should return 400 if store_name missing", async () => {
    const newUser = await User.create({
      name: "User2",
      email: "user2@test.com",
      password: "123456",
      role: "seller",
    });

    const token = signToken({ id: newUser.id });

    const response = await request(app)
      .post("/seller/register")
      .set("Authorization", `Bearer ${token}`)
      .send({
        store_address: "Jakarta",
      });

    expect(response.status).toBe(400);
  });
});

describe("GET /seller/profile", () => {
  it("should return seller profile", async () => {
    const response = await request(app)
      .get("/seller/profile")
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.store_name).toBe("My Store");
  });

  it("should return 403 if seller not found", async () => {
    const newUser = await User.create({
      name: "User3",
      email: "user3@test.com",
      password: "123456",
      role: "seller",
    });

    const token = signToken({ id: newUser.id });

    const response = await request(app)
      .get("/seller/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });
});
describe("PUT /seller/profile", () => {
  it("should update seller successfully", async () => {
    const response = await request(app)
      .put("/seller/profile")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        store_name: "Updated Store",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.store_name).toBe("Updated Store");
  });
});
