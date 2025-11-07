import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }){
  const [user, setUser] = useState(() => {
    try{ return JSON.parse(localStorage.getItem('cs_user')) } catch(e){ return null }
  });
  const [token, setToken] = useState(() => localStorage.getItem('cs_token'));

  useEffect(()=>{
    if(token){
      // Optionally fetch user
      api.setToken(token);
    }
  },[token]);

  const login = async (email, password, adminData = null) => {
    const loginData = { email, password };
    if (adminData) {
      Object.assign(loginData, adminData);
    }
    const res = await api.post('/auth/login', loginData);
    const { token: t, user: u } = res.data;
    localStorage.setItem('cs_token', t);
    localStorage.setItem('cs_user', JSON.stringify(u));
    api.setToken(t);
    setToken(t); setUser(u);
    return u;
  };
  const register = async (name,email,password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { token: t, user: u } = res.data;
    localStorage.setItem('cs_token', t);
    localStorage.setItem('cs_user', JSON.stringify(u));
    api.setToken(t);
    setToken(t); setUser(u);
    return u;
  };
  const logout = () => {
    localStorage.removeItem('cs_token');
    localStorage.removeItem('cs_user');
    api.clearToken();
    setToken(null); setUser(null);
  };

  return <AuthContext.Provider value={{ user, token, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);
