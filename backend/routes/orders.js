const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { createOrder, getUserOrders, updateOrderStatus, createRazorpayOrder, verifyRazorpay, getOrderById } = require('../controllers/orderController');

router.post('/create', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);

// Razorpay order creation and verification
router.post('/razorpay/create', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpay);

// Admin updates status
router.put('/:id/status', protect, admin, updateOrderStatus);

// Get single order (owner or admin)
router.get('/:id', protect, getOrderById);

module.exports = router;
