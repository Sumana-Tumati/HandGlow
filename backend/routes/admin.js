const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { protect, admin } = require('../middleware/auth');
const { createProduct, updateProduct, deleteProduct, getStats, getAllOrders, updateOrderStatusAdmin } = require('../controllers/adminController');

router.post('/product', protect, admin, upload.single('image'), createProduct);
router.put('/product/:id', protect, admin, upload.single('image'), updateProduct);
router.delete('/product/:id', protect, admin, deleteProduct);

router.get('/stats', protect, admin, getStats);
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id/status', protect, admin, updateOrderStatusAdmin);

module.exports = router;
