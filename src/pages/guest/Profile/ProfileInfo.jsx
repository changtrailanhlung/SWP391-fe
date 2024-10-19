import React from "react";
import { useTranslation } from "react-i18next";

const ProfileInfo = ({
  user,
  onChangePassword,
  onUpdateInfo,
  formatNumber,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-center mb-4">
        {t("profile.title")}
      </h2>
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
      <div className="mt-4 flex space-x-4">
        <button
          onClick={onChangePassword}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {t("profile.changePassword")}
        </button>
        <button
          onClick={onUpdateInfo}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {t("profile.updateInfo")}
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
