import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import necessary hooks
import axios from "../../services/axiosClient";
import { toast } from "react-toastify"; // Import toast
import { useTranslation } from "react-i18next"; // Import useTranslation

const UpdateInfo = () => {
  const { t } = useTranslation(); // Initialize translation
  const { id } = useParams(); // Get user ID from URL parameters
  const [userData, setUserData] = useState({
    username: "",
    location: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch user data to pre-fill the form
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/users/${id}`);
        setUserData({
          username: response.data.username,
          location: response.data.location,
          phone: response.data.phone,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Set loading state to true
    try {
      await axios.put(`/api/users/${id}`, userData); // PUT request to update user info
      toast.success(t("profileUpdateSuccess")); // Show success toast
      navigate("/user-info"); // Redirect to user info page
    } catch (error) {
      console.error("Error updating user info:", error);
      toast.error(t("profileUpdateError")); // Show error toast
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>; // Loading message
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">
        {t("updateInfo.title")}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="username"
          >
            {t("updateInfo.username")}
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={userData.username}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="location"
          >
            {t("updateInfo.location")}
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={userData.location}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="phone"
          >
            {t("updateInfo.phone")}
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={userData.phone}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
          disabled={loading} // Disable button while loading
        >
          {loading ? t("loading") : t("updateInfo.button")}
        </button>
      </form>
    </div>
  );
};

export default UpdateInfo;
