import React from "react";
import { useTranslation } from "react-i18next";

const ProfileSettings = () => {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <h4>{t("tabprofile.tab1")}</h4>
      {/* Placeholder for settings content */}
      <p>{t("profile.settingsDescription")}</p>
    </div>
  );
};

export default ProfileSettings;
