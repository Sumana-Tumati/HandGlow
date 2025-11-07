import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLogin(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try{
      const user = await login(email, password, { adminCode, name, phone });
      if(user.role === 'admin' || user.isAdmin) {
        navigate('/admin');
      } else {
        setError('This account is not an admin.');
      }
    }catch(err){
      console.error(err);
      setError(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{maxWidth:480,margin:'3rem auto',padding:24,background:'var(--beige-2)',borderRadius:12}}>
      <h2>Admin Login</h2>
      {error && <div style={{color:'#c00',marginBottom:12}}>{error}</div>}
      <form onSubmit={submit} style={{display:'grid',gap:12}}>
        <input 
          value={name} 
          onChange={e=>setName(e.target.value)} 
          placeholder="Full Name" 
          required 
        />
        <input 
          value={email} 
          onChange={e=>setEmail(e.target.value)} 
          placeholder="Email" 
          type="email"
          required 
        />
        <input 
          value={phone} 
          onChange={e=>setPhone(e.target.value)} 
          placeholder="Phone Number"
          type="tel" 
          required 
        />
        <input 
          type="password" 
          value={adminCode} 
          onChange={e=>setAdminCode(e.target.value)} 
          placeholder="Admin Code" 
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={e=>setPassword(e.target.value)} 
          placeholder="Admin Password" 
          required 
        />
        <div style={{display:'flex',gap:8}}>
          <button className="btn" type="submit">Sign in as Admin</button>
          <button type="button" className="btn secondary" onClick={()=>navigate('/')}>Back</button>
        </div>
      </form>
    </div>
  );
}
