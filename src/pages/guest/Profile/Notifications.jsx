import React, { useEffect, useState } from "react";
import axios from "../../../services/axiosClient"; // Adjust the import path as necessary
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("nameid");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`/notifications`, {
          params: { userId },
        });
        const sortedNotifications = (response.data || []).sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setNotifications(sortedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center mt-5">
        <ProgressSpinner />
      </div>
    );
  }

  const dateTemplate = (rowData) => {
    return new Date(rowData.date).toLocaleString();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      <DataTable
        value={notifications}
        responsiveLayout="scroll"
        emptyMessage="No notifications available."
        paginator
        rows={10}
      >
        {/* <Column
          field="title"
          header="Title"
          sortable
          style={{ width: "30%" }}
        /> */}
        <Column field="message" header="Message" sortable />
        <Column
          field="date"
          header="Date"
          body={dateTemplate}
          style={{ width: "20%" }}
          sortable
        />
      </DataTable>
    </div>
  );
};

export default Notifications;
