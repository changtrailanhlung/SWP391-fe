// HistoryDonation.jsx
import React, { useEffect, useState } from "react";
import axios from "../../../services/axiosClient";
import { useTranslation } from "react-i18next";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const HistoryDonation = () => {
  const { t } = useTranslation();
  const [donations, setDonations] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const donorId = localStorage.getItem("nameid");

  useEffect(() => {
    const fetchDonationHistory = async () => {
      try {
        const donationResponse = await axios.get(`/donate`);
        const shelterResponse = await axios.get(`/shelter`);

        // console.log("Donor ID from localStorage:", donorId);
        // console.log("Donation data:", donationResponse.data);

        // Filter donations by donorId
        const donorDonations = donationResponse.data.filter(
          (donation) => String(donation.donorId) === donorId
        );
        // console.log("Filtered donations for donor:", donorDonations);

        const sortedDonations = donorDonations.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setDonations(sortedDonations);
        setShelters(shelterResponse.data);
      } catch (error) {
        console.error("Error fetching donation history or shelters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonationHistory();
  }, [donorId]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const getShelterNameById = (id) => {
    const shelter = shelters.find((shelter) => shelter.id === id);
    return shelter ? shelter.name : t("donationHistory.noData");
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
              field="shelterId"
              header={t("donationHistory.shelterId")}
              body={(rowData) => getShelterNameById(rowData.shelterId)}
              sortable
            />
          </DataTable>
        )}
      </div>
    </div>
  );
};

export default HistoryDonation;
