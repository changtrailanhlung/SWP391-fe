import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../../services/axiosClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const RegistrationForm = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const petID = location.state?.petID;

  const [socialAccount, setSocialAccount] = useState("");
  const [incomeAmount, setIncomeAmount] = useState(0);
  const [identificationImage, setIdentificationImage] = useState(null);
  const [identificationImageBackSide, setIdentificationImageBackSide] =
    useState(null);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const userId = localStorage.getItem("nameid");

  const validateForm = () => {
    let formErrors = {};

    // Validate socialAccount as a URL
    const urlPattern = /^[^\s/$.?#].[^\s]*$/;
    if (!urlPattern.test(socialAccount)) {
      formErrors.socialAccount = t("registration_form.invalid_url");
    }

    // Validate incomeAmount as a positive number
    if (incomeAmount <= 0) {
      formErrors.incomeAmount = t("registration_form.invalid_income");
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleImageChange = (event, setImage) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return; // Only proceed if form is valid

    const formData = new FormData();
    formData.append("SocialAccount", socialAccount);
    formData.append("IncomeAmount", incomeAmount);
    formData.append("IdentificationImage", identificationImage);
    formData.append("IdentificationImageBackSide", identificationImageBackSide);
    formData.append("AdopterId", parseInt(userId, 10));
    formData.append("PetId", parseInt(petID, 10));

    try {
      await axios.post("/form", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(t("registration_form.success"), {
        onClose: () => navigate("/pets"),
      });
    } catch (error) {
      console.error(
        "Error submitting the form:",
        error.response || error.message
      );
      toast.error(
        error.response?.data?.message || t("registration_form.error")
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-4">
          {t("registration_form.title")}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-gray-700 mb-2">
              {t("registration_form.social_account")}
            </label>
            <input
              type="text"
              value={socialAccount}
              onChange={(e) => setSocialAccount(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.socialAccount && (
              <p className="text-red-500 text-sm">{errors.socialAccount}</p>
            )}
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 mb-2">
              {t("registration_form.income_amount")}
            </label>
            <input
              type="number"
              value={incomeAmount}
              onChange={(e) => setIncomeAmount(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.incomeAmount && (
              <p className="text-red-500 text-sm">{errors.incomeAmount}</p>
            )}
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 mb-2">
              {t("registration_form.identification_image_front")}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setIdentificationImage)}
              className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              {t("registration_form.identification_image_back")}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleImageChange(e, setIdentificationImageBackSide)
              }
              className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {t("registration_form.submit")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
