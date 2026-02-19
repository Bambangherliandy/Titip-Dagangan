const request = require("supertest");
const app = require("../app");
const { sequelize, Category, User } = require("../models");
const { signToken } = require("../helpers/jwt");

let access_token;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const user = await User.create({
    name: "Admin",
    email: "admin@mail.com",
    password: "123456",
    role: "admin",
  });

  access_token = signToken({ id: user.id, email: user.email });
});

afterAll(async () => {
  await sequelize.close();
});

describe("CATEGORY LIST", () => {
  it("should get all categories", async () => {
    await Category.bulkCreate([{ name: "Skincare" }, { name: "Makeup" }]);

    const response = await request(app)
      .get("/category")
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});

describe("CATEGORY CREATE", () => {
  it("should create category successfully", async () => {
    const response = await request(app)
      .post("/category")
      .set("Authorization", `Bearer ${access_token}`)
      .send({ name: "Bodycare" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Category created successfully"
    );
    expect(response.body.data).toHaveProperty("id");
  });

  it("should return 400 if name is empty", async () => {
    const response = await request(app)
      .post("/category")
      .set("Authorization", `Bearer ${access_token}`)
      .send({ name: "" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Category name is required"
    );
  });

  it("should return 400 if category already exists", async () => {
    await Category.create({ name: "Haircare" });

    const response = await request(app)
      .post("/category")
      .set("Authorization", `Bearer ${access_token}`)
      .send({ name: "Haircare" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Category already exists");
  });
});

describe("CATEGORY DELETE", () => {
  it("should delete category successfully", async () => {
    const category = await Category.create({ name: "TestDelete" });

    const response = await request(app)
      .delete(`/category/${category.id}`)
      .set("Authorization", `Bearer ${access_token}`);

    console.log(response.status);
    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Category deleted successfully"
    );
  });

  it("should return 404 if category not found", async () => {
    const response = await request(app)
      .delete("/category/99999")
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Category not found");
  });
});
