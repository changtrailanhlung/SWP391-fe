// src/layouts/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import SidebarShelter from "../components/SidebarAdmin";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <SidebarShelter className="w-64" />

      <div className="flex-grow bg-gray-100 min-h-screen">
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
