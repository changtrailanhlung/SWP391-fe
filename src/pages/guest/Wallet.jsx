import React, { useState } from "react";
import { post } from "../../services/axiosClient";

const Wallet = () => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleDonate = async () => {
    const fullName = localStorage.getItem("username");

    if (!fullName) {
      console.error("Full name is missing from storage.");
      return;
    }

    const numericAmount = amount ? Number(amount) : 0;

    if (!description.trim()) {
      alert("Vui lòng nhập mô tả.");
      return;
    }

    const data = {
      fullName,
      amount: numericAmount,
      description,
    };

    try {
      const result = await post("/donate/vnpay", data);
      console.log("Donation successful:", result);
      window.location.href = result.url; // Điều hướng tới URL thanh toán
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
          min="0"
          className="mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Nhập số tiền"
        />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Mô tả:</span>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Nhập mô tả"
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
