import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

export default function Navbar(){
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSwitchConfirm, setShowSwitchConfirm] = useState(false);

  return (
    <>
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand">
          <img src={'/img/file.svg'} alt="HandGlow" className="brand-logo" />
          <span>HandGlow</span>
        </Link>
        <div className="nav-links">
          <Link to="/shop"><i className="fas fa-shop"></i> Shop</Link>
          <Link to="/wishlist"><i className="fas fa-heart"></i> Wishlist ({wishlist.length})</Link>
        </div>
      </div>
      <div className="nav-right">
        <Link to="/cart" className="cart-link">
          <i className="fas fa-shopping-cart"></i>
          <span>Cart</span>
          {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
        </Link>
        
        {user ? (
          <div className="profile-menu">
            <button 
              className="profile-btn" 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <i className="fas fa-user-circle"></i>
              <span>{user.name}</span>
              <i className="fas fa-chevron-down"></i>
            </button>
            
            {showProfileMenu && (
              <div className="profile-dropdown">
                <Link to="/profile"><i className="fas fa-user"></i> Profile</Link>
                <Link to="/orders"><i className="fas fa-box"></i> Orders</Link>
                {/* Admin link intentionally omitted from customer UI */}
                <button onClick={() => setShowLogoutConfirm(true)}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
                <button onClick={() => setShowSwitchConfirm(true)}>
                  <i className="fas fa-exchange-alt"></i> Switch Account
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="btn secondary">
              <i className="fas fa-sign-in-alt"></i> Login
            </Link>
            <Link to="/register" className="btn">
              <i className="fas fa-user-plus"></i> Register
            </Link>
          </div>
        )}
      </div>
    </nav>
    
    {/* Logout confirmation modal */}
    {showLogoutConfirm && (
      <div className="modal-backdrop">
        <div className="modal">
          <h3>Confirm Logout</h3>
          <p>Are you sure you want to logout?</p>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <button className="btn secondary" onClick={()=>setShowLogoutConfirm(false)}>Cancel</button>
            <button className="btn" onClick={()=>{ setShowLogoutConfirm(false); logout(); navigate('/login'); }}>Logout</button>
          </div>
        </div>
      </div>
    )}

    {/* Switch account confirmation modal */}
    {showSwitchConfirm && (
      <div className="modal-backdrop">
        <div className="modal">
          <h3>Switch Account</h3>
          <p>Switching account will log you out. Continue?</p>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <button className="btn secondary" onClick={()=>setShowSwitchConfirm(false)}>Cancel</button>
            <button className="btn" onClick={()=>{ setShowSwitchConfirm(false); logout(); navigate('/login'); }}>Switch</button>
          </div>
        </div>
      </div>
    )}

    </>
  );
}

// Simple inline confirmation modal styles in the component file's scope are fine; CSS classes exist in styles.css

