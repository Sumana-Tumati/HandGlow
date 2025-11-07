const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate('products', 'title description price images category stock');
    
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        products: []
      });
    }
    
    res.json(wishlist.products);
  } catch (err) {
    console.error('Get wishlist error:', err);
    res.status(500).json({ message: 'Failed to get wishlist' });
  }
};

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const productId = req.params.productId;
    
    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        products: []
      });
    }
    
    // Check if product is already in wishlist
    if (wishlist.products.includes(productId)) {
      return res.json(wishlist);
    }
    
    // Add product to wishlist
    wishlist.products.push(productId);
    await wishlist.save();
    
    // Return populated wishlist
    wishlist = await Wishlist.findById(wishlist._id)
      .populate('products', 'title description price images category stock');
    
    res.json(wishlist.products);
  } catch (err) {
    console.error('Add to wishlist error:', err);
    res.status(500).json({ message: 'Failed to add to wishlist' });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const productId = req.params.productId;
    
    // Find wishlist
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    
    // Remove product
    wishlist.products = wishlist.products.filter(
      p => p.toString() !== productId
    );
    await wishlist.save();
    
    // Return updated wishlist
    const updatedWishlist = await Wishlist.findById(wishlist._id)
      .populate('products', 'title description price images category stock');
    
    res.json(updatedWishlist.products);
  } catch (err) {
    console.error('Remove from wishlist error:', err);
    res.status(500).json({ message: 'Failed to remove from wishlist' });
  }
};