// src/routes/AdminRoutes.jsxsrc/routes/AdminRoutes.jsx
import React from "react";
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Login from "../pages/admin/Login";
import Signup from "../pages/admin/Signup";
import UserAccounts from "../pages/admin/UserAccounts";
import Shelter from "../pages/admin/Shelter";
import Roles from "../pages/admin/Roles";
import Feedback from '../pages/admin/Feedback';
import PrivateRoute from "./PrivateRoute"; 

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route element={<AdminLayout />}>
        <Route
          path="dashboard"
          element={<PrivateRoute element={<Dashboard />} allowedRoles={['Admin']} />}
        />
        <Route
          path="users"
          element={<PrivateRoute element={<UserAccounts />} allowedRoles={['Admin']} />}
        />
        <Route
          path="shelter"
          element={<PrivateRoute element={<Shelter />} allowedRoles={['Admin']} />}
        />
        <Route
          path="roles"
          element={<PrivateRoute element={<Roles />} allowedRoles={['Admin']} />}
        />
        <Route
        path="feedback"
        element={<PrivateRoute element={<Feedback />} allowedRoles={['Admin']} />}
      />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
