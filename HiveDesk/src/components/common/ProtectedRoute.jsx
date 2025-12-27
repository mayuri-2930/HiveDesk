// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has access to the requested route
  const currentPath = window.location.pathname;
  
  if (currentPath.startsWith('/hr-dashboard') && user?.role !== 'hr') {
    return <Navigate to="/employee-dashboard" replace />;
  }

  if (currentPath.startsWith('/employee-dashboard') && user?.role === 'hr') {
    return <Navigate to="/hr-dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;