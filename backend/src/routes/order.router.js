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

const orderRouter = express.Router();

orderRouter
  .route("/")
  .post(protect, httpCreateOrderItems)
  .get(protect, admin, httpGetAllOrders);

orderRouter.route("/myorders").get(protect, httpgetMyOrders);

orderRouter.route("/:id").get(protect, httpGetOrderById);

orderRouter.route("/:id/pay").put(protect, httpUpdateOrderToPaid);

orderRouter
  .route("/:id/deliver")
  .put(protect, admin, httpUpdateOrderToDelivered);

export default orderRouter;
