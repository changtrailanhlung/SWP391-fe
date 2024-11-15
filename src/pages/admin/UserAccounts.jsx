import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { FileUpload } from "primereact/fileupload";
import { useTranslation } from "react-i18next";
import axios from "../../services/axiosClient"; // Import your API utility

import { Dropdown } from "primereact/dropdown";

const UserAccounts = () => {
  const { t, i18n } = useTranslation();
  const [users, setUsers] = useState([]);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [updateRoleType, setUpdateRoleType] = useState("");
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    location: "",
    phone: "",
    status: true,
    password: "",
    shelterId: "",
    roleIds: [],
    image: null,
  });
  const resetNewUser = () => {
    setNewUser({
      username: "",
      email: "",
      location: "",
      phone: "",
      status: true,
      password: "",
      shelterId: "",
      roleIds: [],
      image: null,
    });
  };
  const updateRoleOptions = [
    { label: t('roles.admin'), value: "admin" },
    { label: t('roles.shelterStaff'), value: "shelterStaff" },
    { label: t('roles.otherRoles'), value: "otherRoles" },
  ];

  const otherRoleOptions = [
    { label: t('roles.donor'), value: 3 },
    { label: t('roles.volunteer'), value: 4 },
    { label: t('roles.adopter'), value: 5 },
  ];

  const handleUpdateRoleTypeChange = (e) => {
    setUpdateRoleType(e.value);
    let updatedRoleIds = [];

    if (e.value === "admin") {
      updatedRoleIds = [1];
    } else if (e.value === "shelterStaff") {
      updatedRoleIds = [2];
    } else {
      updatedRoleIds = selectedUser.roleIds.filter((id) =>
        [3, 4, 5].includes(id)
      );
    }

    setSelectedUser((prevUser) => ({
      ...prevUser,
      roleIds: updatedRoleIds,
      shelterId: e.value === "shelterStaff" ? prevUser.shelterId || "" : "",
    }));
  };

  const handleOtherRolesChange = (e) => {
    setSelectedUser((prevUser) => ({
      ...prevUser,
      roleIds: e.value,
    }));
  };
  const handleCreateRoleChange = (e) => {
    const { value } = e.target;
    let updatedRoleIds = [];

    if (value === "admin") {
      updatedRoleIds = [1];
    } else if (value === "shelterStaff") {
      updatedRoleIds = [2];
    } else if (value === "otherRoles") {
      updatedRoleIds = [];
    }

    setNewUser((prevUser) => ({
      ...prevUser,
      roleIds: updatedRoleIds,
      shelterId: value === "shelterStaff" ? "" : prevUser.shelterId,
    }));
  };
  const handleUpdateRoleChange = (e) => {
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        roleIds: e.value,
        shelterId: e.value.includes(2) ? selectedUser.shelterId : "",
      });
    }
  };
  const handleUpdateUser = async () => {
    if (!selectedUser) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không có người dùng được chọn để cập nhật",
        life: 3000,
      });
      return;
    }

    const newErrors = findFormErrors(selectedUser);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Vui lòng điền đầy đủ thông tin",
        life: 3000,
      });
      return;
    }
    const formData = new FormData();
    for (const key in selectedUser) {
      if (key === "roleIds") {
        selectedUser[key].forEach((roleId) =>
          formData.append("RoleIds", roleId)
        );
      } else if (
        key === "image" &&
        selectedUser[key] &&
        typeof selectedUser[key] !== "string"
      ) {
        formData.append("Image", selectedUser[key]);
      } else if (key === "shelterId" && selectedUser[key] !== "") {
        formData.append("ShelterId", selectedUser[key]);
      } else if (key !== "id" && key !== "roles") {
        formData.append(
          key.charAt(0).toUpperCase() + key.slice(1),
          selectedUser[key]
        );
      }
    }
    try {
      const response = await axios.put(`/users/${selectedUser.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        fetchUsers(); // Refresh user list
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: "Cập nhật người dùng thành công",
          life: 3000,
        });
        setUpdateVisible(false);
        setSelectedUser(null);
        setErrors({}); // Đặt lại errors sau khi cập nhật thành công
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể cập nhật người dùng",
        life: 3000,
      });
    }
  };

  const handleEditUser = (user) => {
    const roleIds = user.roles.map((role) => {
      switch (role.toLowerCase()) {
        case "admin":
          return 1;
        case "shelterstaff":
          return 2;
        case "donor":
          return 3;
        case "volunteer":
          return 4;
        case "adopter":
          return 5;
        default:
          return 0;
      }
    });
    setSelectedUser({
      ...user,
      roleIds,
      shelterId: user.shelterId || "", // Đảm bảo shelterId luôn có giá trị, ngay cả khi là chuỗi rỗng
    });
    setErrors({}); // Đặt lại errors khi mở dialog chỉnh sửa
    setUpdateVisible(true);
  };

  
  const [errors, setErrors] = useState({});
  const toast = useRef(null);

  const roles = [
    { label: t('roles.admin'), value: 1 },
    { label: t('roles.shelterStaff'), value: 2 },
    { label: t('roles.donor'), value: 3 },
    { label: t('roles.volunteer'), value: 4 },
    { label: t('roles.adopter'), value: 5 },
  ];

  useEffect(() => {
    fetchUsers();
    fetchShelters();
  }, []);
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể tải danh sách người dùng",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  const fetchShelters = async () => {
    try {
      const response = await axios.get("/shelter");
      setShelters(
        response.data.map((shelter) => ({
          label: shelter.name,
          value: shelter.id,
        }))
      );
    } catch (error) {
      console.error("Error fetching shelters:", error);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể tải danh sách shelter",
        life: 3000,
      });
    }
  };

  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={rowData.image}
        alt={rowData.username}
        className="w-16 h-16 object-cover rounded-lg"
      />
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };
  const handleFileUpload = (event) => {
    setNewUser({ ...newUser, image: event.files[0] });
  };
  const handleRoleChange = (e) => {
    const { value } = e.target;
    if (value === "admin") {
      setNewUser({ ...newUser, roleIds: [1] });
    } else if (value === "shelterStaff") {
      setNewUser({ ...newUser, roleIds: [2], shelterId: "" });
    } else if (value === "otherRoles") {
      setNewUser({ ...newUser, roleIds: [] });
    }
  };
  const handleMultiSelectChange = (e) => {
    setNewUser({ ...newUser, roleIds: e.value });
  };
  const handleShelterChange = (e) => {
    setNewUser({ ...newUser, shelterId: e.value });
  };
  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(`/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
      toast.current.show({
        severity: "success",
        summary: "Deleted",
        detail: "User deleted successfully",
        life: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Could not delete user",
        life: 3000,
      });
    }
  };

  
  const findFormErrors = (user) => {
    const newErrors = {};
    if (user) {
      const { username, email, location, phone, roleIds, shelterId } = user;

      if (!username || username === "")
        newErrors.username = t('validation.usernameRequired');
      if (!email || email === "") 
        newErrors.email = t('validation.emailRequired');
      else if (!/\S+@\S+\.\S+/.test(email))
        newErrors.email = t('validation.emailInvalid');
      if (!location || location === "")
        newErrors.location = t('validation.locationRequired');
      if (!phone || phone === "") 
        newErrors.phone = t('validation.phoneRequired');
      if (!roleIds || roleIds.length === 0)
        newErrors.roleIds = t('validation.roleRequired');

      if (roleIds && roleIds.includes(2) && (!shelterId || shelterId === "")) {
        newErrors.shelterId = t('validation.shelterRequired');
      }
    } else {
      newErrors.general = t('validation.invalidUserData');
    }
    return newErrors;
  };

  const handleCreateUser = async () => {
    const newErrors = findFormErrors(newUser);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Vui lòng điền đầy đủ thông tin",
        life: 3000,
      });
      return;
    }

    const formData = new FormData();
    for (const key in newUser) {
      if (key === "roleIds") {
        newUser[key].forEach((roleId) => formData.append("RoleIds", roleId));
      } else if (key === "image" && newUser[key]) {
        formData.append("Image", newUser[key]);
      } else if (key === "shelterId" && newUser[key] !== "") {
        formData.append("ShelterId", newUser[key]);
      } else {
        formData.append(
          key.charAt(0).toUpperCase() + key.slice(1),
          newUser[key]
        );
      }
    }

    try {
      const response = await axios.post("/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        fetchUsers(); // Refresh user list
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: "Tạo người dùng mới thành công",
          life: 3000,
        });
        setVisible(false);
        resetNewUser();
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể tạo người dùng mới",
        life: 3000,
      });
    }
  };
  const roleBodyTemplate = (rowData) => {
    const roleClasses = {
      admin: "bg-red-500 text-white font-bold py-1 px-2 rounded-lg",
      shelterstaff: "bg-green-500 text-white font-bold py-1 px-2 rounded-lg",
      donor: "bg-yellow-500 text-white font-bold py-1 px-2 rounded-lg",
      volunteer: "bg-blue-500 text-white font-bold py-1 px-2 rounded-lg",
      adopter: "bg-purple-500 text-white font-bold py-1 px-2 rounded-lg",
    };

    return (
      <div className="flex flex-wrap">
        {rowData.roles.map((role, index) => (
          <span key={index} className={`${roleClasses[role.toLowerCase()]}`}>
            {role}
          </span>
        ))}
      </div>
    );
  };
  const actionsBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-full inline-flex items-center transition-colors duration-300"
          onClick={() => handleEditUser(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full inline-flex items-center transition-colors duration-300"
          onClick={() => handleDeleteUser(rowData.id)}
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Toast ref={toast} />
      <h2 className="text-3xl font-bold mb-6 text-gray-800">{t('common.userAccounts')}</h2>
      <Button
        label=" Create User"
        icon="pi pi-plus"
        class="bg-blue-500 text-white font-bold py-2 px-2 rounded-lg"
        onClick={() => setVisible(true)}
      />
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Nút để mở dialog tạo tài khoản */}

        <DataTable
          value={users}
          loading={loading}
          paginator
          rows={10}
          className="p-datatable-custom"
          tableStyle={{ minWidth: "50rem" }} // Minimum width for responsiveness
        >
          <Column
            header={t('table.no')}
            body={(rowData, { rowIndex }) => rowIndex + 1}
            className="border border-gray-300 p-2"
            headerClassName="bg-gray-200 text-gray-800 border border-gray-300 p-2"
          />
          <Column
            header={t('table.image')}
            body={imageBodyTemplate}
            className="border border-gray-300 p-2"
            headerClassName="bg-gray-200 text-gray-800 border border-gray-300 p-2"
          />
          <Column
            field="username"
            header={t('table.username')}
            sortable
            className="border border-gray-300 p-2"
            headerClassName="bg-gray-200 text-gray-800 border border-gray-300 p-2"
          />
          <Column
            field="email"
            header={t('table.email')}
            sortable
            className="border border-gray-300 p-2"
            headerClassName="bg-gray-200 text-gray-800 border border-gray-300 p-2"
          />
          <Column
            field="phone"
            header={t('table.phone')}
            sortable
            className="border border-gray-300 p-2"
            headerClassName="bg-gray-200 text-gray-800 border border-gray-300 p-2"
          />
          <Column
            field="location"
            header={t('table.location')}
            sortable
            className="border border-gray-300 p-2"
            headerClassName="bg-gray-200 text-gray-800 border border-gray-300 p-2"
          />
          <Column
            header={t('table.roles')}
            body={roleBodyTemplate}
            className="border border-gray-300 p-2"
            headerClassName="bg-gray-200 text-gray-800 border border-gray-300 p-2"
          />
          <Column
            header=""
            body={actionsBodyTemplate}
            className="border border-gray-300 p-2"
            headerClassName="bg-gray-200 text-gray-800 border border-gray-300 p-2"
          />
        </DataTable>
      </div>

      {/* Overlay and Dialog */}
      {visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ">
          <div className="bg-white p-6 rounded-lg w-4/5 max-h-[80vh] overflow-y-auto ">
            <h3 className="text-2xl font-bold mb-4">{t('dialog.createUser')}</h3>
            <div className="space-y-4">
              <div className="p-field">
                <label htmlFor="username" className="block text-lg font-medium">
                {t('table.username')}
                </label>
                <div className="relative">
                  <i className="pi pi-user absolute left-3 top-3 text-gray-500 text-2xl" />
                  <input
                    id="username"
                    name="username"
                    value={newUser.username}
                    onChange={handleInputChange}
                    type="text"
                    required
                    className="p-inputtext p-component pl-10 text-lg py-3 w-full border-2 border-gray-300 rounded-lg h-10"
                  />
                </div>
                {errors.username && (
                  <small className="text-red-500">{errors.username}</small>
                )}
              </div>
              <div className="p-field">
                <label htmlFor="email" className="block text-lg font-medium">
                {t('table.email')}
                </label>
                <div className="relative">
                  <i className="pi pi-envelope absolute left-3 top-3 text-gray-500 text-2xl" />
                  <input
                    id="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    type="email"
                    required
                    className="p-inputtext p-component pl-10 text-lg py-3 w-full border-2 border-gray-300 rounded-lg h-10"
                  />
                </div>
                {errors.email && (
                  <small className="text-red-500">{errors.email}</small>
                )}
              </div>
              <div className="p-field">
                <label htmlFor="password" className="block text-lg font-medium">
                {t('table.password')}
                </label>
                <div className="relative">
                  <i className="pi pi-lock absolute left-3 top-3 text-gray-500 text-2xl" />
                  <input
                    id="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    type="password"
                    required
                    className="p-inputtext p-component pl-10 text-lg py-3 w-full border-2 border-gray-300 rounded-lg h-10"
                  />
                </div>
                {errors.password && (
                  <small className="text-red-500">{errors.password}</small>
                )}
              </div>
              <div className="p-field">
                <label htmlFor="phone" className="block text-lg font-medium">
                {t('table.phone')}
                </label>
                <div className="relative">
                  <i className="pi pi-phone absolute left-3 top-3 text-gray-500 text-2xl" />
                  <input
                    id="phone"
                    name="phone"
                    value={newUser.phone}
                    onChange={handleInputChange}
                    type="tel"
                    required
                    className="p-inputtext p-component pl-10 text-lg py-3 w-full border-2 border-gray-300 rounded-lg h-10"
                  />
                </div>
                {errors.phone && (
                  <small className="text-red-500">{errors.phone}</small>
                )}
              </div>
              <div className="p-field">
                <label htmlFor="location" className="block text-lg font-medium">
                {t('table.location')}
                </label>
                <div className="relative">
                  <i className="pi pi-map-marker absolute left-3 top-3 text-gray-500 text-2xl" />
                  <input
                    id="location"
                    name="location"
                    value={newUser.location}
                    onChange={handleInputChange}
                    type="text"
                    required
                    className="p-inputtext p-component pl-10 text-lg py-3 w-full border-2 border-gray-300 rounded-lg h-10"
                  />
                </div>
                {errors.location && (
                  <small className="text-red-500">{errors.location}</small>
                )}
              </div>
              <div className="p-field">
                <label htmlFor="avatar" className="block text-lg font-medium">
                {t('table.image')}
                </label>
                <div className="relative">
                  <i className="pi pi-image absolute left-3 top-3 text-gray-500 text-2xl" />
                  <FileUpload
                    mode="basic"
                    name="image"
                    accept="image/*"
                    maxFileSize={1000000}
                    onSelect={handleFileUpload}
                    chooseLabel="Chọn ảnh"
                    className="p-inputtext p-component pl-12 text-base py-2 w-full border-2 border-gray-300 rounded-lg h-12 text-gray-700"
                  />
                </div>
              </div>
              <div className="p-field">
                <label htmlFor="role" className="block text-lg font-medium">
                {t('table.roles')}
                </label>
                <div className="flex flex-col space-y-2">
                  <div>
                    <input
                      type="radio"
                      id="adminRole"
                      name="roleType"
                      value="admin"
                      checked={
                        newUser.roleIds.includes(1) &&
                        newUser.roleIds.length === 1
                      }
                      onChange={handleCreateRoleChange}
                      className="mr-2"
                    />
                    <label htmlFor="adminRole">{t('roles.admin')}</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="staffRole"
                      name="roleType"
                      value="shelterStaff"
                      checked={
                        newUser.roleIds.includes(2) &&
                        newUser.roleIds.length === 1
                      }
                      onChange={handleRoleChange}
                      className="mr-2"
                    />
                    <label htmlFor="staffRole">{t('roles.shelterStaff')}</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="otherRoles"
                      name="roleType"
                      value="otherRoles"
                      checked={
                        newUser.roleIds.some((id) => [3, 4, 5].includes(id)) ||
                        newUser.roleIds.length === 0
                      }
                      onChange={handleRoleChange}
                      className="mr-2"
                    />
                    <label htmlFor="otherRoles">
                    {t('roles.otherRoles')}
                    </label>
                  </div>
                </div>
                {(newUser.roleIds.some((id) => [3, 4, 5].includes(id)) ||
                  newUser.roleIds.length === 0) && (
                  <div className="relative">
                    <i className="pi pi-list absolute left-3 top-3 text-gray-500 text-2xl" />
                    <MultiSelect
                      value={newUser.roleIds}
                      options={[
                        { label: t('roles.donor'), value: 3 },
                        { label: t('roles.volunteer'), value: 4 },
                        { label:t('roles.adopter'), value: 5 },
                      ]}
                      onChange={handleMultiSelectChange}
                      optionLabel="label"
                      placeholder={t('roles.chooseroles')}
                      maxSelectedLabels={3}
                      className="p-inputtext p-component pl-12 text-base py-2 w-full border-2 border-gray-300 rounded-lg h-12 text-gray-700"
                      panelClassName="bg-white shadow-lg rounded-md mt-2"
                      itemClassName="px-4 py-2 text-gray-700 hover:bg-gray-100"
                    />
                  </div>
                )}
                {errors.roleIds && (
                  <small className="text-red-500">{errors.roleIds}</small>
                )}
              </div>
              {newUser.roleIds.includes(2) && (
                <div className="p-field">
                  <label
                    htmlFor="shelter"
                    className="block text-lg font-medium"
                  >
                    {t('roles.Shelter')}
                  </label>
                  <div className="relative ">
                    <i className="pi pi-home absolute left-3 top-3 text-gray-500 text-2xl" />
                    <Dropdown
                      id="shelter"
                      value={newUser.shelterId}
                      options={shelters}
                      onChange={handleShelterChange}
                      placeholder={t('roles.Shelter')}
                      className="p-inputtext p-component pl-12 text-base py-2 w-full border-2 border-gray-300 rounded-lg h-12 text-gray-700"
                      panelClassName="bg-white shadow-lg rounded-md mt-2"
                      itemClassName="px-4 py-2 text-black-700 hover:bg-gray-100"
                    />
                  </div>
                  {errors.shelterId && (
                    <small className="text-red-500">{errors.shelterId}</small>
                  )}
                </div>
              )}
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  label={t('dialog.Cancel')}
                  icon="pi pi-times"
                  className="bg-red-400 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    setVisible(false);
                    resetNewUser();
                  }}
                />
                <Button
                  label={t('dialog.createUser')}
                  icon="pi pi-check"
                  className="bg-blue-400 text-white font-bold py-2 px-4 rounded"
                  onClick={handleCreateUser}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {updateVisible && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-4/5 max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">{t('dialog.updateUser')}</h3>
            <div className="space-y-4">
              {/* Username field */}
              <div className="p-field">
                <label htmlFor="username" className="block text-lg font-medium">
                {t('table.username')}
                </label>
                <div className="relative">
                  <i className="pi pi-user absolute left-3 top-3 text-gray-500 text-2xl" />
                  <input
                    id="username"
                    name="username"
                    value={selectedUser.username}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        username: e.target.value,
                      })
                    }
                    type="text"
                    required
                    className="p-inputtext p-component pl-10 text-lg py-3 w-full border-2 border-gray-300 rounded-lg h-10"
                  />
                </div>
                {errors.username && (
                  <small className="text-red-500">{errors.username}</small>
                )}
              </div>

              {/* Email field */}
              {/* <div className="p-field">
                <label htmlFor="email" className="block text-lg font-medium">
                  Email
                </label>
                <div className="relative">
                  <i className="pi pi-envelope absolute left-3 top-3 text-gray-500 text-2xl" />
                  <input
                    id="email"
                    name="email"
                    value={selectedUser.email}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        email: e.target.value,
                      })
                    }
                    type="email"
                    required
                    className="p-inputtext p-component pl-10 text-lg py-3 w-full border-2 border-gray-300 rounded-lg h-10"
                  />
                </div>
                {errors.email && (
                  <small className="text-red-500">{errors.email}</small>
                )}
              </div> */}

              {/* Phone field */}
              <div className="p-field">
                <label htmlFor="phone" className="block text-lg font-medium">
                {t('table.phone')}
                </label>
                <div className="relative">
                  <i className="pi pi-phone absolute left-3 top-3 text-gray-500 text-2xl" />
                  <input
                    id="phone"
                    name="phone"
                    value={selectedUser.phone}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        phone: e.target.value,
                      })
                    }
                    type="tel"
                    required
                    className="p-inputtext p-component pl-10 text-lg py-3 w-full border-2 border-gray-300 rounded-lg h-10"
                  />
                </div>
                {errors.phone && (
                  <small className="text-red-500">{errors.phone}</small>
                )}
              </div>

              {/* Location field */}
              <div className="p-field">
                <label htmlFor="location" className="block text-lg font-medium">
                {t('table.location')}
                </label>
                <div className="relative">
                  <i className="pi pi-map-marker absolute left-3 top-3 text-gray-500 text-2xl" />
                  <input
                    id="location"
                    name="location"
                    value={selectedUser.location}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        location: e.target.value,
                      })
                    }
                    type="text"
                    required
                    className="p-inputtext p-component pl-10 text-lg py-3 w-full border-2 border-gray-300 rounded-lg h-10"
                  />
                </div>
                {errors.location && (
                  <small className="text-red-500">{errors.location}</small>
                )}
              </div>

              {/* Image field */}
              <div className="p-field">
                <label htmlFor="avatar" className="block text-lg font-medium">
                {t('table.image')}
                </label>
                <div className="relative">
                  <i className="pi pi-image absolute left-3 top-3 text-gray-500 text-2xl" />
                  <FileUpload
                    mode="basic"
                    name="image"
                    accept="image/*"
                    maxFileSize={1000000}
                    onSelect={(e) =>
                      setSelectedUser({ ...selectedUser, image: e.files[0] })
                    }
                    chooseLabel="Chọn ảnh"
                    className="p-inputtext p-component pl-12 text-base py-2 w-full border-2 border-gray-300 rounded-lg h-12 text-gray-700"
                  />
                </div>
              </div>

              {/* Role field */}
              <div className="p-field">
                <label htmlFor="roleType" className="block text-lg font-medium">
                {t('table.roles')}
                </label>
                <div className="relative">
                  <i className="pi pi-list absolute left-3 top-3 text-gray-500 text-2xl" />
                  <Dropdown
                    value={updateRoleType}
                    options={updateRoleOptions}
                    onChange={handleUpdateRoleTypeChange}
                    placeholder={t('roles.chooseroles')}
                    className="p-inputtext p-component pl-12 text-base py-2 w-full border-2 border-gray-300 rounded-lg h-12 text-gray-700"
                    panelClassName="bg-white shadow-lg rounded-md mt-2"
                    itemClassName="px-4 py-2 text-gray-700 hover:bg-gray-100"
                  />
                </div>
              </div>

              {updateRoleType === "otherRoles" && (
                <div className="p-field">
                  <label
                    htmlFor="otherRoles"
                    className="block text-lg font-medium"
                  >
                    {t('roles.otherRoles')}
                  </label>
                  <div className="relative">
                    <i className="pi pi-users absolute left-3 top-3 text-gray-500 text-2xl" />
                    <MultiSelect
                      value={selectedUser.roleIds}
                      options={otherRoleOptions}
                      onChange={handleOtherRolesChange}
                      optionLabel="label"
                      placeholder={t('roles.chooseroles')}
                      maxSelectedLabels={3}
                      className="p-inputtext p-component pl-12 text-base py-2 w-full border-2 border-gray-300 rounded-lg h-12 text-gray-700"
                      panelClassName="bg-white shadow-lg rounded-md mt-2"
                      itemClassName="px-4 py-2 text-gray-700 hover:bg-gray-100"
                    />
                  </div>
                </div>
              )}

              {/* Shelter field (only for Shelter Staff) */}
              {updateRoleType === "shelterStaff" && (
                <div className="p-field">
                  <label
                    htmlFor="shelter"
                    className="block text-lg font-medium"
                  >
                    {t('roles.Shelter')}
                  </label>
                  <div className="relative">
                    <i className="pi pi-home absolute left-3 top-3 text-gray-500 text-2xl" />
                    <Dropdown
                      id="shelter"
                      value={selectedUser.shelterId}
                      options={shelters}
                      onChange={(e) =>
                        setSelectedUser({ ...selectedUser, shelterId: e.value })
                      }
                      placeholder={t('roles.Shelter')}
                      className="p-inputtext p-component pl-12 text-base py-2 w-full border-2 border-gray-300 rounded-lg h-12 text-gray-700"
                      panelClassName="bg-white shadow-lg rounded-md mt-2"
                      itemClassName="px-4 py-2 text-black-700 hover:bg-gray-100"
                    />
                  </div>
                  {errors.shelterId && (
                    <small className="text-red-500">{errors.shelterId}</small>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  label={t('dialog.Cancel')}
                  icon="pi pi-times"
                  className="bg-red-400 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    setUpdateVisible(false);
                    setSelectedUser(null);
                  }}
                />
                <Button
                  label={t('dialog.updateUser')}
                  icon="pi pi-check"
                  className="bg-blue-400 text-white font-bold py-2 px-4 rounded"
                  onClick={handleUpdateUser}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccounts;
