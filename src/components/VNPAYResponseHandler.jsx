import { useEffect, useState } from "react";
import {
  faCircleCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { ApiRequest } from "../services/axiosClient";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Ensure this is imported

const VNPAYResponseHandler = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState(null);
  const [iconColor, setIconColor] = useState(null);
  const [textColor, setTextColor] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  const queryParams = new URLSearchParams(window.location.search);

  const responseCode = queryParams.get("vnp_ResponseCode");
  const txnRef = queryParams.get("vnp_TxnRef");
  const orderInfo = queryParams.get("vnp_OrderInfo");
  const bankCode = queryParams.get("vnp_BankCode");
  const amount = queryParams.get("vnp_Amount");
  const cardType = queryParams.get("vnp_CardType");
  const payDate = queryParams.get("vnp_PayDate");
  const tmnCode = queryParams.get("vnp_TmnCode");
  const transactionNo = queryParams.get("vnp_TransactionNo");
  const transactionStatus = queryParams.get("vnp_TransactionStatus");
  const secureHash = queryParams.get("vnp_SecureHash");
  const bankTranNo = queryParams.get("vnp_BankTranNo");

  useEffect(() => {
    const handleResponse = async () => {
      if (responseCode === "00") {
        try {
          const response = await ApiRequest({
            params: {
              vnp_TxnRef: txnRef,
              vnp_ResponseCode: responseCode,
              vnp_OrderInfo: orderInfo,
              vnp_BankCode: bankCode,
              vnp_BankTranNo: bankTranNo,
              vnp_Amount: amount,
              vnp_CardType: cardType,
              vnp_PayDate: payDate,
              vnp_TmnCode: tmnCode,
              vnp_TransactionNo: transactionNo,
              vnp_TransactionStatus: transactionStatus,
              vnp_SecureHash: secureHash,
            },
          });

          if (response.status === "ok") {
            setMessage(t("thankYou.successMessage"));
            setIcon(faCircleCheck);
            setIconColor("text-green-600");
            setTextColor("text-green-600");
          } else {
            setMessage(t("thankYou.failureMessage"));
            setIcon(faTriangleExclamation);
            setIconColor("text-yellow-400");
            setTextColor("text-yellow-400");
          }
        } catch (error) {
          console.error("API request error:", error);
          setMessage(t("thankYou.apiErrorMessage")); // User-friendly message
          setIcon(faTriangleExclamation);
          setIconColor("text-red-600");
          setTextColor("text-red-600");
        }
      } else {
        setMessage(t("thankYou.failureMessage"));
        setIcon(faTriangleExclamation);
        setIconColor("text-yellow-400");
        setTextColor("text-yellow-400");
      }
      setLoading(false); // Set loading to false after processing
    };

    handleResponse();
  }, [
    responseCode,
    txnRef,
    orderInfo,
    bankCode,
    amount,
    cardType,
    payDate,
    tmnCode,
    transactionNo,
    transactionStatus,
    secureHash,
    bankTranNo,
    t,
  ]);

  return (
    <div className={`m-4 ${!message && "hidden"}`}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="text-gray-400 text-center bg-gray-900/70 p-2 m-4 rounded-xl shadow-md md:max-w-md md:m-auto mb-6">
          <p className="text-lg font-bold">{t("thankYou.title")}</p>
          {icon && (
            <FontAwesomeIcon
              icon={icon}
              className={`text-5xl mt-3 ${iconColor}`}
            />
          )}
          <p
            className={`${textColor} text-xl mt-3`}
            dangerouslySetInnerHTML={{ __html: message }}
          />
        </div>
      )}
    </div>
  );
};

export default VNPAYResponseHandler;
