process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const {
  sequelize,
  User,
  Order,
  OrderItem,
  Seller,
  Product,
} = require("../models");
const { signToken } = require("../helpers/jwt");

jest.mock("midtrans-client", () => {
  const mockCreateTransaction = jest.fn();
  const mockNotification = jest.fn();

  return {
    Snap: jest.fn().mockImplementation(() => ({
      createTransaction: mockCreateTransaction,
      transaction: {
        notification: mockNotification,
      },
    })),
    __mock__: {
      mockCreateTransaction,
      mockNotification,
    },
  };
});

const midtransClient = require("midtrans-client");
const { mockCreateTransaction, mockNotification } = midtransClient.__mock__;

let access_token;
let user;
let order;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  user = await User.create({
    name: "Test User",
    email: "test@mail.com",
    password: "123456",
    role: "buyer",
  });

  access_token = signToken({ id: user.id });

  order = await Order.create({
    buyer_id: user.id,
    total_amount: 30000,
    status: "pending",
    payment_status: "pending",
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("POST /payment/create-transaction", () => {
  it("should create transaction successfully", async () => {
    mockCreateTransaction.mockResolvedValue({
      token: "dummy-token",
      redirect_url: "https://dummy-url.com",
    });

    const response = await request(app)
      .post("/payment/create-transaction")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        order_id: order.id,
        amount: 30000,
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("token");
    expect(response.body.data).toHaveProperty("redirect_url");
  });
});

describe("POST /payment/notification", () => {
  it("should update order to paid", async () => {
    const seller = await Seller.create({
      store_name: "Test Store",
      balance: 0,
    });

    const product = await Product.create({
      name: "Test Product",
      price: 10000,
      stock: 10,
      weight: 100,
      seller_id: seller.id,
      commission_percentage: 10,
      status: "active",
    });

    await OrderItem.create({
      order_id: order.id,
      seller_id: seller.id,
      buyer_id: user.id,
      product_id: product.id,
      quantity: 1,
      price: 10000,
      commission_amount: 1000,
      seller_income: 9000,
    });

    mockNotification.mockResolvedValue({
      order_id: `order-${order.id}-123456`,
      transaction_status: "settlement",
      fraud_status: "accept",
    });

    const response = await request(app).post("/payment/notification").send({});

    expect(response.status).toBe(200);

    const updatedOrder = await Order.findByPk(order.id);
    expect(updatedOrder.payment_status).toBe("paid");
  });
});
