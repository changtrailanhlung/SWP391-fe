// HistoryDonation.jsx
import React, { useEffect, useState } from "react";
import axios from "../../../services/axiosClient"; // Import your axios instance

const HistoryDonation = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const donorId = localStorage.getItem("nameid"); // Assuming the donor ID is stored in localStorage

  useEffect(() => {
    const fetchDonationHistory = async () => {
      try {
        const response = await axios.get(`/donate/by-donor/${donorId}`);
        console.log(response.data); // Log the response data
        setDonations(response.data); // Assuming the response is an array of donations
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

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Donation History</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        {donations.length === 0 ? (
          <p className="text-center">{`No donations found.`}</p>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Amount (VND)</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">
                    {donation.amount.toLocaleString()} VND
                  </td>
                  <td className="px-4 py-2">
                    {new Date(donation.date).toLocaleString()}{" "}
                    {/* Format date as needed */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistoryDonation;
