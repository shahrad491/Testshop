import request from "supertest";

import app from "../app.js";
import { connectDB, disconnectDB } from "../services/mongo.js";

const BASE_URL = "/api/users";

describe("Starting users test", () => {
  beforeAll(async () => {
    await connectDB();
  });

  describe("Not logged in user Trying to logout", () => {
    test("Must return 401 ", async () => {
      const res = await request(app)
        .post(`${BASE_URL}/logout`)
        .expect("Content-Type", /json/)
        .expect(401);
    });
  });

  afterAll(async () => {
    await disconnectDB();
  });
});
