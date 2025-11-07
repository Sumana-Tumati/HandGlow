import React, { useMemo, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Checkout(){
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const total = useMemo(()=> cart.reduce((s,i)=> s + (i.meta?.price || 0) * i.qty, 0),[cart]);

  const handlePay = async ()=>{
    if(cart.length===0) return alert('Cart is empty');
    setLoading(true);
    try{
      // 1) create order record on server
      const createRes = await api.post('/orders/create', { items: cart.map(i=>({ product: i.product, qty: i.qty, price: i.meta?.price || 0 })), totalAmount: total });
      const order = createRes.data;

      // 2) create razorpay order on server
      const resp = await api.post('/orders/razorpay/create', { amount: total, receipt: `receipt_${order._id}` });
      const rOrder = resp.data;

      // 3) open Razorpay checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: rOrder.amount,
        currency: rOrder.currency,
        name: 'Candle Store',
        description: 'Order payment',
        order_id: rOrder.id,
        handler: async function (response){
          try{
            await api.post('/orders/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
            });
            // clear cart and navigate to tracking
            setCart([]);
            navigate(`/orders/${order._id}/track`);
          }catch(e){
            console.error(e); alert('Payment verification failed');
          }
        },
        prefill: { name: '', email: '' },
        theme: { color: '#b58f6b' }
      };
      const rz = new window.Razorpay(options);
      rz.open();

    }catch(err){
      console.error(err); alert('Payment failed');
    }finally{ setLoading(false); }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <div>Total: ₹{total}</div>
      <button className="btn" onClick={handlePay} disabled={loading}>{loading ? 'Processing…' : 'Pay with Razorpay'}</button>
    </div>
  );
}
