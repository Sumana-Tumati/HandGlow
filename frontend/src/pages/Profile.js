import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Profile(){
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  useEffect(()=>{
    api.get('/orders/my-orders').then(r=>setOrders(r.data)).catch(()=>{});
  },[]);

  return (
    <div>
      <h2>Profile</h2>
      {user && <div><strong>{user.name}</strong><div>{user.email}</div></div>}
      <h3 style={{marginTop:16}}>Orders</h3>
      <div>
        {orders.map(o=> (
          <div key={o._id} style={{padding:8,background:'white',borderRadius:8,marginBottom:8}}>
            <div>Order #{o._id}</div>
            <div>Total: ₹{o.totalAmount}</div>
            <div>Latest: {o.statusHistory?.[o.statusHistory.length-1]?.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
