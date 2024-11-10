import React, { useEffect, useState } from "react";
import axios from "../../../services/axiosClient";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useTranslation } from "react-i18next"; // Import useTranslation
import "primereact/resources/themes/saga-blue/theme.css"; // Change the theme as needed
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const HistoryFeedback = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("nameid");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("/feedback");
        const data = response.data;

        const userFeedbacks = data
          .filter((feedback) => feedback.userId === Number(userId))
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setFeedbacks(userFeedbacks);
      } catch (error) {
        setError(t("error")); // Use translation for error message
        console.error("Error fetching feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [userId, t]); // Include t in dependencies

  if (loading) {
    return <div>{t("loading")}</div>; // Use translation for loading message
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">
        {t("feedbackHistory")}
      </h2>
      {feedbacks.length === 0 ? (
        <p>{t("noFeedbacks")}</p> // Use translation for no feedbacks message
      ) : (
        <DataTable value={feedbacks} paginator rows={10}>
          <Column field="description" header={t("description")} />
          <Column
            field="date"
            header={t("date")}
            body={(rowData) => new Date(rowData.date).toLocaleString()}
          />
        </DataTable>
      )}
    </div>
  );
};

export default HistoryFeedback;
