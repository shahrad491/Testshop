import express from "express";

import {
  httpAuthUser,
  httpGetUserProfile,
  httpGetUsers,
  httpGetUserById,
  httpLogoutUser,
  httpRegUser,
  httpUpdateUser,
  httpUpdateUserProfile,
  httpDeleteUser,
} from "../controllers/user.controller.js";
import { protect, admin } from "../services/authHandler.js";

const userRouter = express.Router();

userRouter.route("/").get(protect, admin, httpGetUsers).post(httpRegUser);

userRouter.route("/login").post(httpAuthUser);

userRouter.route("/logout").post(protect, httpLogoutUser);

userRouter
  .route("/profile")
  .all(protect)
  .get(protect, httpGetUserProfile)
  .put(protect, httpUpdateUserProfile);

userRouter
  .route("/:id")
  .all(protect, admin)
  .get(httpGetUserById)
  .delete(httpDeleteUser)
  .put(httpUpdateUser);

export default userRouter;
