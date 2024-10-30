import React, { useEffect, useState } from "react";
import axios from "../../../services/axiosClient";
import { toast } from "react-toastify";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useTranslation } from "react-i18next";

// Helper function to format amount
const formatAmount = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Format amount to xxx.xxx.xxx
};

// Helper function to get response message
const getResponseMessage = (responseCode, t) => {
  return responseCode === "00"
    ? t("success")
    : t("paymentError", { code: responseCode });
};

const HistoryWallet = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("nameid")
    ? parseInt(localStorage.getItem("nameid"), 10)
    : null;

  useEffect(() => {
    const fetchTransactions = async () => {
      if (userId === null) {
        toast.error(t("userIdNotFound"), { autoClose: 3000 });
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(
          `/donate/vnpay/transactions?userId=${userId}`
        );

        // Sort transactions by createdDate in descending order
        const sortedTransactions = data.sort(
          (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
        );

        setTransactions(sortedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error(t("Error fetching transactions. Please try again later."), {
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId, t]);

  const columns = [
    {
      field: "amount",
      header: t("Amount"),
      body: ({ amount }) => formatAmount(amount), // Format amount for display
      sortable: true,
    },
    {
      field: "createdDate",
      header: t("Date"),
      body: ({ createdDate }) => new Date(createdDate).toLocaleString(),
      sortable: true,
    },
    {
      field: "vnPayResponseCode",
      header: t("Response Code"),
      body: ({ vnPayResponseCode }) => getResponseMessage(vnPayResponseCode, t), // Display message based on response code
      sortable: true,
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">
        {t("transactionHistory")}
      </h2>
      {loading ? (
        <p className="text-center text-lg text-gray-500">{t("loading")}</p>
      ) : transactions.length > 0 ? (
        <DataTable value={transactions} paginator rows={10} sortable>
          {columns.map(({ field, header, body }) => (
            <Column
              key={field}
              field={field}
              header={header}
              body={body}
              sortable
            />
          ))}
        </DataTable>
      ) : (
        <p className="text-center text-lg text-gray-500">
          {t("noTransactions")}
        </p>
      )}
    </div>
  );
};

export default HistoryWallet;
