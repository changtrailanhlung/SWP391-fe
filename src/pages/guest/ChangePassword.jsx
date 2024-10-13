import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "../../services/axiosClient";
import { toast } from "react-toastify"; // Import toast
import { useTranslation } from "react-i18next"; // Import useTranslation

const ChangePassword = () => {
  const { t } = useTranslation(); // Initialize translation
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("nameid"); // Get user ID from local storage
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Set loading state to true
    try {
      const response = await axios.put("/users/updatepassword", {
        userId: Number(userId), // Convert userId to a number
        oldPassword: oldPassword,
        newPassword: newPassword,
      });
      console.log("Password Change Response:", response.data);
      toast.success(t("profile.passwordChangeSuccess")); // Show success toast
      setTimeout(() => {
        navigate("/user-info"); // Redirect to /user-info after 3 seconds
      }, 3000);
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(t("profile.passwordChangeError")); // Show error toast
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">
        {t("profile.changePassword")}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="oldPassword"
          >
            {t("profile.oldPassword")}
          </label>
          <input
            id="oldPassword"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="newPassword"
          >
            {t("profile.newPassword")}
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
          disabled={loading} // Disable button while loading
        >
          {loading ? t("profile.loading") : t("profile.changePassword")}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
