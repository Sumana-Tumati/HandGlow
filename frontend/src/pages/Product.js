import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import ReviewList from '../components/ReviewList';
import '../styles/reviews.css';

export default function Product(){
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(()=>{
    api.get(`/products/${id}`).then(r=>setProduct(r.data)).catch(()=>{});
  },[id]);

  if(!product) return <div>Loading…</div>;
  
  const toggleWishlist = () => {
    if(isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  return (
    <div className="product-detail">
      <div className="product-main">
        <div className="product-image">
          <img src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/600x400'} alt={product.title} />
          <button 
            className={`wishlist-btn ${isInWishlist(product._id) ? 'active' : ''}`}
            onClick={toggleWishlist}
          >
            <i className="fas fa-heart"></i>
          </button>
        </div>
        <div className="product-info">
        <h2>{product.title}</h2>
        <div className="category-badge">{product.category}</div>
        <p className="description">{product.description}</p>
        <div className="price-section">
          <div className="price">₹{product.price}</div>
          <div className="stock">In Stock: {product.stock}</div>
        </div>
        
        <div className="actions">
          <button className="btn" onClick={()=>addToCart(product,1)}>
            <i className="fas fa-shopping-cart"></i> Add to cart
          </button>
          <button className="btn secondary" onClick={toggleWishlist}>
            <i className={`fas fa-heart ${isInWishlist(product._id) ? 'active' : ''}`}></i>
            {isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </button>
        </div>

        <div className="payment-info">
          <h3><i className="fas fa-wallet"></i> Payment Options</h3>
          <div className="payment-methods">
            <div className="payment-method">
              <i className="fas fa-qrcode"></i>
              <span>UPI / QR</span>
            </div>
            <div className="payment-method">
              <i className="fas fa-credit-card"></i>
              <span>Card</span>
            </div>
            <div className="payment-method">
              <i className="fas fa-university"></i>
              <span>Net Banking</span>
            </div>
            <div className="payment-method">
              <i className="fas fa-money-bill-wave"></i>
              <span>Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>
      </div>
      <div className="reviews-container">
        <ReviewList productId={id} />
      </div>
    </div>
  );
}
