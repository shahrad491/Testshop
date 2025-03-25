import request from "supertest";

import app from "../app.js";
import { connectDB, disconnectDB } from "../services/mongo.js";

const BASE_URL = "/api/orders";

describe("Starting Orders test", () => {
  beforeAll(async () => {
    await connectDB();
  });

  describe("Testing unAuthenticated User", () => {
    const data = {
      orderItems: ["teststuf"],
      shippingAddress: { test: "testing" },
      paymentMethod: "test",
      itemsPrice: 100,
      taxPrice: 10,
      shippingPrice: 0,
      totalPrice: 110,
    };
    test("Making new Order Must be 401", async () => {
      const res = await request(app)
        .post(BASE_URL)
        .send(data)
        .expect("Content-Type", /json/)
        .expect(401);
    });
  });

  afterAll(async () => {
    await disconnectDB();
  });
});
