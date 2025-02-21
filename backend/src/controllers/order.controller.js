import asyncHandler from "../services/asyncHandler.js";
import Order from "../models/order.mongo.js";

// @desc Create a new Order
// @route /api/orders
// @method POST
// @access Private
const createOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(406);
    throw new Error("No order items");
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const createdOrder = await order.save();

    res
      .status(201)
      .setHeader("Content-Type", "application/json")
      .json(createdOrder);
  }
});

// @desc Get logged in user orders
// @route /api/orders/myorders
// @method GET
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });

  if (!orders) {
    res.status(404);
    throw new Error("No orders was found for this user");
  } else {
    res.status(200).setHeader("Content-Type", "application/json").json(orders);
  }
});

// @desc Get order by ID
// @route /api/orders/:id
// @method GET
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId).populate("user", "name email");

  if (!order) {
    res.status(404);
    throw new Error("no order found with this id");
  } else {
    res.status(200).setHeader("Content-Type", "application/json").json(order);
  }
});

// @desc Update order to paid
// @route /api/orders/:id/pay
// @method PUT
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();

    res
      .status(200)
      .setHeader("Content-Type", "application/json")
      .json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc Update order to Delivered
// @route /api/orders/:id/deliver
// @method PUT
// @access Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  res.send("Update order to Delivered");
});

// @desc Get all orders
// @route /api/orders
// @method GET
// @access Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  res.send("getting all the orders");
});

export {
  createOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getAllOrders,
};
