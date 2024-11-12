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
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const userId = localStorage.getItem("nameid");
      if (!userId) {
        const err = new Error(t("errors.userIdNotFound"));
        setError(err);
        toast.error(err.message);
        setLoading(false);
        return;
      }

      try {
        const data = await gets(`/events/user/${userId}`);
        if (!Array.isArray(data)) {
          throw new Error(t("errors.expectedArray"));
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
  }, [t]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      return t("errors.invalidDate");
    }
    
    // Thêm 7 giờ vào thời gian
    date.setHours(date.getHours() + 7);
    
    // Format giờ:phút
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    // Format ngày/tháng/năm
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 vì tháng bắt đầu từ 0
    const year = date.getFullYear();

    // Trả về định dạng "HH:mm DD/MM/YYYY"
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  if (loading)
    return <ProgressSpinner style={{ width: "50px", height: "50px" }} />;
  if (error) return <Message severity="error" text={error.message} />;
  if (events.length === 0) {
    toast.info(t("info.noEventsAvailable"));
    return <Message severity="info" text={t("info.noEventsAvailable")} />;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">
        {t("header.eventList")}
      </h2>
      <DataTable value={events} paginator rows={10} role="table">
        <Column
          header={t("columns.number")}
          body={(rowData, { rowIndex }) => rowIndex + 1}
          sortable
        />
        <Column field="name" header={t("columns.name")} sortable />
        <Column
          field="date"
          header={t("columns.date")}
          sortable
          body={(rowData) => formatDateTime(rowData.date)}
        />
        <Column field="location" header={t("columns.location")} sortable />
      </DataTable>
    </div>
  );
};

export default RegisterEvent;