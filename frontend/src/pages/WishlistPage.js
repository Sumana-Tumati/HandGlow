import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if(wishlist.length === 0) {
    return (
      <div className="empty-state">
        <i className="fas fa-heart"></i>
        <h2>Your wishlist is empty</h2>
        <p>Add items to your wishlist while you shop</p>
        <Link to="/shop" className="btn">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h2><i className="fas fa-heart"></i> My Wishlist</h2>
      
      <div className="wishlist-grid">
        {wishlist.map(product => (
          <div key={product._id} className="wishlist-card">
            <Link to={`/product/${product._id}`} className="product-image">
              <img src={product.images?.[0]} alt={product.title} />
            </Link>
            
            <div className="product-details">
              <Link to={`/product/${product._id}`}>
                <h3>{product.title}</h3>
              </Link>
              <div className="category">{product.category}</div>
              <div className="price">₹{product.price}</div>
              
              <div className="actions">
                <button 
                  className="btn"
                  onClick={() => addToCart(product, 1)}
                >
                  <i className="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button 
                  className="btn secondary"
                  onClick={() => removeFromWishlist(product._id)}
                >
                  <i className="fas fa-trash"></i> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}