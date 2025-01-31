import Product from "../models/product.mongo.js";
import asyncHandler from "../services/asyncHandler.js";

// @desc Fetch all products
// @route /api/products
// @method GET
// @access Public
const httpGetAllProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({});
  res.status(200).setHeader("Content-Type", "application/json").json(products);
});

// @desc Fetch all products
// @route /api/products/:id
// @method GET
// @access Public
const httpGetOneProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  if (!product) {
    res.status(404).setHeader("Content-Type", "application/json");
    throw new Error("Resource Was Not FOUND");
  }
  res.status(200).setHeader("Content-Type", "application/json").json(product);
});

export { httpGetAllProducts, httpGetOneProduct };
