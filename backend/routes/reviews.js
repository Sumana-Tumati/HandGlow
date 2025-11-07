const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  createReview,
  getProductReviews,
  getUserReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

// Get reviews for a product
router.get('/product/:productId', getProductReviews);

// Get reviews by current user
router.get('/my-reviews', protect, getUserReviews);

// Create a review
router.post('/:productId', protect, createReview);

// Update user's review
router.put('/:reviewId', protect, updateReview);

// Delete user's review
router.delete('/:reviewId', protect, deleteReview);

module.exports = router;