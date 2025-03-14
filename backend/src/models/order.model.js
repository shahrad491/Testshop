import Order from "./order.mongo.js";

const createOrderItems = async (req) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

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
  return await order.save();
};

const getUserOrders = async (id) => {
  return await Order.find({ user: id });
};

const getOrderById = async (id) => {
  return await Order.findById(id).populate("user", "name email");
};

const updateToPaid = async (id, data) => {
  return await Order.findByIdAndUpdate(id, {
    isPaid: true,
    paidAt: Date.now(),
    paymentResult: {
      id: data.id,
      status: data.status,
      update_time: data.update_time,
      email_address: data.email_address,
    },
  });
};

const updateToDelivered = async (id) => {
  return await Order.findByIdAndUpdate(id, {
    isDelivered: true,
    deliveredAt: Date.now(),
  });
};

const allOrders = async () => {
  return await Order.find().populate("user", "id name");
};
export {
  createOrderItems,
  getUserOrders,
  getOrderById,
  updateToPaid,
  updateToDelivered,
  allOrders,
};
