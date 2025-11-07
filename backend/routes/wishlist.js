const express = require('express');
const router = express.Router();
const { protect: auth } = require('../middleware/auth');
const { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist 
} = require('../controllers/wishlistController');

// Get user's wishlist
router.get('/', auth, getWishlist);

// Add product to wishlist
router.post('/:productId', auth, addToWishlist);

// Remove product from wishlist
router.delete('/:productId', auth, removeFromWishlist);

module.exports = router;