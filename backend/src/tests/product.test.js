import request from "supertest";

import app from "../app.js";
import { connectDB, disconnectDB } from "../services/mongo.js";

const BASE_URL = "/api/products";

describe("starting test for products", () => {
  beforeAll(async () => {
    await connectDB();
  });
  describe("this will get all the products by an unAuthenticated user", () => {
    test("this will get all the products with 200 status code", async () => {
      const res = await request(app)
        .get(BASE_URL)
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  afterAll(async () => {
    await disconnectDB();
  });
});
