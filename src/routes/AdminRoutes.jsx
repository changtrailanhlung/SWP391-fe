import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import Login from "../pages/admin/Login";
import Sidebar from "../components/Sidebar";
import PrivateRoute from "./PrivateRoute"; 

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route
        path="/*"
        element={
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-grow p-6 bg-gray-100">
              <Routes>
                <Route
                  path="dashboard"
                  element={<PrivateRoute element={<Dashboard />} />}
                />
              </Routes>
            </main>
          </div>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;
