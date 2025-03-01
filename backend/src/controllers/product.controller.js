import Product from "../models/product.mongo.js";
import asyncHandler from "../services/asyncHandler.js";
import { pSize } from "../services/pagination.js";

// @desc Fetch all products
// @route /api/products
// @method GET
// @access Public
const httpGetAllProducts = asyncHandler(async (req, res, next) => {
  const pageSize = pSize;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Product.countDocuments();

  const products = await Product.find({})
    .limit(pageSize)
    .skip((page - 1) * pageSize);
  res
    .status(200)
    .setHeader("Content-Type", "application/json")
    .json({ products, page, pages: Math.ceil(count / pageSize) });
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

// @desc Create a products
// @route /api/products
// @method POST
// @access Private/Admin
const httpCreateProduct = asyncHandler(async (req, res, next) => {
  const product = {
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/samle.jpg",
    brand: "Sample brand",
    category: "Sample Category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample Description",
  };

  try {
    await Product.create(product);
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
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.status(200).setHeader("Content-Type", "application/json").json({
      name: updatedProduct.name,
      price: updatedProduct.price,
      description: updatedProduct.description,
      countInStock: updatedProduct.countInStock,
      brand: updatedProduct.brand,
      category: updatedProduct.category,
    });
  } else {
    res.status(404);
    throw new Error("Product was not Found");
  }
});

// @desc Delete a products
// @route /api/products/:id
// @method Delete
// @access Private/Admin
const httpDeleteProducts = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (product) {
    res.status(200).setHeader("Content-Type", "application/json").json({
      message: "Product was deleted Successfully",
      name: product.name,
      price: product.price,
      description: product.description,
      countInStock: product.countInStock,
      brand: product.brand,
      category: product.category,
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

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (res) => res.user.toString() == req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(409);
      throw new Error("Product is already reviewed by the User");
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).setHeader("Content-Type", "application/json").json({
      message: "Product review was Created Successfully",
    });
  } else {
    res.status(404);
    throw new Error("Product was not Found");
  }
});
export {
  httpGetAllProducts,
  httpGetOneProduct,
  httpCreateProduct,
  httpUpdateProducts,
  httpDeleteProducts,
  httpCreateProductReview,
};
