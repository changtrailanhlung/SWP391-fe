import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SidebarAdmin from "../components/SidebarAdmin";
import AdminNavbar from "../components/AdminNavbar";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.roles.includes("Admin")) {
      navigate("/");
    } else {
      setUser(storedUser);
    }
  }, [navigate, setUser]);

  if (!user || !user.roles.includes("Admin")) {
    return null; // Hiển thị loader hoặc một trang trắng khi đang kiểm tra xác thực
  }

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
