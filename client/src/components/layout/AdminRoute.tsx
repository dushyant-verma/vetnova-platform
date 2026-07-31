import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminRoute = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};
