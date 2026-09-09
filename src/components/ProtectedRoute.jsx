import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRoleHome } from '../utils/roleRoutes';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, hasRole } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    // Redirect to their default dashboard based on role
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
