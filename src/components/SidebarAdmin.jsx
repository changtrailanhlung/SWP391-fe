// src/components/Sidebar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MDBIcon } from 'mdb-react-ui-kit';

const SidebarAdmin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRoles');
    navigate('/admin/login');
  };

  return (
    <div className="bg-gray-800 text-white w-64 h-screen p-6">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <ul className="space-y-4">
        <li>
          <Link to="/admin/dashboard" className="hover:text-gray-300">
            <MDBIcon icon="chart-line" /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className="hover:text-gray-300">
            <MDBIcon icon="users" /> User Accounts
          </Link>
        </li>
        <li>
          <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
            <MDBIcon icon="sign-out-alt" /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SidebarAdmin;
