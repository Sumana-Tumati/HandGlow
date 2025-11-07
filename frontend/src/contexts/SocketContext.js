import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export function SocketProvider({ children }){
  const { user, token } = useAuth();
  const socketRef = useRef(null);

  useEffect(()=>{
    // connect only after user logs in
    const url = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api','') : 'http://localhost:5000';
    socketRef.current = io(url, { auth: { token } });
    socketRef.current.on('connect', ()=>{
      // join room by user id
      if(user && user.id) socketRef.current.emit('join', user.id);
    });
    return ()=>{ if(socketRef.current) socketRef.current.disconnect(); }
  },[user, token]);

  return <SocketContext.Provider value={{ socket: socketRef.current }}>{children}</SocketContext.Provider>
}

export const useSocket = ()=>useContext(SocketContext);
