import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div>
      <main className="p-4">
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;
