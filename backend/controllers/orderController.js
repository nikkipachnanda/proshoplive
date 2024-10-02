import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";

//Create new order, public, get api/orders

const addOrderItems = asyncHandler(async (req, res) => {
  //res.send('add order items')
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
    res.status(400);
    throw new Error("No Order items");
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
      shippingPrice,
      totalPrice,
    });
    const createOrder = await order.save();
    res.status(201).json(createOrder);
  }
});

//Get loggedin user order, private, get api/orders/myorders

const getMyOrders = asyncHandler(async (req, res) => {
  //res.send("get my orders");
  const order = await Order.find({ user: req.user._id });

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});

//Get order by id, private, get api/orders/:id

const getOrderById = asyncHandler(async (req, res) => {
  const orders = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  res.status(200).json(orders);
});

//update order to paid, private, put api/orders/:id/pay

const updateOrderToPaid = asyncHandler(async (req, res) => {
 // res.send("update order to paid");
  const order = await Order.findById(req.params.id);
   if(order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id:req.body.id,
      status:req.body.status,
      update_time:req.body.update_time,
      email_address:req.body.payer.email_address
    }
    const updatedOrder = await order.save();

    res.json(updatedOrder);
   } else {
    res.status(404);
    throw new Error('Order not found');
   }
});

//update order to deliver, private/admin, get api/orders/:id/pay

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
})

//get all order, private, get api/orders
const getOrders = asyncHandler(async (req, res) => {
    const orders= await Order.find({}).populate('user', 'id name');
    res.status(200).json(orders);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
