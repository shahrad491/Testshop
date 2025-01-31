import mongoose from "mongoose";
import "dotenv/config";
import colors from "colors";

import users from "./data/users.js";
import products from "./data/products.js";
import User from "./src/models/user.mongo.js";
import Product from "./src/models/product.mongo.js";
import Order from "./src/models/product.mongo.js";
import { connectDB } from "./src/services/mongo.js";

connectDB();
const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log("data imported".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("data is destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

process.argv[2] === "-d" ? destroyData() : importData();
