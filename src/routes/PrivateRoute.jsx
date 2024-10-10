import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust the path as necessary

const PrivateRoute = ({ element, allowedRoles }) => {
  const { user } = useAuth(); // Assuming `user` contains user info including roles

  const isAllowed = user && user.roles && user.roles.some(role => allowedRoles.includes(role)); // Replace `user.role` with your logic
  

  return isAllowed ? element : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;
