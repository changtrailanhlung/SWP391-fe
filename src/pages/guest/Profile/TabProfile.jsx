import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "../../../services/axiosClient";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { TabView, TabPanel } from "primereact/tabview"; // Import TabView and TabPanel
import ProfileInfo from "./ProfileInfo"; // Import the ProfileInfo component
import HistoryDonation from "./HistoryDonation"; // Import the ProfileSettings component
import RegisterForm from "./HistoryForm"; // Import the ProfileSettings component
import RegisterEvent from "./RegisterEvent";

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
        {/* TabView for different profile sections */}
        <TabView>
          <TabPanel header={t("tabprofile.tab1")}>
            <ProfileInfo
              user={user}
              onChangePassword={handleChangePassword}
              onUpdateInfo={handleUpdateInfo}
              formatNumber={formatNumber}
            />
          </TabPanel>
          <TabPanel header={t("tabprofile.tab2")}>
            <HistoryDonation />
          </TabPanel>
          <TabPanel header={t("tabprofile.tab3")}>
            <RegisterForm />
          </TabPanel>
          <TabPanel header={t("tabprofile.tab4")}>
            <RegisterEvent />
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default Profile;
