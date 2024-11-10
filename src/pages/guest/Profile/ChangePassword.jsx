import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../services/axiosClient";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ChangePassword = () => {
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("nameid");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error(t("profile.passwordsDoNotMatch"));
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put("/users/updatepassword", {
        userId: Number(userId),
        oldPassword,
        newPassword,
      });
      console.log("Password Change Response:", response.data);
      toast.success(t("profile.passwordChangeSuccess"));
      setTimeout(() => {
        navigate("/user-info");
      }, 3000);
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(t("profile.passwordChangeError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12">
      <div className="w-full max-w-md p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          {t("profile.changePassword")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
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
              className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            />
          </div>
          <div>
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
              className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="confirmPassword"
            >
              {t("profile.confirmPassword")}
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-green-500 text-white py-3 rounded-lg shadow hover:bg-green-600 transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? t("profile.loading") : t("profile.changePassword")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
