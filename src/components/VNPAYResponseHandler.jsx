import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiRequest } from "../services/axiosClient"; // Đường dẫn đến tệp chứa hàm ApiRequest
import {
  faCircleCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const PaymentResponse = ({ txnRef }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState(null);
  const [iconColor, setIconColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResponse = async () => {
      try {
        // Gửi yêu cầu để lấy phản hồi từ API
        const response = await ApiRequest({
          method: "GET",
          params: {
            vnp_TxnRef: txnRef,
            // Các tham số khác nếu cần
          },
        });

        console.log("API Response:", response); // Log toàn bộ phản hồi

        // Kiểm tra xem phản hồi có tồn tại không
        if (response && response.response) {
          // In ra các tham số
          console.log("vnp_Amount:", response.response.vnp_Amount);
          console.log("vnp_BankCode:", response.response.vnp_BankCode);
          console.log("vnp_BankTranNo:", response.response.vnp_BankTranNo);
          console.log("vnp_CardType:", response.response.vnp_CardType);
          console.log("vnp_OrderInfo:", response.response.vnp_OrderInfo);
          console.log("vnp_PayDate:", response.response.vnp_PayDate);
          console.log("vnp_ResponseCode:", response.response.vnPayResponseCode);
          console.log("vnp_TmnCode:", response.response.vnp_TmnCode);
          console.log(
            "vnp_TransactionNo:",
            response.response.vnp_TransactionNo
          );
          console.log(
            "vnp_TransactionStatus:",
            response.response.vnp_TransactionStatus
          );
          console.log("vnp_TxnRef:", response.response.vnp_TxnRef);
          console.log("vnp_SecureHash:", response.response.vnp_SecureHash);
        } else {
          console.error("Invalid response structure", response);
          setMessage(t("thankYou.apiErrorMessage"));
          setIcon(faTriangleExclamation);
          setIconColor("text-red-600");
          setTextColor("text-red-600");
          setLoading(false);
          return;
        }

        // Kiểm tra mã phản hồi VNPay
        if (response.response.vnPayResponseCode === "00") {
          setMessage(t("thankYou.successMessage"));
          setIcon(faCircleCheck);
          setIconColor("text-green-600");
          setTextColor("text-green-600");
          setTimeout(() => {
            navigate("/"); // Chuyển hướng về trang chính
          }, 3000); // Đợi 3 giây trước khi chuyển hướng
        } else {
          // Xử lý nếu mã phản hồi không phải là "00"
          setMessage(t("thankYou.failureMessage"));
          setIcon(faTriangleExclamation);
          setIconColor("text-yellow-400");
          setTextColor("text-yellow-400");
        }
      } catch (error) {
        console.error("API request error:", error);
        setMessage(t("thankYou.apiErrorMessage"));
        setIcon(faTriangleExclamation);
        setIconColor("text-red-600");
        setTextColor("text-red-600");
      }
      setLoading(false);
    };

    handleResponse();
  }, [txnRef, t, navigate]);

  return (
    <div className={`text-center ${textColor}`}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <i className={icon}></i>
          <p>{message}</p>
        </>
      )}
    </div>
  );
};

export default PaymentResponse;
