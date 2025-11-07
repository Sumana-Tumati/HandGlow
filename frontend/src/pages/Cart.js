import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart(){
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();
  const total = cart.reduce((s,i)=> s + (i.meta?.price || 0) * i.qty, 0);
  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length===0 ? <div>Your cart is empty. <Link to="/shop">Shop now</Link></div> : (
        <div>
          {cart.map(it=> (
            <div key={it.product} style={{display:'flex',gap:12,alignItems:'center',marginBottom:12}}>
              <img src={it.meta?.images?.[0] || 'https://via.placeholder.com/80'} alt="" style={{width:80,height:60,objectFit:'cover',borderRadius:8}} />
              <div style={{flex:1}}>
                <div>{it.meta?.title}</div>
                <div>Qty: {it.qty}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div>₹{(it.meta?.price||0) * it.qty}</div>
                <button className="btn secondary" onClick={()=>removeFromCart(it.product)}>Remove</button>
              </div>
            </div>
          ))}
          <div style={{marginTop:12}}>
            <div style={{fontWeight:700}}>Total: ₹{total}</div>
            <button className="btn" onClick={()=>navigate('/checkout')}>Proceed to checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}
