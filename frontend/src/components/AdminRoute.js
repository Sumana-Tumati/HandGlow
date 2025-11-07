import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute({ children }){
  const { user } = useAuth();
  const location = useLocation();

  // Not logged in -> send to admin login
  if(!user) return <Navigate to="/admin/login" state={{ from: location }} replace />;

  // Not an admin -> show Not Authorized (or redirect)
  if(!(user.role === 'admin' || user.isAdmin)){
    return (
      <div style={{padding:40,textAlign:'center'}}>
        <h2>403 — Not authorized</h2>
        <p>You don't have permission to view this page.</p>
      </div>
    );
  }

  return children;
}
