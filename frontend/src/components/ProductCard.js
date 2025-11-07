import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }){
  return (
    <div className="card">
      <Link to={`/product/${product._id}`}>
        <img src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/400x300'} alt="" />
      </Link>
      <h3>{product.title}</h3>
      <div className="price">₹{product.price}</div>
    </div>
  );
}
