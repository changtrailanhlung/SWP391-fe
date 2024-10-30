import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import axios from "../../services/axiosClient"; // Điều chỉnh theo cấu trúc thư mục của bạn

const Contact = () => {
  const { t } = useTranslation();
  const [userId, setUserId] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("nameid");
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu userId là null và điều hướng đến trang đăng nhập nếu chưa đăng nhập
    if (!userId) {
      toast.error(t("feedback.notLoggedIn"));
      navigate("/admin/login");
      return;
    }

    // if (description.length < 5) {
    //   toast.error(t("feedback.validationMessage"));
    //   return;
    // }

    const formData = new FormData(); // Tạo FormData mới
    formData.append("userId", userId);
    // Không thêm postId vào formData
    formData.append("description", description);

    // Log dữ liệu để kiểm tra
    console.log("Data being sent:", Object.fromEntries(formData.entries()));

    setLoading(true);

    try {
      const response = await axios.post("/feedback", formData);

      // Giả sử phản hồi được cấu trúc đúng
      console.log("Feedback submitted:", response.data);
      toast.success(t("feedback.successMessage"));
      setDescription("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      const errorMessage =
        error.response?.data?.message || t("feedback.errorMessage");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md mb-10">
      <h2 className="text-xl font-bold mb-4">{t("feedback.title")}</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          id="feedback"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("feedback.feedbackPlaceholder")}
          required
          className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={loading}
          className={`mt-4 w-full px-4 py-2 text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } rounded-md transition duration-200`}
        >
          {loading ? t("feedback.loading") : t("feedback.submitFeedback")}
        </button>
      </form>
    </div>
  );
};

export default Contact;
