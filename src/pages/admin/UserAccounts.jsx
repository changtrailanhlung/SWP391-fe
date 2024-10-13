import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from 'primereact/button';
import axios from "../../services/axiosClient"; // Import your API utility

const UserAccounts = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    location: "",
    phone: "",
    status: true,
    password: "",
    role: ""
  });
  const [first, setFirst] = useState(0);
const [rows, setRows] = useState(10);
const [totalRecords, setTotalRecords] = useState(0); // Add total records state

  const [errors, setErrors] = useState({});
  const toast = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users"); // Fetch user data
        setUsers(response.data); // Update state with user data
      } catch (error) {
        console.error(error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Could not fetch users",
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  

  const imageBodyTemplate = (rowData) => {
    return <img src={rowData.image} alt={rowData.username} className="w-16 h-16 object-cover rounded-lg" />;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });

    // Clear error when user starts typing in the input
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const findFormErrors = () => {
    const { username, email, location, phone, password, role } = newUser;
    const newErrors = {};
    if (!username || username === '') newErrors.username = 'Username is required';
    if (!email || email === '') newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!location || location === '') newErrors.location = 'Location is required';
    if (!phone || phone === '') newErrors.phone = 'Phone is required';
    else if (!/^\d+$/.test(phone)) newErrors.phone = 'Phone should only contain numbers';
    if (!password || password === '') newErrors.password = 'Password is required';
    if (!role || role === '') newErrors.role = 'Role is required';
    return newErrors;
  };
  const resetNewUser = () => {
    setNewUser({
      username: "",
      email: "",
      location: "",
      phone: "",
      status: true,
      password: "",
      role: ""
    });
  };
  const handleCreateUser = async () => {
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill out all fields correctly",
        life: 3000,
      });
      return;
    }

    try {
      const response = await axios.post("/auth/register", newUser);
      if (response.status === 201) {
        setUsers([...users, response.data]);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "User created successfully",
          life: 3000,
        });
        setVisible(false);
        setNewUser({
          username: "",
          email: "",
          location: "",
          phone: "",
          status: true,
          password: "",
          role: ""
        });
      }
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Could not create user",
        life: 3000,
      }
    );
    
    }}
    const roleBodyTemplate = (rowData) => {
      const roleClasses = {
        admin: 'bg-red-500 text-white font-bold py-1 px-2 rounded-lg',
        shelterstaff: 'bg-green-500 text-white font-bold py-1 px-2 rounded-lg',
        donor: 'bg-yellow-500 text-white font-bold py-1 px-2 rounded-lg',
        volunteer: 'bg-blue-500 text-white font-bold py-1 px-2 rounded-lg',
        adopter: 'bg-purple-500 text-white font-bold py-1 px-2 rounded-lg'
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
    
    
  return (
    <div className="container mx-auto p-4">
      <Toast ref={toast} />
      <h2 className="text-3xl font-bold mb-6 text-gray-800">User Accounts</h2>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Nút để mở dialog tạo tài khoản */}
        <Button label="Create User" icon="pi pi-plus" onClick={() => setVisible(true)} />
        
        <DataTable
          value={users}
          loading={loading}
          paginator
          rows={10}
          className="p-datatable-custom"
          tableStyle={{ minWidth: "50rem" }} // Minimum width for responsiveness
        >
          <Column
            header="No."
            body={(rowData, { rowIndex }) => rowIndex + 1}
            className="border border-gray-300 p-2"
            headerClassName="bg-gray-200 text-gray-800 border border-gray-300 p-2"
          />
          <Column
            header="Image"
            body={imageBodyTemplate}
            className="border border-gray-300 p-2"
            headerClassName="bg-gray-200 text-gray-800 border border-gray-300 p-2"
          />
          <Column
            field="username"
            header="Username"
            sortable
            className="border border-gray-300 p-2"
            headerClassName="bg-gray-200 text-gray-800 border border-gray-300 p-2"
          />
          <Column
            field="email"
            header="Email"
            sortable
            className="border border-gray-300 p-2"
            headerClassName="bg-gray-200 text-gray-800 border border-gray-300 p-2"
          />
          <Column
            field="phone"
            header="Phone"
            sortable
            className="border border-gray-300 p-2"
            headerClassName="bg-gray-200 text-gray-800 border border-gray-300 p-2"
          />
          <Column
            field="location"
            header="Location"
            sortable
            className="border border-gray-300 p-2"
            headerClassName="bg-gray-200 text-gray-800 border border-gray-300 p-2"
          />
          <Column
          header="Roles"
          body={roleBodyTemplate}
          className="border border-gray-300 p-2"
          headerClassName="bg-gray-200 text-gray-800 border border-gray-300 p-2"
        />

        </DataTable>
      </div>

      {/* Overlay and Dialog */}
      {visible && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-3/5 mx-auto">
      <h3 className="text-2xl mb-4">Create User</h3>
      <div className="p-fluid space-y-6">
        <div className="p-field">
          <label htmlFor="username" className="block text-lg font-medium">Username</label>
          <div className="relative">
            <i className="pi pi-user absolute left-3 top-3 text-gray-500 text-2xl" /> {/* Doubled icon size */}
            <input
              id="username"
              name="username"
              value={newUser.username}
              onChange={handleInputChange}
              type="text"
              required
              className="p-inputtext p-component pl-10 text-lg py-3 w-full border-2 border-gray-300 rounded-lg" 
            />
          </div>
          {errors.username && <small className="text-red-500">{errors.username}</small>}
        </div>

        <div className="p-field">
          <label htmlFor="email" className="block text-lg font-medium">Email</label>
          <div className="relative">
            <i className="pi pi-envelope absolute left-3 top-3 text-gray-500 text-2xl" />
            <input
              id="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              type="email"
              required
              className="p-inputtext p-component pl-10 text-lg py-3 w-full border-2 border-gray-300 rounded-lg"
            />
          </div>
          {errors.email && <small className="text-red-500">{errors.email}</small>}
        </div>

        <div className="p-field">
          <label htmlFor="location" className="block text-lg font-medium">Location</label>
          <div className="relative">
            <i className="pi pi-map-marker absolute left-3 top-3 text-gray-500 text-2xl" />
            <input
              id="location"
              name="location"
              value={newUser.location}
              onChange={handleInputChange}
              type="text"
              required
              className="p-inputtext p-component pl-10 text-lg py-3 w-full border-2 border-gray-300 rounded-lg"
            />
          </div>
          {errors.location && <small className="text-red-500">{errors.location}</small>}
        </div>

        <div className="p-field">
          <label htmlFor="phone" className="block text-lg font-medium">Phone</label>
          <div className="relative">
            <i className="pi pi-phone absolute left-3 top-3 text-gray-500 text-2xl" />
            <input
              id="phone"
              name="phone"
              value={newUser.phone}
              onChange={handleInputChange}
              type="text"
              required
              className="p-inputtext p-component pl-10 text-lg py-3 w-full border-2 border-gray-300 rounded-lg"
            />
          </div>
          {errors.phone && <small className="text-red-500">{errors.phone}</small>}
        </div>

        <div className="p-field">
          <label htmlFor="password" className="block text-lg font-medium">Password</label>
          <div className="relative">
            <i className="pi pi-lock absolute left-3 top-3 text-gray-500 text-2xl" />
            <input
              id="password"
              name="password"
              value={newUser.password}
              onChange={handleInputChange}
              type="password"
              required
              className="p-inputtext p-component pl-10 text-lg py-3 w-full border-2 border-gray-300 rounded-lg"
            />
          </div>
          {errors.password && <small className="text-red-500">{errors.password}</small>}
        </div>

        <div className="p-field">
          <label htmlFor="role" className="block text-lg font-medium">Role</label>
          <div className="relative">
            <i className="pi pi-user-edit absolute left-3 top-3 text-gray-500 text-2xl" />
            <select
              id="role"
              name="role"
              value={newUser.role}
              onChange={handleInputChange}
              required
              className="p-inputtext p-component pl-10 text-lg py-3 w-full border-2 border-gray-300 rounded-lg"
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="ShelterStaff">ShelterStaff</option>
            </select>
          </div>
          {errors.role && <small className="text-red-500">{errors.role}</small>}
        </div>

        <div className="p-field flex justify-center space-x-10">
          <Button
            label="Create"
            icon="pi pi-check"
            onClick={handleCreateUser}
            className="bg-blue-400 text-white font-bold py-2 px-4 rounded"
          />
          <Button
            label="Cancel"
            icon="pi pi-times"
            className="bg-red-400 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setVisible(false);
              resetNewUser(); // Clear the form fields
            }}
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
