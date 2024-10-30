import { ApiRequest } from "../services/axiosClient"; // Đảm bảo rằng đường dẫn đúng
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("Location:", location); // Log location để kiểm tra
    const params = new URLSearchParams(location.search);

    // Log tất cả tham số để kiểm tra
    console.log("Received URL Parameters:", Object.fromEntries(params));

    const vnp_ResponseCode = params.get("vnp_ResponseCode");
    const vnp_TransactionStatus = params.get("vnp_TransactionStatus");

    console.log("Response Code:", vnp_ResponseCode);
    console.log("Transaction Status:", vnp_TransactionStatus);

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
          console.log("Dữ liệu nhận được từ API:", data);
          navigate("/");
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    } else {
      console.error("Giao dịch không thành công");
      alert("Giao dịch không thành công. Mã phản hồi: " + vnp_ResponseCode);
    }
  }, [navigate, location]);

  return (
    <div>
      <h1>Đang xử lý...</h1>
    </div>
  );
};

export default PaymentResult;
