import React, { useState } from "react";
import { post } from "../../services/axiosClient";

const Wallet = () => {
  const [amount, setAmount] = useState(""); // Default amount

  const handleDonate = async () => {
    const fullName = localStorage.getItem("username");
    const userId = localStorage.getItem("nameid"); // Retrieve userId from localStorage

    if (!fullName || !userId) {
      console.error("User information is missing from storage.");
      return;
    }

    const numericAmount = amount ? Number(amount) : 0;

    // Check if the entered amount is valid
    if (numericAmount <= 0) {
      alert("Vui lòng nhập số tiền hợp lệ.");
      return;
    }

    const data = {
      fullName,
      userId, // Add userId to the data object
      amount: numericAmount,
      description: "", // Description is an empty string
    };

    try {
      const response = await post("/donate/vnpay", data);
      // console.log("Donation successful:", response);

      // Assume response contains the payment URL
      const paymentUrl = response; // Assign directly if response contains the URL
      window.location.href = paymentUrl; // Redirect to the payment URL
    } catch (error) {
      console.error("Error during donation:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 my-8 border rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-4">Wallet</h1>
      <label className="block mb-2">
        <span className="text-gray-700">Số tiền:</span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0" // Ensure the amount is non-negative
          className="mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Nhập số tiền"
        />
      </label>
      <button
        onClick={handleDonate}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
      >
        Donate
      </button>
    </div>
  );
};

export default Wallet;
