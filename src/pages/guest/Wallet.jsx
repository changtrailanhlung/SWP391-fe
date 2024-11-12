import React, { useState } from "react";
import { post } from "../../services/axiosClient";
import { useTranslation } from "react-i18next";

const Wallet = () => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");

  const handleDonate = async () => {
    const fullName = localStorage.getItem("username");
    const userId = localStorage.getItem("nameid");

    if (!fullName || !userId) {
      console.error(t("wallet.missingUserInfo"));
      return;
    }

    const numericAmount = amount ? Number(amount) : 0;

    if (numericAmount <= 0) {
      alert(t("wallet.invalidAmount"));
      return;
    }

    const data = {
      fullName,
      userId,
      amount: numericAmount,
      description: "",
    };

    try {
      const response = await post("/donate/vnpay", data);
      const paymentUrl = response;
      window.location.href = paymentUrl;
    } catch (error) {
      console.error(t("wallet.donationError"), error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 my-8 border rounded-lg shadow-lg bg-white">
      <h1 className="text-3xl font-bold text-center mb-6">
        {t("wallet.title")}
      </h1>
      <label className="block mb-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          className="mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          placeholder={t("wallet.amountPlaceholder")}
        />
      </label>
      <button
        onClick={handleDonate}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
      >
        {t("wallet.donateButton")}
      </button>
    </div>
  );
};

export default Wallet;
