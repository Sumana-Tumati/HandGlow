const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getCart, updateCart, addToWishlist, getWishlist } = require('../controllers/cartController');

router.get('/', protect, getCart);
router.post('/', protect, updateCart); // full replace or update
router.post('/wishlist/add', protect, addToWishlist);
router.get('/wishlist', protect, getWishlist);

module.exports = router;
