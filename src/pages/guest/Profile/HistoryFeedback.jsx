import React, { useEffect, useState } from "react";
import axios from "../../../services/axiosClient";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css"; // Change the theme as needed
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const HistoryFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("nameid");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("/feedback"); // Use axios to call API
        const data = response.data;

        // Filter and sort feedbacks by userId and date (most recent first)
        const userFeedbacks = data
          .filter((feedback) => feedback.userId === Number(userId))
          .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending

        setFeedbacks(userFeedbacks);
      } catch (error) {
        setError("Error fetching feedbacks. Please try again later.");
        console.error("Error fetching feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [userId]);

  if (loading) {
    return <div>Loading feedbacks...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Feedback History</h2>
      {feedbacks.length === 0 ? (
        <p>No feedbacks found.</p>
      ) : (
        <DataTable value={feedbacks} paginator rows={10}>
          <Column field="description" header="Description" />
          <Column
            field="date"
            header="Date"
            body={(rowData) => new Date(rowData.date).toLocaleString()}
          />
        </DataTable>
      )}
    </div>
  );
};

export default HistoryFeedback;
