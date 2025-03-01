import express from "express";

import {
  httpGetAllProducts,
  httpGetOneProduct,
  httpCreateProduct,
  httpUpdateProducts,
  httpDeleteProducts,
  httpCreateProductReview,
  httpGetTopProduct,
} from "../controllers/product.controller.js";
import { protect, admin } from "../services/authHandler.js";

const productRouter = express.Router();

productRouter
  .route("/")
  .get(httpGetAllProducts)
  .post(protect, admin, httpCreateProduct);

productRouter.route("/top").get(httpGetTopProduct);

productRouter
  .route("/:id")
  .get(httpGetOneProduct)
  .put(protect, admin, httpUpdateProducts)
  .delete(protect, admin, httpDeleteProducts);

productRouter.route("/:id/reviews").post(protect, httpCreateProductReview);

export default productRouter;
