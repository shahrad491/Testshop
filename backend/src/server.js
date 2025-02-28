import path from "path";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import "dotenv/config";
import { connectDB } from "./services/mongo.js";
import { notFound, errorHandler } from "./services/errorHandler.js";

import productRouter from "./routes/product.router.js";
import userRouter from "./routes/user.router.js";
import orderRouter from "./routes/order.router.js";
import uploadRouter from "./routes/upload.router.js";

connectDB();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(morgan("dev"));

// This is for parsing body of the request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/", (req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.send("This is the backend server for Mern-Ecomerce");
});

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRouter);

app.get("/api/config/zarin", (req, res, next) => {
  res.send(process.env.MERCHENT_ID);
});

const __dirname = path.resolve();
console.log(path.join(__dirname, "..", "uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});
