import React, { useEffect, useState } from "react";
import axios from "../../../services/axiosClient";
import { toast, ToastContainer } from "react-toastify"; // Ensure ToastContainer is imported
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const HistoryWallet = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("nameid")
    ? parseInt(localStorage.getItem("nameid"), 10)
    : null;

  useEffect(() => {
    const fetchTransactions = async () => {
      if (userId === null) {
        toast.error("User ID not found. Please log in.", { autoClose: 3000 });
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(
          `/donate/vnpay/transactions?userId=${userId}`
        );
        setTransactions(data); // Assuming data is the array of transactions
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Error fetching transactions. Please try again later.", {
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  const columns = [
    { field: "amount", header: "Amount" },
    {
      field: "createdDate",
      header: "Date",
      body: ({ createdDate }) => new Date(createdDate).toLocaleString(),
    },
    { field: "vnPayResponseCode", header: "Response Code" },
  ];

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">Transaction History</h1>
      {loading ? (
        <p className="text-center text-lg text-gray-500">Loading...</p>
      ) : transactions.length > 0 ? (
        <DataTable value={transactions}>
          {columns.map(({ field, header, body }) => (
            <Column key={field} field={field} header={header} body={body} />
          ))}
        </DataTable>
      ) : (
        <p className="text-center text-lg text-gray-500">
          No transactions available.
        </p>
      )}
    </div>
  );
};

export default HistoryWallet;
