import express from "express";

import {
  httpCreateOrderItems,
  httpgetMyOrders,
  httpGetOrderById,
  httpUpdateOrderToPaid,
  httpUpdateOrderToDelivered,
  httpGetAllOrders,
} from "../controllers/order.controller.js";
import { protect, admin } from "../services/authHandler.js";

const router = express.Router();

router
  .route("/")
  .post(protect, httpCreateOrderItems)
  .get(protect, admin, httpGetAllOrders);

router.route("/myorders").get(protect, httpgetMyOrders);

router.route("/:id").get(protect, httpGetOrderById);

router.route("/:id/pay").put(protect, httpUpdateOrderToPaid);

router.route("/:id/deliver").put(protect, admin, httpUpdateOrderToDelivered);

export default router;
