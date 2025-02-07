import jwt from "jsonwebtoken";

import asyncHandler from "./asyncHandler.js";
import User from "../models/user.mongo.js";

// protect routes

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized , bad token");
    }
  } else {
    res.status(401);
    throw new Error("You are not logged in");
  }
});

// check if admin

const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as admin");
  }
});

export { protect, admin };
