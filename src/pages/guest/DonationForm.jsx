import React, { useState } from "react";
import { useParams } from "react-router-dom"; // To get the shelter ID from the URL
import axios from "../../services/axiosClient"; // Adjust the import path as necessary

const DonationForm = () => {
  const { shelterId } = useParams(); // Get shelter ID from URL
  const [amount, setAmount] = useState(0); // State to hold donation amount
  const [message, setMessage] = useState(""); // State for messages

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
      setMessage("Donation successful! Thank you for your contribution.");
    } catch (error) {
      console.error("Error creating donation:", error);
      setMessage("An error occurred while processing your donation.");
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Make a Donation</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter donation amount"
          className="border p-2 rounded w-full mb-2"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Donate
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default DonationForm;
