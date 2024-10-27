import { useEffect, useState } from "react";
import {
  faCircleCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { ApiRequest } from "../services/axiosClient";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const VNPAYResponseHandler = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState(null);
  const [iconColor, setIconColor] = useState(null);
  const [textColor, setTextColor] = useState(null);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(window.location.search);
  const txnRef = queryParams.get("vnp_TxnRef");

  useEffect(() => {
    const handleResponse = async () => {
      try {
        // Gửi yêu cầu để lấy phản hồi từ API
        const response = await ApiRequest({
          method: "GET",
          params: {
            vnp_TxnRef: txnRef,
          },
        });

        // Kiểm tra mã phản hồi VNPay
        if (response.response && response.response.vnPayResponseCode === "00") {
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
    <div className={`m-4 ${!message && "hidden"}`}>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader"></div> {/* Add spinner CSS for .loader */}
          <p className="ml-2">Loading...</p>
        </div>
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
