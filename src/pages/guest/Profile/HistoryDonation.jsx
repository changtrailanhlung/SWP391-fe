// HistoryDonation.jsx
import React, { useEffect, useState } from "react";
import axios from "../../../services/axiosClient"; // Import your axios instance
import { useTranslation } from "react-i18next";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const HistoryDonation = () => {
  const { t } = useTranslation();
  const [donations, setDonations] = useState([]);
  const [shelters, setShelters] = useState([]); // State to hold shelter data
  const [loading, setLoading] = useState(true);
  const donorId = localStorage.getItem("nameid"); // Assuming the donor ID is stored in localStorage

  useEffect(() => {
    const fetchDonationHistory = async () => {
      try {
        const donationResponse = await axios.get(`/donate`);
        const shelterResponse = await axios.get(`/shelter`); // Fetch all shelters
        console.log(donationResponse.data); // Log the donation response data
        console.log(shelterResponse.data); // Log the shelter response data

        // Sort donations by date in descending order
        const sortedDonations = donationResponse.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setDonations(sortedDonations); // Set the sorted donations
        setShelters(shelterResponse.data); // Set the shelter data
      } catch (error) {
        console.error("Error fetching donation history or shelters:", error);
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

  // Function to get the shelter name by ID
  const getShelterNameById = (id) => {
    const shelter = shelters.find((shelter) => shelter.id === id);
    return shelter ? shelter.name : t("donationHistory.noData"); // Return shelter name or no data message
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
            <Column
              field="shelterId" // Add a new column for shelterId
              header={t("donationHistory.shelterId")}
              body={(rowData) => getShelterNameById(rowData.shelterId)} // Display shelter name
              sortable
            />
          </DataTable>
        )}
      </div>
    </div>
  );
};

export default HistoryDonation;
