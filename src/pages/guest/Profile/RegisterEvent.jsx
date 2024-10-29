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
import { useTranslation } from "react-i18next";

const RegisterEvent = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const userId = localStorage.getItem("nameid");
      if (!userId) {
        const err = new Error(t("errors.userIdNotFound")); // Use translation for error message
        setError(err);
        toast.error(err.message);
        setLoading(false);
        return;
      }

      try {
        const data = await gets(`/events/user/${userId}`);
        if (!Array.isArray(data)) {
          throw new Error(t("errors.expectedArray")); // Use translation for expected array message
        }
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [t]); // Add t as a dependency

  if (loading)
    return <ProgressSpinner style={{ width: "50px", height: "50px" }} />;
  if (error) return <Message severity="error" text={error.message} />;
  if (events.length === 0) {
    toast.info(t("info.noEventsAvailable")); // Use translation for no events message
    return <Message severity="info" text={t("info.noEventsAvailable")} />;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">
        {t("header.eventList")}
      </h2>
      <DataTable value={events} paginator rows={10} role="table">
        <Column
          header={t("columns.number")} // Use translation for column header
          body={(rowData, { rowIndex }) => rowIndex + 1}
          sortable
        />
        <Column field="name" header={t("columns.name")} sortable />
        <Column
          field="date"
          header={t("columns.date")} // Use translation for column header
          sortable
          body={(rowData) => {
            const date = new Date(rowData.date);
            return isNaN(date)
              ? t("errors.invalidDate")
              : date.toLocaleString();
          }}
        />
        <Column field="location" header={t("columns.location")} sortable />
      </DataTable>
    </div>
  );
};

export default RegisterEvent;
