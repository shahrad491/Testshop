import Product from "../models/product.mongo.js";
import asyncHandler from "../services/asyncHandler.js";
import { pSize } from "../services/pagination.js";
import {
  countDocuments,
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProduct,
} from "../models/product.model.js";

// @desc Fetch all products
// @route /api/products
// @method GET
// @access Public
const httpGetAllProducts = asyncHandler(async (req, res, next) => {
  const pageSize = pSize;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  try {
    const count = await countDocuments(keyword);
    const products = await getAllProducts(keyword, pageSize, page);
    res
      .status(200)
      .setHeader("Content-Type", "application/json")
      .json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc Fetch a products
// @route /api/products/:id
// @method GET
// @access Public
const httpGetOneProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const product = await getProduct(id);
  if (!product) {
    res.status(404).setHeader("Content-Type", "application/json");
    throw new Error("Resource Was Not FOUND");
  }
  res.status(200).setHeader("Content-Type", "application/json").json(product);
});

// @desc Create a products
// @route /api/products
// @method POST
// @access Private/Admin
const httpCreateProduct = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  try {
    await createProduct(userId);
    res
      .status(201)
      .setHeader("Content-Type", "application/json")
      .json({ status: "Created Successfully" });
  } catch (error) {
    res.status(502);
    throw error;
  }
});

// @desc Update a products
// @route /api/products/:id
// @method PUT
// @access Private/Admin
const httpUpdateProducts = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  try {
    const updatedProduct = await updateProduct(id, req.body);

    res.status(200).setHeader("Content-Type", "application/json").json({
      updatedProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// @desc Delete a products
// @route /api/products/:id
// @method Delete
// @access Private/Admin
const httpDeleteProducts = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const product = await deleteProduct(id);

  if (product) {
    res.status(200).setHeader("Content-Type", "application/json").json({
      message: "Product was deleted Successfully",
      product,
    });
  } else {
    res.status(404);
    throw new Error("Product was not Found");
  }
});

// @desc Create a New Review
// @route /api/products/:id/reviews
// @method POST
// @access Private
const httpCreateProductReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;
  const { _id: userId, name } = req.user;
  const { id: productId } = req.params;
  if (!rating || !comment) {
    res.status(406);
    throw new Error("Please add a rating and a comment");
  }

  try {
    await createProductReview(productId, userId, name, rating, comment);

    res.status(201).setHeader("Content-Type", "application/json").json({
      message: "Product review was Created Successfully",
    });
  } catch (error) {
    if (error.message.split(" ")[6] == "User") res.status(406);
    next(error);
  }
});

// @desc Get top rated products
// @route /api/products/top
// @method GET
// @access Public
const httpGetTopProduct = asyncHandler(async (req, res, next) => {
  const products = await getTopProduct();
  if (!products) {
    res.status(404).setHeader("Content-Type", "application/json");
    throw new Error("Resource Was Not FOUND");
  }
  res.status(200).setHeader("Content-Type", "application/json").json(products);
});

export {
  httpGetAllProducts,
  httpGetOneProduct,
  httpCreateProduct,
  httpUpdateProducts,
  httpDeleteProducts,
  httpCreateProductReview,
  httpGetTopProduct,
};
