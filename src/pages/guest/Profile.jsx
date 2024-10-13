import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "../../services/axiosClient";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const Profile = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("nameid");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/users/${userId}`);
        console.log(response.data); // Log the response data
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const formatNumber = (number) => {
    if (!number) return "0";
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Format number with dots
  };

  const handleChangePassword = () => {
    navigate("/change-password"); // Navigate to change password route
  };

  const handleUpdateInfo = () => {
    navigate("/update-profile"); // Navigate to update profile route
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>; // Add a loading spinner or message if desired
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">
          {t("profile.title")}
        </h2>
        <div className="flex flex-col items-center">
          {user?.image ? (
            <img
              src={user.image}
              alt="User Profile"
              className="rounded-full w-36 h-36 mb-4"
            />
          ) : (
            <div className="rounded-full bg-gray-300 w-36 h-36 mb-4 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          <h4 className="text-lg font-semibold">
            {t("profile.username")}:
            <span className="font-normal">
              {user?.username || t("profile.noData")}
            </span>
          </h4>
          <h4 className="text-lg font-semibold">
            {t("profile.email")}:
            <span className="font-normal">
              {user?.email || t("profile.noData")}
            </span>
          </h4>
          <h4 className="text-lg font-semibold">
            {t("profile.phone")}:
            <span className="font-normal">
              {user?.phone || t("profile.noData")}
            </span>
          </h4>
          <h4 className="text-lg font-semibold">
            {t("profile.location")}:
            <span className="font-normal">
              {user?.location || t("profile.noData")}
            </span>
          </h4>
          <h4 className="text-lg font-semibold">
            {t("profile.donate")}:
            <span className="font-normal">
              {formatNumber(user?.totalDonation)} VND
            </span>
          </h4>

          {/* Add buttons for changing password and updating info */}
          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleChangePassword}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {t("profile.changePassword")}
            </button>
            <button
              onClick={handleUpdateInfo}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {t("profile.updateInfo")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
