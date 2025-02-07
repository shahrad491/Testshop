import User from "../models/user.mongo.js";
import asyncHandler from "../services/asyncHandler.js";
import { tokenGen } from "../services/tokenHandler.js";

// @desc Auth user & get token
// @route /api/users/login
// @method POST
// @access Public
const httpAuthUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPass(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  } else {
    tokenGen(res, user._id);

    res.status(200).setHeader("Content-Type", "application/json").json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  }
});

// @desc Auth user & get token
// @route /api/users
// @method POST
// @access Public
const httpRegUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(409);
    throw new Error("Email already exists");
  }

  const user = await User.create({ name, email, password });

  if (user) {
    tokenGen(res, user._id);

    res.status(201).setHeader("Content-Type", "application/json").json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(406);
    throw new Error("invalid user data");
  }
});

// @desc Logout user / clear cookie
// @route /api/users/logout
// @method POST
// @access Private
const httpLogoutUser = asyncHandler(async (req, res, next) => {
  res.clearCookie("jwt");
  res
    .status(200)
    .setHeader("Content-Type", "application/json")
    .json({ message: "logout user" });
});

// @desc Get user profile
// @route /api/users/profile
// @method GET
// @access Private
const httpGetUserProfile = asyncHandler(async (req, res, next) => {
  const userid = req.user._id;
  const user = await User.findById(userid);
  if (user) {
    res.status(200).setHeader("Content-Type", "application/json").json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User was NOT FOUND");
  }
});

// @desc Update user Profile
// @route /api/users/profile
// @method PUT
// @access Private
const httpUpdateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();

    res.status(200).setHeader("Content-Type", "application/json").json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  }
});

// @desc Get all users
// @route /api/users
// @method GET
// @access Private/Admin
const httpGetUsers = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .setHeader("Content-Type", "application/json")
    .json({ message: "get all users" });
});

// @desc    Get user by ID
// @route   /api/users/:id
// @method GET
// @access  Private/Admin
const httpGetUserById = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .setHeader("Content-Type", "application/json")
    .json({ message: "getting user by id" });
});

// @desc Delete user
// @route /api/users/:id
// @method DELETE
// @access Private/Admin
const httpDeleteUser = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .setHeader("Content-Type", "application/json")
    .json({ message: "Delete user" });
});

// @desc Update user
// @route /api/users/:id
// @method PUT
// @access Private/Admin
const httpUpdateUser = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .setHeader("Content-Type", "application/json")
    .json({ message: "Update user by admin" });
});

export {
  httpAuthUser,
  httpGetUserProfile,
  httpGetUsers,
  httpGetUserById,
  httpLogoutUser,
  httpRegUser,
  httpUpdateUser,
  httpUpdateUserProfile,
  httpDeleteUser,
};
