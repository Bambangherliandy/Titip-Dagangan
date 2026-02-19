process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const { sequelize, User, Seller, Product, Category } = require("../models");
const { signToken } = require("../helpers/jwt");

let access_token;
let seller;
let category;
let product;
let user;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  user = await User.create({
    name: "Seller User",
    email: "seller@mail.com",
    password: "123456",
    role: "seller",
  });

  seller = await Seller.create({
    user_id: user.id, // PENTING
    store_name: "Test Store",
    balance: 0,
  });

  category = await Category.create({
    name: "Test Category",
  });

  access_token = signToken({ id: user.id }); // PAKAI user.id

  product = await Product.create({
    seller_id: seller.id,
    category_id: category.id,
    name: "Product Lama",
    slug: "product-lama",
    description: "Desc",
    price: 10000,
    stock: 10,
    weight: 100,
    commission_percentage: 10,
    status: "active",
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("POST /products", () => {
  it("should create product successfully", async () => {
    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        category_id: category.id,
        name: "Produk Baru",
        description: "Desc baru",
        price: 20000,
        stock: 5,
        weight: 200,
        commission_percentage: 5,
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data.name).toBe("Produk Baru");
  });

  it("should return 400 if name is missing", async () => {
    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        category_id: category.id,
        price: 20000,
        stock: 5,
      });

    expect(response.status).toBe(400);
  });
});

describe("PUT /products/:id", () => {
  it("should update product successfully", async () => {
    const response = await request(app)
      .put(`/products/${product.id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        name: "Updated Name",
        price: 0, // test nullish operator
      });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("Updated Name");
    expect(response.body.data.price).toBe(0);
  });

  it("should return 404 if product not found", async () => {
    const response = await request(app)
      .put(`/products/9999`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        name: "Tidak Ada",
      });

    expect(response.status).toBe(404);
  });
});

describe("DELETE /products/:id", () => {
  it("should soft delete product", async () => {
    const response = await request(app)
      .delete(`/products/${product.id}`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(200);

    const deletedProduct = await Product.findByPk(product.id);
    expect(deletedProduct.status).toBe("inactive");
  });
});
