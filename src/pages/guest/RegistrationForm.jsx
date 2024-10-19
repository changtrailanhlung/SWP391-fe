import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../../services/axiosClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const location = useLocation();
  const petID = location.state?.petID; // Safely extract petId

  const [socialAccount, setSocialAccount] = useState("");
  const [incomeAmount, setIncomeAmount] = useState(0);
  const [identificationImage, setIdentificationImage] = useState(null);
  const [identificationImageBackSide, setIdentificationImageBackSide] =
    useState(null);

  const navigate = useNavigate();
  const userId = localStorage.getItem("nameid"); // Fetch user ID from local storage

  const handleImageChange = (event, setImage) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file); // Store the image file directly
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("Form submitted!");
    const formData = new FormData();
    formData.append("SocialAccount", socialAccount);
    formData.append("IncomeAmount", incomeAmount);
    formData.append("IdentificationImage", identificationImage);
    formData.append("IdentificationImageBackSide", identificationImageBackSide);
    formData.append("AdopterId", parseInt(userId, 10));
    formData.append("PetId", parseInt(petID, 10));

    try {
      console.log("Submitting form data:", formData); // FormData cannot be logged directly
      await axios.post("/form", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Registration successful!");
      navigate("/success");
    } catch (error) {
      console.error(
        "Error submitting the form:",
        error.response || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Registration failed, please try again."
      );
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registration Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Social Account</label>
          <input
            type="text"
            value={socialAccount}
            onChange={(e) => setSocialAccount(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Income Amount</label>
          <input
            type="number"
            value={incomeAmount}
            onChange={(e) => setIncomeAmount(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Identification Image (Front)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, setIdentificationImage)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Identification Image (Back)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageChange(e, setIdentificationImageBackSide)
            }
            className="border p-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
