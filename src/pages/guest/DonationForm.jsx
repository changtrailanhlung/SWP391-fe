import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "../../services/axiosClient"; // Adjust the import path as necessary
import { toast } from "react-toastify"; // Import toast

const DonationForm = () => {
  const { shelterId } = useParams(); // Get shelter ID from URL
  const [amount, setAmount] = useState(0); // State to hold donation amount
  const navigate = useNavigate(); // Initialize useNavigate

  // Get donorId from local storage
  const donorId = localStorage.getItem("nameid"); // Ensure donorId is stored in local storage

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await axios.post("/donate/createdonate", {
        amount: amount,
        donorId: Number(donorId), // Convert donorId to a number
        shelterId: Number(shelterId), // Convert shelterId to a number
      });
      console.log("Donation Response:", response.data);
      toast.success("Donation successful! Thank you for your contribution."); // Show success toast
      // Redirect to the /donate page after a successful donation
      setTimeout(() => {
        navigate("/donate"); // Use navigate to redirect
      }, 2000); // Wait for 2 seconds before redirecting
    } catch (error) {
      console.error("Error creating donation:", error);
      toast.error("An error occurred while processing your donation."); // Show error toast
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Make a Donation</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="amount"
          >
            Donation Amount
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Enter donation amount"
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
        >
          Donate
        </button>
      </form>
    </div>
  );
};

export default DonationForm;
