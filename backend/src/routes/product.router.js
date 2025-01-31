import express from "express";

import {
  httpGetAllProducts,
  httpGetOneProduct,
} from "../controllers/product.controller.js";

const productRouter = express.Router();

productRouter.route("/").get(httpGetAllProducts);

productRouter.route("/:id").get(httpGetOneProduct);

export default productRouter;
