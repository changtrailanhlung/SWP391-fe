import React, { useState } from "react";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const donorId = localStorage.getItem("nameid");
    if (!donorId) {
      navigate("/admin/login");
      return;
    }

    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("donorId", donorId);
    formData.append("shelterId", shelterId);

    // console.log("FormData:", formData); // Log for debugging

    try {
      const response = await axios.post("/donate/createdonate", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Specify the correct content type
        },
      });
      // console.log("Donation Response:", response.data);

      // Show success toast message

      toast.success(t("donation.successMessage"), {
        onClose: () => navigate("/donate"), // Navigate after toast closes
      });
    } catch (error) {
      console.error("Error creating donation:", error);
      if (error.response && error.response.data) {
        setError(t("error.donation") || "An error occurred.");
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
