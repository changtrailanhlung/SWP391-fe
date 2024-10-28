import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "../../services/axiosClient"; // Adjust the import path as necessary
import { useTranslation } from "react-i18next"; // Import useTranslation
import { toast } from "react-toastify";

const Donates = () => {
  const { t } = useTranslation(); // Initialize translation
  const [shelters, setShelters] = useState([]); // State to hold an array of shelter data
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const [sheltersPerPage] = useState(9); // Display 9 shelters per page
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const response = await axios.get("/shelter"); // Fetch shelter information
        console.log("API Response:", response.data); // Log the response
        setShelters(response.data); // Store all shelter data in state
      } catch (error) {
        console.error("Error fetching shelter information:", error);
      }
    };

    fetchShelters(); // Call the fetch function on component mount
  }, []);

  // Calculate the index of the last shelter on the current page
  const indexOfLastShelter = currentPage * sheltersPerPage;
  // Calculate the index of the first shelter on the current page
  const indexOfFirstShelter = indexOfLastShelter - sheltersPerPage;
  // Get the current shelters
  const currentShelters = shelters.slice(
    indexOfFirstShelter,
    indexOfLastShelter
  );

  // Calculate total pages
  const totalPages = Math.ceil(shelters.length / sheltersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to handle navigation to the donation form
  const handleDonate = (shelterId) => {
    const donorId = localStorage.getItem("nameid"); // Get donorId from local storage
    const userRole = localStorage.getItem("role"); // Get user role from local storage

    if (!donorId) {
      navigate("/admin/login"); // Navigate to the login page
      return;
    }

    const rolesArray = userRole ? userRole.split(",") : [];

    // Check if userRole includes "Donor"
    if (!rolesArray.includes("Donor")) {
      toast.error(t("accessDenied")); // Show access denied message
      return;
    }

    navigate(`/donate/${shelterId}`); // Navigate to the DonationForm page with the shelter ID
  };

  if (shelters.length === 0) {
    return <div>Loading...</div>; // Show loading message while fetching
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t("donates.title")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {/* Grid layout for shelters */}
        {currentShelters.map((shelter) => (
          <div key={shelter.id} className="border p-4 rounded-lg shadow mb-4">
            <h2 className="text-xl font-semibold">{shelter.name}</h2>
            <p>
              <strong>{t("donates.location")}:</strong> {shelter.location}
            </p>
            <p>
              <strong>{t("donates.phone")}:</strong> {shelter.phoneNumber}
            </p>
            <p>
              <strong>Email:</strong> {shelter.email}
            </p>
            <button
              onClick={() => handleDonate(shelter.id)} // Pass shelter ID to handleDonate
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              {t("donates.donate")}
            </button>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          {t("previous")}
        </button>
        <span>
          {t("page")} {currentPage} {t("of")} {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
};

export default Donates;
