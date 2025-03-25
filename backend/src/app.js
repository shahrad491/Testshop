import path from "path";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import "dotenv/config";
import { notFound, errorHandler } from "./services/errorHandler.js";

import apiRouter from "./routes/api.js";

const app = express();

const corsSeting = {
  origin: ["http://localhost:3000"],
};

app.use(helmet());
app.use(cors(corsSeting));
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/", (req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.send("This is the backend server for Mern-Ecomerce");
});

app.use("/api", apiRouter);

app.get("/api/config/zarin", (req, res, next) => {
  res.send(process.env.MERCHENT_ID);
});

const __dirname = path.resolve();
console.log(path.join(__dirname, "..", "uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(notFound);
app.use(errorHandler);

export default app;
