import React, { useEffect, useState } from "react";
import axios from "../../../services/axiosClient"; // Adjust the import path as necessary
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { useTranslation } from "react-i18next"; // Import useTranslation

const Notifications = () => {
  const { t } = useTranslation(); // Initialize translation
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
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">
        {t("notifications.title")}
      </h2>
      <DataTable
        value={notifications}
        responsiveLayout="scroll"
        emptyMessage={t("notifications.emptyMessage")}
        paginator
        rows={10}
      >
        <Column
          field="title"
          header={t("notifications.titleHeader")}
          sortable
          style={{ width: "30%" }}
        />
        <Column
          field="message"
          header={t("notifications.messageHeader")}
          sortable
        />
        <Column
          field="date"
          header={t("notifications.dateHeader")}
          body={dateTemplate}
          style={{ width: "20%" }}
          sortable
        />
      </DataTable>
    </div>
  );
};

export default Notifications;
