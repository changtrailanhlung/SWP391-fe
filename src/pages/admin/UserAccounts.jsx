// src/pages/admin/UserAccounts.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../services/axiosClient';

const UserAccounts = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/admin/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách người dùng:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>User Accounts</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserAccounts;
