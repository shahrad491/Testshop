import express from "express";

import {
  httpGetAllProducts,
  httpGetOneProduct,
  httpCreateProduct,
  httpUpdateProducts,
} from "../controllers/product.controller.js";
import { protect, admin } from "../services/authHandler.js";

const productRouter = express.Router();

productRouter
  .route("/")
  .get(httpGetAllProducts)
  .post(protect, admin, httpCreateProduct);

productRouter
  .route("/:id")
  .get(httpGetOneProduct)
  .put(protect, admin, httpUpdateProducts);

export default productRouter;
