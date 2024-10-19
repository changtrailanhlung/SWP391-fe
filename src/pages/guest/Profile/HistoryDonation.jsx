// HistoryDonation.jsx
import React, { useEffect, useState } from "react";
import axios from "../../../services/axiosClient"; // Import your axios instance
import { useTranslation } from "react-i18next";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const HistoryDonation = () => {
  const { t } = useTranslation();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const donorId = localStorage.getItem("nameid"); // Assuming the donor ID is stored in localStorage

  useEffect(() => {
    const fetchDonationHistory = async () => {
      try {
        const response = await axios.get(`/donate/by-donor/${donorId}`);
        console.log(response.data); // Log the response data

        // Sort donations by date in descending order
        const sortedDonations = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setDonations(sortedDonations); // Set the sorted donations
      } catch (error) {
        console.error("Error fetching donation history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonationHistory();
  }, [donorId]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>; // Add a loading spinner or message if desired
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString(); // Format date as needed
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">
        {t("donationHistory.title")}
      </h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        {donations.length === 0 ? (
          <p className="text-center text-gray-500">
            {t("donationHistory.noData")}
          </p>
        ) : (
          <DataTable
            value={donations}
            paginator
            rows={10}
            className="datatable"
          >
            <Column
              header={t("no")}
              body={(rowData, { rowIndex }) => rowIndex + 1}
              sortable
            />
            <Column
              field="amount"
              header={t("donationHistory.amount")}
              body={(rowData) => `${rowData.amount.toLocaleString()} VND`}
              sortable
            />
            <Column
              field="date"
              header={t("donationHistory.date")}
              body={(rowData) => formatDate(rowData.date)}
              sortable
            />
          </DataTable>
        )}
      </div>
    </div>
  );
};

export default HistoryDonation;
