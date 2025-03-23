import asyncHandler from "../services/asyncHandler.js";
import { tokenGen } from "../services/tokenHandler.js";
import {
  authUser,
  regUser,
  getUser,
  updateUser,
  getAllUsers,
  deleteUser,
  updateUserAdmin,
} from "../models/user.model.js";

// @desc Auth user & get token
// @route /api/users/login
// @method POST
// @access Public
const httpAuthUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await authUser(email, password);

    tokenGen(res, user._id);

    res.status(200).setHeader("Content-Type", "application/json").json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.log(error);
    if (error.cause == 406) {
      res.status(406);
    }
    throw new Error(error);
  }
});

// @desc Auth user & get token
// @route /api/users
// @method POST
// @access Public
const httpRegUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(406).json({ message: "Please enter all fields" });
  }

  const user = await regUser(email, name, password).catch((err) => {
    if (err.cause == 409) {
      res.status(409);
    }
    throw new Error(err);
  });

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
  const userId = req.user._id;
  const user = await getUser(userId);
  if (user) {
    res.status(200).setHeader("Content-Type", "application/json").json(user);
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
  const userId = req.user._id;
  const data = req.body;
  if (data.isAdmin) {
    res.status(403);
    throw new Error("Admin Only");
  }
  try {
    const updatedUser = await updateUser(userId, data);
    res.status(200).setHeader("Content-Type", "application/json").json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (error) {
    res.statusCode = error.cause || 500;
    next(error);
  }
});

// @desc Get all users
// @route /api/users
// @method GET
// @access Private/Admin
const httpGetUsers = asyncHandler(async (req, res, next) => {
  const user = await getAllUsers();
  res.status(200).setHeader("Content-Type", "application/json").json(user);
});

// @desc    Get user by ID
// @route   /api/users/:id
// @method GET
// @access  Private/Admin
const httpGetUserById = asyncHandler(async (req, res, next) => {
  const user = await getUser(req.params.id);
  if (user) {
    res.status(200).setHeader("Content-Type", "application/json").json(user);
  } else {
    res.status(404);
  }
});

// @desc Delete user
// @route /api/users/:id
// @method DELETE
// @access Private/Admin
const httpDeleteUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await deleteUser(req.params.id);
    res.status(200).setHeader("Content-Type", "application/json").json(user);
  } catch (error) {
    res.statusCode = error.cause || 500;
    next(error);
  }
});

// @desc Update user
// @route /api/users/:id
// @method PUT
// @access Private/Admin
const httpUpdateUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const data = req.body;

  try {
    const user = await updateUserAdmin(userId, data);
    res.status(200).setHeader("Content-Type", "application/json").json(user);
  } catch (error) {
    res.statusCode = error.cause || 500;
    next(error);
  }
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
