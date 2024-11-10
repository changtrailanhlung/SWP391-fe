import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../services/axiosClient";

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedType, setSelectedType] = useState(""); // State for type filter
  const [selectedBreed, setSelectedBreed] = useState(""); // State for breed filter
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

  const isLoggedIn = () => !!localStorage.getItem("token");
  const getUserRole = () => localStorage.getItem("role") || "";

  const handleAdopt = (petID) => {
    if (!isLoggedIn()) {
      toast.error("Bạn phải login để sử dụng tính năng này");
      setTimeout(() => navigate("/admin/login"), 500);
    } else if (!getUserRole().split(",").includes("Adopter")) {
      toast.error("Bạn không có quyền để nhận nuôi thú cưng");
    } else {
      navigate("/registration-form", { state: { petID } });
    }
  };

  const availablePets = pets.filter(
    (pet) => pet.adoptionStatus === "Available"
  );

  // Filter pets based on the search query, type, and breed
  const filteredPets = availablePets.filter((pet) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const matchesQuery =
      (pet.name && pet.name.toLowerCase().includes(lowerCaseQuery)) ||
      (pet.type && pet.type.toLowerCase().includes(lowerCaseQuery)) ||
      (pet.breed && pet.breed.toLowerCase().includes(lowerCaseQuery));

    const matchesType = selectedType ? pet.type === selectedType : true;
    const matchesBreed = selectedBreed ? pet.breed === selectedBreed : true;

    return matchesQuery && matchesType && matchesBreed;
  });

  const totalPages = Math.ceil(filteredPets.length / petsPerPage);
  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Extract unique types and breeds for filtering
  const petTypes = [...new Set(pets.map((pet) => pet.type))];
  const petBreeds = [...new Set(pets.map((pet) => pet.breed))];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {t("stats.availablePets")}
      </h1>

      {/* Search and Filter Inputs in a Row */}
      <div className="flex flex-col md:flex-row items-center mb-4">
        <input
          type="text"
          placeholder={t("search.pet")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3 mr-2"
        />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3 mr-2"
        >
          <option value="">{t("allTypes")}</option>
          {petTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          value={selectedBreed}
          onChange={(e) => setSelectedBreed(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        >
          <option value="">{t("allBreeds")}</option>
          {petBreeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>
      </div>

      {filteredPets.length > 0 ? (
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
                {t("pet.type")}: {pet.type}
              </p>
              <p>
                {t("pet.breed")}: {pet.breed}
              </p>
              <p>
                {t("pet.age")}: {pet.age} {t("years")}
              </p>
              <p>
                {t("pet.gender")}: {pet.gender}
              </p>
              <p>
                {t("pet.size")}: {pet.size}
              </p>
              <p>
                {t("pet.color")}: {pet.color}
              </p>
              <p>
                {t("pet.description")}: {pet.description}
              </p>

              <div className="mt-2">
                <h3 className="font-bold">Vaccine</h3>
                <p>
                  {pet.statuses.length > 0
                    ? pet.statuses
                        .map((status) => status.vaccine)
                        .filter((v) => v)
                        .join(", ") || t("noVaccineData")
                    : t("noVaccineData")}
                </p>
              </div>
              <div className="mt-2">
                <h3 className="font-bold">{t("disease")}</h3>
                <p>
                  {pet.statuses.length > 0
                    ? pet.statuses
                        .map((status) => status.disease)
                        .filter((d) => d)
                        .join(", ") || t("noVaccineData")
                    : t("noVaccineData")}
                </p>
              </div>
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
