import Product from "./product.mongo.js";

const countDocuments = async (keyword) => {
  return await Product.countDocuments({ ...keyword });
};

const getAllProducts = async (keyword, pageSize, page) => {
  return await Product.find({ ...keyword })
    .limit(pageSize)
    .skip((page - 1) * pageSize);
};

const getProduct = async (id) => {
  return await Product.findById(id);
};

const createProduct = async (userId) => {
  const product = {
    name: "Sample name",
    price: 0,
    user: userId,
    image: "/images/samle.jpg",
    brand: "Sample brand",
    category: "Sample Category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample Description",
  };

  return await Product.create(product);
};

const updateProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(
    id,
    { $set: data },
    { upsert: true }
  ).select("name price description countInStock brand category -_id");
};

const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id).select(
    "name price description countInStock brand category -_id"
  );
};

const createProductReview = async (id, userId, name, rating, comment) => {
  const product = await Product.findById(id);
  console.log(product);
  console.log(typeof product);

  if (product) {
    const allreadySet = product.reviews.find(
      (res) => res.user.toString() === userId.toString()
    );
    if (allreadySet) {
      // res.status(409)
      throw new Error("Product is already reviewed by the User");
    }
    const review = {
      name,
      rating: Number(rating),
      comment,
      user: userId,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;

    return await product.save();
  } else {
    throw new Error("Product not found");
  }
};

const getTopProduct = async () => {
  return await Product.find({}).sort({ rating: -1 }).limit(3);
};

export {
  countDocuments,
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProduct,
};
