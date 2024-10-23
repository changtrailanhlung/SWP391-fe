// src/layouts/AdminLayout.jsx
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SidebarShelter from "../components/SlidebarShelter";
import { useAuth } from "../context/AuthContext";
const ShelterLayout = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.roles.includes("ShelterStaff")) {
      navigate("/");
    } else {
      setUser(storedUser);
    }
  }, [navigate, setUser]);

  if (!user || !user.roles.includes("ShelterStaff")) {
    return null; // Hiển thị loader hoặc một trang trắng khi đang kiểm tra xác thực
  }
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

export default ShelterLayout;
