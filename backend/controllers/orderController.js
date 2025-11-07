const Order = require('../models/Order');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Product = require('../models/Product');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a basic order record (unpaid)
exports.createOrder = async (req, res, next) => {
  try {
    const { items, totalAmount } = req.body;
    const order = await Order.create({ user: req.user.id, items, totalAmount, statusHistory: [{ status: 'Placed' }] });
    res.status(201).json(order);
  } catch (err) { next(err); }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product');
    res.json(orders);
  } catch (err) { next(err); }
};

// Create Razorpay order server-side and return order id to client
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, receipt } = req.body; // amount in rupees expected
    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: 'INR',
      receipt: receipt || `order_rcptid_${Date.now()}`,
    };
    const rOrder = await razorpayInstance.orders.create(options);
    res.json(rOrder);
  } catch (err) { next(err); }
};

// Verify signature after payment
exports.verifyRazorpay = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');
    if (generated_signature !== razorpay_signature) return res.status(400).json({ message: 'Invalid signature' });

    // Update order
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.razorpayOrderId = razorpay_order_id;
    order.razorpayPaymentId = razorpay_payment_id;
    order.statusHistory.push({ status: 'Paid' });
    await order.save();

    // emit via socket if needed
    const io = require('../utils/socket').getIO();
    if (io) {
      io.to(String(order.user)).emit('order:update', { orderId: order._id, status: 'Paid' });
    }

    res.json({ message: 'Payment verified', order });
  } catch (err) { next(err); }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product').populate('user');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // Authorization: only owner or admin can view
    if (String(order.user._id) !== String(req.user.id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    res.json(order);
  } catch (err) { next(err); }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const { status, note } = req.body;
    order.statusHistory.push({ status, note });
    await order.save();

    // emit event to user socket
    const io = require('../utils/socket').getIO();
    if (io) {
      io.to(String(order.user)).emit('order:update', { orderId: order._id, status });
    }

    res.json(order);
  } catch (err) { next(err); }
};
