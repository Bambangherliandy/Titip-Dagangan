const request = require("supertest");
const app = require("../app");
const { sequelize, User, Product, Cart, CartItem } = require("../models");

let access_token;
let user;
let product;

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await CartItem.destroy({ where: {}, truncate: true, cascade: true });
  await Cart.destroy({ where: {}, truncate: true, cascade: true });
  await Product.destroy({ where: {}, truncate: true, cascade: true });
  await User.destroy({ where: {}, truncate: true, cascade: true });

  // create user
  user = await User.create({
    name: "Bambang",
    email: "bambang@test.com",
    password: "123456",
    role: "customer",
    phone: "08123456789",
    address: "Jakarta",
    city_id: 1,
  });

  // login to get token
  const login = await request(app).post("/auth/login").send({
    email: "bambang@test.com",
    password: "123456",
  });

  access_token = login.body.data.access_token;

  // create product
  product = await Product.create({
    name: "Test Product",
    price: 10000,
    stock: 10,
    status: "active",
  });
});

describe("CART FEATURE", () => {
  it("should view cart successfully", async () => {
    const response = await request(app)
      .get("/cart")
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("cart_id");
    expect(response.body.data).toHaveProperty("items");
  });

  it("should add product to cart", async () => {
    const response = await request(app)
      .post("/cart")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        product_id: product.id,
        quantity: 2,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "Product added to cart");
  });

  it("should update quantity if product already exists", async () => {
    // first add
    await request(app)
      .post("/cart")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        product_id: product.id,
        quantity: 2,
      });

    // second add
    const response = await request(app)
      .post("/cart")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        product_id: product.id,
        quantity: 3,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Cart updated successfully"
    );
  });

  it("should fail if stock insufficient", async () => {
    const response = await request(app)
      .post("/cart")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        product_id: product.id,
        quantity: 999,
      });

    expect(response.status).toBe(400);
  });

  it("should remove item from cart", async () => {
    const add = await request(app)
      .post("/cart")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        product_id: product.id,
        quantity: 1,
      });

    const cartItemId = add.body.data.id;

    const response = await request(app)
      .delete(`/cart/${cartItemId}`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Item removed from cart");
  });

  it("should clear cart", async () => {
    await request(app)
      .post("/cart")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        product_id: product.id,
        quantity: 2,
      });

    const response = await request(app)
      .delete("/cart/clear")
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Cart cleared successfully"
    );
  });
});
