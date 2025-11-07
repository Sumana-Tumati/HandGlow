const User = require('../models/User');
const Product = require('../models/Product');

// Get user's cart
exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    res.json(user.cart || []);
  } catch (err) { next(err); }
};

// Replace/update cart (simple implementation)
exports.updateCart = async (req, res, next) => {
  try {
    const { cart } = req.body; // expect [{ product: id, qty }]
    const user = await User.findById(req.user.id);
    user.cart = cart;
    await user.save();
    res.json(user.cart);
  } catch (err) { next(err); }
};

exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user.wishlist.includes(productId)) user.wishlist.push(productId);
    await user.save();
    res.json(user.wishlist);
  } catch (err) { next(err); }
};

exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.json(user.wishlist || []);
  } catch (err) { next(err); }
};
