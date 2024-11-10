import { ApiRequest } from "../services/axiosClient"; // Ensure the path is correct
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // console.log("Location:", location); // Log location for debugging
    const params = new URLSearchParams(location.search);

    // Log all parameters for debugging
    // console.log("Received URL Parameters:", Object.fromEntries(params));

    const vnp_ResponseCode = params.get("vnp_ResponseCode");
    const vnp_TransactionStatus = params.get("vnp_TransactionStatus");

    // console.log("Response Code:", vnp_ResponseCode);
    // console.log("Transaction Status:", vnp_TransactionStatus);

    if (vnp_ResponseCode === "00" && vnp_TransactionStatus === "00") {
      const apiParams = {
        params: {
          vnp_Amount: params.get("vnp_Amount"),
          vnp_BankCode: params.get("vnp_BankCode"),
          vnp_BankTranNo: params.get("vnp_BankTranNo"),
          vnp_CardType: params.get("vnp_CardType"),
          vnp_OrderInfo: params.get("vnp_OrderInfo"),
          vnp_PayDate: params.get("vnp_PayDate"),
          vnp_ResponseCode,
          vnp_TmnCode: params.get("vnp_TmnCode"),
          vnp_TransactionNo: params.get("vnp_TransactionNo"),
          vnp_TransactionStatus,
          vnp_TxnRef: params.get("vnp_TxnRef"),
          vnp_SecureHash: params.get("vnp_SecureHash"),
        },
      };

      ApiRequest(apiParams)
        .then((data) => {
          // console.log("Received data from API:", data);
          toast.success("Giao dịch thành công!"); // Show success toast
          setTimeout(() => {
            navigate("/"); // Navigate after a short delay
          }, 2000); // Adjust delay as needed
        })
        .catch((error) => {
          console.error("Error calling API:", error);
          toast.error("Giao dịch không thành công. Vui lòng thử lại."); // Show error toast
          setTimeout(() => {
            navigate("/"); // Navigate back to home after a short delay
          }, 2000); // Adjust delay as needed
        });
    } else {
      console.error("Transaction not successful");
      toast.error(
        "Giao dịch không thành công. Mã phản hồi: " + vnp_ResponseCode
      ); // Show error toast
      setTimeout(() => {
        navigate("/"); // Navigate back to home after a short delay
      }, 2000); // Adjust delay as needed
    }
  }, [navigate, location]);

  return (
    <div>
      <h1>Đang xử lý...</h1>
    </div>
  );
};

export default PaymentResult;
