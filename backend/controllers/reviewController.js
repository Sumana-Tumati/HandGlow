const Review = require('../models/Review');
const Product = require('../models/Product');

// Get reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort('-createdAt');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

// Get reviews by current user
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('product', 'title images')
      .sort('-createdAt');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your reviews' });
  }
};

// Create a review
exports.createReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const productId = req.params.productId;

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user.id,
      product: productId
    });

    if (existingReview) {
      return res.status(400).json({
        message: 'You have already reviewed this product'
      });
    }

    const review = await Review.create({
      user: req.user.id,
      product: productId,
      rating,
      title,
      comment,
      images: req.body.images || []
    });

    // Populate user info before sending response
    await review.populate('user', 'name');
    
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error creating review' });
  }
};

// Update user's review
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.reviewId,
      user: req.user.id
    });

    if (!review) {
      return res.status(404).json({
        message: 'Review not found or not owned by user'
      });
    }

    const { rating, title, comment, images } = req.body;
    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;
    if (images) review.images = images;

    await review.save();
    await review.populate('user', 'name');
    
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error updating review' });
  }
};

// Delete user's review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.reviewId,
      user: req.user.id
    });

    if (!review) {
      return res.status(404).json({
        message: 'Review not found or not owned by user'
      });
    }

    await review.remove();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting review' });
  }
};