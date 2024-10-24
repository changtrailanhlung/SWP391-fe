import React, { useEffect, useState } from "react";
import { gets } from "../../../services/axiosClient";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Message } from "primereact/message";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const RegisterEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const userId = localStorage.getItem("nameid");
      if (!userId) {
        setError(new Error("User ID not found."));
        setLoading(false);
        return;
      }

      try {
        const data = await gets(`/events/user/${userId}`);
        setEvents(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <Message severity="error" text={error.message} />;

  return (
    <DataTable value={events} paginator rows={10} header="Event List">
      <Column
        header="No."
        body={(rowData, { rowIndex }) => rowIndex + 1} // Serial number column
      />
      <Column field="name" header="Name" />
      <Column
        field="date"
        header="Date"
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
      <Column field="location" header="Location" />
    </DataTable>
  );
};

export default RegisterEvent;
