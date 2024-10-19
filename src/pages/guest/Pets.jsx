import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; // For redirection
import { toast } from "react-toastify";
import axios from "../../services/axiosClient";

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const petsPerPage = 6;

  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get("/pet");
        setPets(response.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchPets();
  }, []);

  const isLoggedIn = () => {
    return !!localStorage.getItem("token");
  };

  const handleAdopt = (petID) => {
    if (!isLoggedIn()) {
      toast.error("Bạn phải login để sử dụng tính năng này");
      setTimeout(() => {
        navigate("/admin/login");
      }, 500); // Delay for redirection after toast
    } else {
      navigate("/registration-form", { state: { petID } }); // Pass the petId in state
    }
  };

  const availablePets = pets.filter(
    (pet) => pet.adoptionStatus === "Available"
  );

  const totalPages = Math.ceil(availablePets.length / petsPerPage);
  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = availablePets.slice(indexOfFirstPet, indexOfLastPet);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t("availablePets")}</h1>

      {availablePets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentPets.map((pet) => (
            <div key={pet.petID} className="border p-4 rounded-lg shadow">
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-48 object-cover mb-4"
              />
              <h2 className="text-xl font-semibold">{pet.name}</h2>
              <p>
                {t("type")}: {pet.type}
              </p>
              <p>
                {t("breed")}: {pet.breed}
              </p>
              <p>
                {t("age")}: {pet.age} {t("years")}
              </p>
              <p>
                {t("gender")}: {pet.gender}
              </p>
              <p>
                {t("size")}: {pet.size}
              </p>
              <p>
                {t("color")}: {pet.color}
              </p>
              <p>
                {t("description")}: {pet.description}
              </p>

              <button
                onClick={() => handleAdopt(pet.petID)}
                className="px-4 py-2 mt-4 bg-blue-500 text-white rounded"
              >
                {t("adopt")}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">{t("noAvailablePets")}</p>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-4 py-2 bg-gray-300 rounded ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {t("previous")}
          </button>
          <p>
            {t("page")} {currentPage} {t("of")} {totalPages}
          </p>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 bg-gray-300 rounded ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {t("next")}
          </button>
        </div>
      )}
    </div>
  );
};

export default Pets;
