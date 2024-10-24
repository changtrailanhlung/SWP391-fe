import React, { useState } from "react";
import { post } from "../../services/axiosClient";

const Wallet = () => {
  const [amount, setAmount] = useState(""); // Giá trị mặc định là rỗng

  const handleDonate = async () => {
    const fullName = localStorage.getItem("username");

    if (!fullName) {
      console.error("Full name is missing from storage.");
      return;
    }

    const numericAmount = amount ? Number(amount) : 0;

    // Kiểm tra xem số tiền có hợp lệ không
    if (numericAmount <= 0) {
      alert("Vui lòng nhập số tiền hợp lệ.");
      return;
    }

    const data = {
      fullName,
      amount: numericAmount,
      description: "", // Mô tả sẽ là chuỗi trống
    };

    try {
      const response = await post("/donate/vnpay", data);
      console.log("Donation successful:", response);

      // Giả sử response chứa URL thanh toán
      const paymentUrl = response; // Gán trực tiếp nếu response chứa URL
      window.location.href = paymentUrl; // Chuyển hướng đến URL thanh toán
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
          min="0" // Đảm bảo số tiền không âm
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
