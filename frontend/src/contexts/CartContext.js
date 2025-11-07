import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }){
  const [cart, setCart] = useState(() => {
    try{ return JSON.parse(localStorage.getItem('cs_cart')) || [] } catch(e){ return [] }
  });

  const save = (c)=>{ setCart(c); localStorage.setItem('cs_cart', JSON.stringify(c)); }

  const addToCart = (product, qty=1)=>{
    const idx = cart.findIndex(i=>i.product === product._id);
    let next;
    if(idx>=0){ next = cart.map((it,i)=> i===idx ? {...it, qty: it.qty+qty} : it); }
    else { next = [...cart, { product: product._id, qty, meta: product }]; }
    save(next);
  };
  const removeFromCart = (productId)=>{ save(cart.filter(i=>i.product!==productId)); };

  return <CartContext.Provider value={{ cart, addToCart, removeFromCart, setCart: save }}>{children}</CartContext.Provider>
}

export const useCart = ()=>useContext(CartContext);
