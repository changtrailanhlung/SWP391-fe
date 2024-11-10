import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axiosClient";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const Donates = () => {
  const { t } = useTranslation();
  const [shelters, setShelters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sheltersPerPage] = useState(9);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const response = await axios.get("/shelter");
        console.log("API Response:", response.data);
        setShelters(response.data);
      } catch (error) {
        console.error("Error fetching shelter information:", error);
      }
    };

    fetchShelters();
  }, []);

  const indexOfLastShelter = currentPage * sheltersPerPage;
  const indexOfFirstShelter = indexOfLastShelter - sheltersPerPage;
  const currentShelters = shelters.slice(
    indexOfFirstShelter,
    indexOfLastShelter
  );
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

  const handleDonate = (shelterId) => {
    const donorId = localStorage.getItem("nameid");
    const userRole = localStorage.getItem("role");

    if (!donorId) {
      navigate("/admin/login");
      return;
    }

    const rolesArray = userRole ? userRole.split(",") : [];
    if (!rolesArray.includes("Donor")) {
      toast.error(t("accessDenied"));
      return;
    }

    navigate(`/donate/${shelterId}`);
  };

  if (shelters.length === 0) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        {t("donates.title")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentShelters.map((shelter) => (
          <div
            key={shelter.id}
            className="border border-gray-300 rounded-lg shadow-lg overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-4">
              <h2 className="text-2xl font-semibold text-gray-700">
                {shelter.name}
              </h2>
              <p className="text-gray-600">
                <strong>{t("donates.location")}:</strong> {shelter.location}
              </p>
              <p className="text-gray-600">
                <strong>{t("donates.phone")}:</strong> {shelter.phoneNumber}
              </p>
              <p className="text-gray-600">
                <strong>Email:</strong> {shelter.email}
              </p>
            </div>
            <div className="p-4 bg-gray-100 flex justify-center">
              <button
                onClick={() => handleDonate(shelter.id)}
                className="bg-green-500 text-white py-2 px-6 rounded-lg shadow hover:bg-green-600 transition duration-200"
              >
                {t("donates.donate")}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 transition duration-200 hover:bg-blue-600"
        >
          {t("previous")}
        </button>
        <span className="text-lg">
          {t("page")} {currentPage} {t("of")} {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 transition duration-200 hover:bg-blue-600"
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
};

export default Donates;
