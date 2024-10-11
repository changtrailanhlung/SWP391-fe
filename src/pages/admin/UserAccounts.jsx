// src/pages/admin/UserAccounts.jsx

import React, { useEffect, useState } from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Selection,
  Inject,
  Edit,
  Toolbar,
  Sort,
  Filter
} from '@syncfusion/ej2-react-grids';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../services/axiosClient";

const UserAccounts = () => {
  const [users, setUsers] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users');
        const usersWithRoles = await Promise.all(
          response.data.map(async (user) => {
            const roleResponse = await axios.get(`/userrole/role/${user.id}/roles`);
            const rolesArray = roleResponse.data.map(role => role.roles).flat();
            return { ...user, roles: rolesArray.join(', ') };
          })
        );
        setUsers(usersWithRoles);
      } catch (error) {
        console.error('Lỗi khi tải danh sách người dùng:', error);
        if (error.response && error.response.status === 401) {
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          navigate("/admin/login");
        } else {
          toast.error("Có lỗi xảy ra khi tải danh sách người dùng.");
        }
      }
    };

    fetchUsers();
  }, [navigate]);

  const selectionSettings = { persistSelection: true };
  const toolbarOptions = ['Delete'];
  const editing = { allowDeleting: true, allowEditing: true };

  const userColumns = [
    { field: 'username', headerText: t('username'), width: '120', textAlign: 'Center' },
    { field: 'email', headerText: t('email'), width: '150', textAlign: 'Center' },
    { field: 'phone', headerText: t('phone'), width: '120', textAlign: 'Center', template: (row) => row.phone || 'N/A' },
    { field: 'password', headerText: t('password'), width: '120', textAlign: 'Center', template: () => '********' },
    { field: 'location', headerText: t('location'), width: '120', textAlign: 'Center', template: (row) => row.location || 'N/A' },
    { field: 'roles', headerText: t('roles'), width: '150', textAlign: 'Center' },
  ];

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      
      <div className="mb-10">
    <p className="text-lg text-gray-400">Page</p>
    <p className="text-3xl font-extrabold tracking-tight text-slate-900">
      {t("userAccounts")}
    </p>
  </div>
      <GridComponent
        dataSource={users}
        allowPaging
        pageSettings={{ pageCount: 5 }}
        selectionSettings={selectionSettings}
        toolbar={toolbarOptions}
        editSettings={editing}
        allowSorting
        allowFiltering
        enableHover={false}
      >
        <ColumnsDirective>
          {userColumns.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter]} />
      </GridComponent>
    </div>
  );
};

export default UserAccounts;
