const request = require("supertest");
const app = require("../app");
const { sequelize, User } = require("../models");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await User.destroy({ where: {}, truncate: true, cascade: true });
});

describe("AUTH REGISTER", () => {
  it("should register successfully", async () => {
    const response = await request(app)
      .post("/auth/register") // pastikan ini sesuai route kamu
      .send({
        name: "Bambang",
        email: "bambang@test.com",
        password: "123456",
        role: "customer",
        phone: "08123456789",
        address: "Jakarta",
        city_id: 1,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "Register success");
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data.email).toBe("bambang@test.com");
  });

  it("should return 400 if email missing", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Bambang",
      password: "123456",
    });

    expect(response.status).toBe(400);
  });
});

describe("AUTH LOGIN", () => {
  beforeEach(async () => {
    // Jangan hash manual!
    await User.create({
      name: "Bambang",
      email: "bambang@test.com",
      password: "123456", // hook model yang hash
      role: "customer",
      phone: "08123456789",
      address: "Jakarta",
      city_id: 1,
    });
  });

  it("should login successfully", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "bambang@test.com",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Login success");
    expect(response.body.data).toHaveProperty("access_token");
  });

  it("should return 401 if password incorrect", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "bambang@test.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
  });

  it("should return 400 if email not found", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "notfound@test.com",
      password: "123456",
    });

    expect(response.status).toBe(400);
  });
});
