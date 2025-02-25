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

export {
  httpGetAllProducts,
  httpGetOneProduct,
  httpCreateProduct,
  httpUpdateProducts,
};
