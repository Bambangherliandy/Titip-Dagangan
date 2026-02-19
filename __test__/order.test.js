jest.mock("axios");

const request = require("supertest");
const app = require("../app");
const axios = require("axios");
const {
  sequelize,
  User,
  Cart,
  CartItem,
  Product,
  Seller,
} = require("../models");
const { signToken } = require("../helpers/jwt");

let access_token;
let user;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  user = await User.create({
    name: "Buyer",
    email: "buyer@mail.com",
    password: "123456",
    role: "buyer",
  });

  access_token = signToken({ id: user.id, email: user.email });

  const seller = await Seller.create({
    store_name: "Test Store",
    user_id: user.id,
  });

  const cart = await Cart.create({ user_id: user.id });

  const product = await Product.create({
    name: "Product A",
    price: 10000,
    stock: 10,
    weight: 100,
    seller_id: seller.id,
    commission_percentage: 10,
    status: "active",
  });

  await CartItem.create({
    cart_id: cart.id,
    product_id: product.id,
    quantity: 2,
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("GET /orders/shipping-cost", () => {
  it("should get shipping cost", async () => {
    axios.post.mockResolvedValue({
      data: {
        data: [{ service: "REG", cost: 20000 }],
      },
    });

    const response = await request(app)
      .get("/orders/shipping-cost")
      .set("Authorization", `Bearer ${access_token}`)
      .query({
        origin: 1,
        destination: 2,
        courier: "jne",
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("services");
  });
});

describe("POST /orders/checkout", () => {
  it("should checkout successfully", async () => {
    axios.post.mockResolvedValue({
      data: {
        data: [{ service: "REG", cost: 20000 }],
      },
    });

    const response = await request(app)
      .post("/orders/checkout")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        shipping_address: "Jl. Test",
        payment_method: "bank_transfer",
        courier: "jne",
        courier_service: "REG",
        origin: 1,
        destination: 2,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Order created successfully"
    );
  });
});

describe("GET /orders", () => {
  it("should get user orders", async () => {
    const response = await request(app)
      .get("/orders")
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});

describe("GET /orders/:id", () => {
  it("should return 404 if order not found", async () => {
    const response = await request(app)
      .get("/orders/99999")
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(404);
  });
});
