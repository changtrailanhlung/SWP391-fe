import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import api from "../../services/axiosClient"; // Import your API utility

const UserAccounts = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = React.useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users"); // Fetch user data
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

  return (
    <div className="container mx-auto p-4">
      <Toast ref={toast} />
      <h2 className="text-3xl font-bold mb-6 text-gray-800">User Accounts</h2>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <DataTable
          value={users}
          loading={loading}
          paginator
          rows={10}
          className="p-datatable-custom"
          tableStyle={{ minWidth: "50rem" }} // Minimum width for responsiveness
        >
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
        </DataTable>
      </div>
    </div>
  );
};

export default UserAccounts;
