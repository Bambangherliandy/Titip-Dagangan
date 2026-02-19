process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const { sequelize, User } = require("../models");
const { signToken } = require("../helpers/jwt");

let user;
let access_token;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  user = await User.create({
    name: "Test User",
    email: "user@test.com",
    password: "123456",
    role: "buyer",
  });

  access_token = signToken({ id: user.id });
});

afterAll(async () => {
  await sequelize.close();
});

describe("GET /user/profile", () => {
  it("should return user profile", async () => {
    const response = await request(app)
      .get("/user/profile")
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe("user@test.com");
    expect(response.body.data).not.toHaveProperty("password");
  });

  it("should return 401 if no token", async () => {
    const response = await request(app).get("/user/profile");

    expect(response.status).toBe(401);
  });
});

describe("PUT /user/profile", () => {
  it("should update profile successfully", async () => {
    const response = await request(app)
      .put("/user/profile")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        name: "Updated Name",
        phone: "08123456789",
        address: "Jakarta",
        city_id: 1,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("Updated Name");
    expect(response.body.data.phone).toBe("08123456789");
  });

  it("should return 401 if no token", async () => {
    const response = await request(app).put("/user/profile").send({
      name: "No Token",
    });

    expect(response.status).toBe(401);
  });
});
