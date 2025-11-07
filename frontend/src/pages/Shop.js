import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Shop(){
  const [products, setProducts] = useState([]);
  useEffect(()=>{
    let mounted = true;
    api.get('/products').then(res=>{ if(mounted) setProducts(res.data); }).catch(()=>{});
    return ()=> mounted=false;
  },[]);

  return (
    <div>
      <h2>Shop</h2>
      <div className="grid">
        {products.map(p=> <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
}
