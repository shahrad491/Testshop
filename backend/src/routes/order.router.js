import express from "express";

import {
  createOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getAllOrders,
} from "../controllers/order.controller.js";
import { protect, admin } from "../services/authHandler.js";

const router = express.Router();

router
  .route("/")
  .post(protect, createOrderItems)
  .get(protect, admin, getAllOrders);

router.route("/myorders").get(protect, getMyOrders);

router.route("/:id").get(protect, getOrderById);

router.route("/:id/pay").put(protect, updateOrderToPaid);

router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

export default router;
