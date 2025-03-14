import asyncHandler from "../services/asyncHandler.js";
import {
  createOrderItems,
  getUserOrders,
  getOrderById,
  updateToPaid,
  updateToDelivered,
  allOrders,
} from "../models/order.model.js";

// @desc Create a new Order
// @route /api/orders
// @method POST
// @access Private
const httpCreateOrderItems = asyncHandler(async (req, res) => {
  const data = req.body;
  if (
    !data.orderItems ||
    !data.shippingAddress ||
    !data.paymentMethod ||
    !data.itemsPrice ||
    !data.taxPrice ||
    !data.shippingPrice ||
    !data.totalPrice
  ) {
    res.status(406);
    throw new Error("Fill the required fields");
  }
  if (data.orderItems && data.orderItems.length === 0) {
    res.status(406);
    throw new Error("No order items");
  }

  try {
    const createdOrder = await createOrderItems(req);
    res
      .status(201)
      .setHeader("Content-Type", "application/json")
      .json(createdOrder);
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc Get logged in user orders
// @route /api/orders/myorders
// @method GET
// @access Private
const httpgetMyOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await getUserOrders(req.user._id);
    if (!orders) {
      res.status(404);
      throw new Error("No orders was found for this user");
    } else {
      res
        .status(200)
        .setHeader("Content-Type", "application/json")
        .json(orders);
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc Get order by ID
// @route /api/orders/:id
// @method GET
// @access Private
const httpGetOrderById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  try {
    const order = await getOrderById(id);
    if (!order) {
      res.status(404);
      throw new Error("no order found with this id");
    } else {
      res.status(200).setHeader("Content-Type", "application/json").json(order);
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc Update order to paid
// @route /api/orders/:id/pay
// @method PUT
// @access Private
const httpUpdateOrderToPaid = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  try {
    const updatedOrder = await updateToPaid(orderId, req.body);

    res
      .status(200)
      .setHeader("Content-Type", "application/json")
      .json(updatedOrder);
  } catch (error) {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc Update order to Delivered
// @route /api/orders/:id/deliver
// @method PUT
// @access Private/Admin
const httpUpdateOrderToDelivered = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  try {
    const updatedOrder = await updateToDelivered(orderId);
    res
      .status(200)
      .setHeader("Content-Type", "application/json")
      .json(updatedOrder);
  } catch (error) {
    res.status(404);
    throw new Error("Order not Found");
  }
});

// @desc Get all orders
// @route /api/orders
// @method GET
// @access Private/Admin
const httpGetAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await allOrders();
    res.status(200).setHeader("Content-Type", "application/json").json(orders);
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export {
  httpCreateOrderItems,
  httpgetMyOrders,
  httpGetOrderById,
  httpUpdateOrderToPaid,
  httpUpdateOrderToDelivered,
  httpGetAllOrders,
};
