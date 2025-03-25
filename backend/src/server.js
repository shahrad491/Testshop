import http from "http";
import "dotenv/config";

import app from "./app.js";
import { connectDB } from "./services/mongo.js";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

async function startServer() {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
  });
}

startServer();
