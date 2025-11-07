import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useSocket } from '../contexts/SocketContext';

export default function OrderTracking(){
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const { socket } = useSocket();

  useEffect(()=>{
    api.get(`/orders/${id}`).then(r=>setOrder(r.data)).catch(()=>{});
  },[id]);

  useEffect(()=>{
    if(!socket) return;
    const handler = (payload)=>{
      if(payload.orderId === id) {
        // fetch latest
        api.get(`/orders/${id}`).then(r=>setOrder(r.data)).catch(()=>{});
      }
    };
    socket.on('order:update', handler);
    return ()=> socket.off('order:update', handler);
  },[socket,id]);

  if(!order) return <div>Loading order…</div>;
  return (
    <div>
      <h2>Order Tracking</h2>
      <div>Order ID: {order._id}</div>
      <div style={{marginTop:12}}>
        {order.statusHistory.map((s,idx)=> (
          <div key={idx} style={{padding:8,background:'white',borderRadius:8,marginBottom:8}}>
            <div><strong>{s.status}</strong></div>
            <div style={{color:'rgba(0,0,0,0.6)'}}>{new Date(s.updatedAt || s.createdAt || Date.now()).toLocaleString()}</div>
            {s.note && <div>{s.note}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
