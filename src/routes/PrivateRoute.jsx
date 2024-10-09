// src/routes/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, allowedRoles }) => {
  const userRoles = JSON.parse(localStorage.getItem('userRoles')) || [];

  const isAuthorized = userRoles.some(role => allowedRoles.includes(role));

  return isAuthorized ? element : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;
