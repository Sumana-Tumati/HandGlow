const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

exports.createProduct = async (req, res, next) => {
  try {
    const { title, description, price, category, stock, imageUrl } = req.body;
    const images = [];
    if (req.file) {
      // Save local file path (in production you would upload to S3)
      images.push(`${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`);
    }
    if (imageUrl) images.push(imageUrl);

    const product = await Product.create({ title, description, price, category, stock, images });
    res.status(201).json(product);
  } catch (err) { next(err); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const { title, description, price, category, stock, imageUrl } = req.body;
    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (req.file) product.images.push(`${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`);
    if (imageUrl) product.images.push(imageUrl);
    await product.save();
    res.json(product);
  } catch (err) { next(err); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.remove();
    res.json({ message: 'Product removed' });
  } catch (err) { next(err); }
};

exports.getStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenueAgg = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: null, total: { $sum: '$items.price' } } },
    ]);
    const totalRevenue = totalRevenueAgg[0] ? totalRevenueAgg[0].total : 0;
    const customers = await User.countDocuments({ role: 'user' });
    res.json({ totalOrders, totalRevenue, customers });
  } catch (err) { next(err); }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user').populate('items.product');
    res.json(orders);
  } catch (err) { next(err); }
};

exports.updateOrderStatusAdmin = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const { status } = req.body;
    order.statusHistory.push({ status });
    await order.save();

    // emit to user via socket
    const io = require('../utils/socket').getIO();
    if (io) io.to(String(order.user)).emit('order:update', { orderId: order._id, status });

    res.json(order);
  } catch (err) { next(err); }
};
