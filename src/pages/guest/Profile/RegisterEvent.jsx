import React, { useEffect, useState } from "react";
import { gets } from "../../../services/axiosClient";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Message } from "primereact/message";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { ProgressSpinner } from "primereact/progressspinner";

const RegisterEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const userId = localStorage.getItem("nameid");
      if (!userId) {
        const err = new Error("User ID not found.");
        setError(err);
        toast.error(err.message);
        setLoading(false);
        return;
      }

      try {
        const data = await gets(`/events/user/${userId}`);
        if (!Array.isArray(data)) {
          throw new Error("Expected an array of events.");
        }
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setEvents(data);
        toast.success("Events loaded successfully!");
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading)
    return <ProgressSpinner style={{ width: "50px", height: "50px" }} />;
  if (error) return <Message severity="error" text={error.message} />;
  if (events.length === 0) {
    toast.info("No events available.");
    return <Message severity="info" text="No events available." />;
  }

  return (
    <DataTable
      value={events}
      paginator
      rows={10}
      header="Event List"
      role="table"
    >
      <Column
        header="No."
        body={(rowData, { rowIndex }) => rowIndex + 1}
        sortable
      />
      <Column field="name" header="Name" sortable />
      <Column
        field="date"
        header="Date"
        sortable
        body={(rowData) => {
          const date = new Date(rowData.date);
          return isNaN(date) ? "Invalid Date" : date.toLocaleString();
        }}
      />
      <Column
        field="description"
        header="Description"
        body={(rowData) => (
          <div dangerouslySetInnerHTML={{ __html: rowData.description }} />
        )}
      />
      <Column field="location" header="Location" sortable />
    </DataTable>
  );
};

export default RegisterEvent;
