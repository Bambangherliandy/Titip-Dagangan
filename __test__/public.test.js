process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const { sequelize, Product, Category, Seller } = require("../models");

let seller;
let category;
let activeProduct;
let inactiveProduct;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  seller = await Seller.create({
    store_name: "Public Store",
    store_address: "Jakarta",
    balance: 0,
  });

  category = await Category.create({
    name: "Electronics",
  });

  activeProduct = await Product.create({
    seller_id: seller.id,
    category_id: category.id,
    name: "Laptop Gaming",
    slug: "laptop-gaming",
    description: "Powerful laptop",
    price: 15000000,
    stock: 5,
    weight: 2000,
    commission_percentage: 10,
    status: "active",
  });

  inactiveProduct = await Product.create({
    seller_id: seller.id,
    category_id: category.id,
    name: "Old Product",
    slug: "old-product",
    description: "Not active",
    price: 1000000,
    stock: 1,
    weight: 500,
    commission_percentage: 10,
    status: "inactive",
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("GET /pub/products", () => {
  it("should return active products only", async () => {
    const response = await request(app).get("/pub/products");

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].name).toBe("Laptop Gaming");
  });

  it("should filter by category", async () => {
    const response = await request(app).get(
      `/pub/products?category_id=${category.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
  });

  it("should filter by search", async () => {
    const response = await request(app).get(`/pub/products?search=Laptop`);

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
  });
});

describe("GET /pub/products/:id", () => {
  it("should return product detail", async () => {
    const response = await request(app).get(
      `/pub/products/${activeProduct.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("Laptop Gaming");
    expect(response.body.data.Category).toBeDefined();
    expect(response.body.data.Seller).toBeDefined();
  });

  it("should return 404 if product not found", async () => {
    const response = await request(app).get(`/pub/products/9999`);

    expect(response.status).toBe(404);
  });

  it("should return 404 if product inactive", async () => {
    const response = await request(app).get(
      `/pub/products/${inactiveProduct.id}`
    );

    expect(response.status).toBe(404);
  });
});

describe("GET /pub/categories", () => {
  it("should return categories", async () => {
    const response = await request(app).get("/pub/categories");

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].name).toBe("Electronics");
  });
});
