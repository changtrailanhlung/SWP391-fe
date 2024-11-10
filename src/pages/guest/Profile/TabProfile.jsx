import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "../../../services/axiosClient";
import { useNavigate } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import ProfileInfo from "./ProfileInfo";
import HistoryDonation from "./HistoryDonation";
import RegisterForm from "./HistoryForm";
import RegisterEvent from "./RegisterEvent";
import HistoryFeedback from "./HistoryFeedback";
import HistoryWallet from "./HistoryWallet";

const Profile = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("nameid");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/users/${userId}`);
        // console.log(response.data);
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
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  const handleUpdateInfo = () => {
    navigate("/update-profile");
  };

  const handleRequestMemberPermission = () => {
    navigate("/request-role"); // Change to the appropriate route
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <TabView>
          <TabPanel header={t("tabprofile.tab1")}>
            <ProfileInfo
              user={user}
              onChangePassword={handleChangePassword}
              onUpdateInfo={handleUpdateInfo}
              onRequestMemberPermission={handleRequestMemberPermission} // Pass the new function
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
          <TabPanel header={t("tabprofile.tab5")}>
            <HistoryFeedback />
          </TabPanel>
          <TabPanel header={t("tabprofile.tab6")}>
            <HistoryWallet />
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default Profile;
