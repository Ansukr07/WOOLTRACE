import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, hasRole } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    // Redirect to their default dashboard based on role
    if (user.role === 'FARMER') return <Navigate to="/farmer" replace />;
    if (user.role === 'SELLER') return <Navigate to="/seller" replace />;
    if (user.role === 'QUALITY_INSPECTOR') return <Navigate to="/inspector" replace />;
    if (user.role === 'WAREHOUSE') return <Navigate to="/warehouse" replace />;
    if (user.role === 'TRANSPORT') return <Navigate to="/transport" replace />;
    
    // Fallback if role is unmapped
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
