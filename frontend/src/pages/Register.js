import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const nav = useNavigate();
  
  const [success, setSuccess] = useState('');
  const submit = async (e) => { 
    e.preventDefault(); 
    try {
      if (!name || !email || !password) {
        setError('Please fill in all fields');
        return;
      }
      setLoading(true);
      await register(name,email,password);
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => nav('/'), 2000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <i className="fas fa-user icon"></i>
            <input 
              placeholder="Full Name" 
              value={name} 
              onChange={e=>setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <i className="fas fa-envelope icon"></i>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={e=>setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <i className="fas fa-lock icon"></i>
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Password" 
              value={password} 
              onChange={e=>setPassword(e.target.value)}
              required
            />
            <button 
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? (
              <><i className="fas fa-spinner fa-spin spinner"></i>Creating Account...</>
            ) : (
              <><i className="fas fa-user-plus"></i> Create Account</>
            )}
          </button>
        </form>
        <div className="auth-divider">
          <span>Or sign up with</span>
        </div>
        <a className="btn google-btn" href={`${process.env.REACT_APP_API_URL}/auth/google`}>
          <i className="fab fa-google"></i>
          Continue with Google
        </a>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
