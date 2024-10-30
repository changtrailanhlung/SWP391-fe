import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../services/axiosClient"; // Adjust the import path as necessary
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify"; // Import toast

const DonationForm = () => {
  const { shelterId } = useParams(); // Get shelterId from URL parameters
  const navigate = useNavigate(); // Initialize navigate
  const { t } = useTranslation(); // Initialize translation

  const [amount, setAmount] = useState(""); // Default amount
  const [error, setError] = useState(""); // State for error messages
  const [walletBalance, setWalletBalance] = useState(0); // State for wallet balance

  useEffect(() => {
    const fetchWalletBalance = async () => {
      const donorId = localStorage.getItem("nameid");
      if (!donorId) return;

      try {
        const response = await axios.get(`/api/users/${donorId}`);
        setWalletBalance(response.data.wallet); // Set wallet balance from API response
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
        toast.error(t("error.fetchWalletBalance"));
      }
    };

    fetchWalletBalance();
  }, [t]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const donorId = localStorage.getItem("nameid");
    if (!donorId) {
      navigate("/admin/login");
      return;
    }

    // Check if donation amount exceeds wallet balance
    if (amount > walletBalance) {
      toast.error(t("error.insufficientFunds")); // Display insufficient funds error
      return;
    }

    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("donorId", donorId);
    formData.append("shelterId", shelterId);

    console.log("FormData:", formData); // Log for debugging

    try {
      const response = await axios.post("/donate/createdonate", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Specify the correct content type
        },
      });
      console.log("Donation Response:", response.data);

      // Show success toast message
      toast.success(t("donation.successMessage"));

      navigate("/donate");
    } catch (error) {
      console.error("Error creating donation:", error);
      if (error.response && error.response.data) {
        setError(error.response.data.message || "An error occurred.");
      } else {
        setError("An error occurred while processing your donation.");
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        {t("donation.formTitle")}
      </h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {/* Display error message */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 max-w-md mx-auto"
      >
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-semibold">
            {t("donation.amount")}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            min="1"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200 font-semibold"
        >
          {t("donation.submit")}
        </button>
      </form>
    </div>
  );
};

export default DonationForm;
