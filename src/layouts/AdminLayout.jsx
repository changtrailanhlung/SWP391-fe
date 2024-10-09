// src/layouts/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "../components/SidebarAdmin";
import AdminNavbar from "../components/AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <SidebarAdmin className="w-64" />

      <div className="flex-grow bg-gray-100 min-h-screen">
        <AdminNavbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
