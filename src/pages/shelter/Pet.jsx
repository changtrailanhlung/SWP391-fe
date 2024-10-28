import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axiosClient";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useTranslation } from "react-i18next";

const Pet = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = React.useRef(null);
  const shelterID = localStorage.getItem("shelterID");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await axios.get("/pet", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const filteredPets = response.data.filter(
        (pet) => pet.shelterID === parseInt(shelterID)
      );
      setPets(filteredPets);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pets:", error);
      toast.current.show({
        severity: "error",
        summary: t('error.title'),
        detail: t('error.fetchPets'),
        life: 3000,
      });
      setLoading(false);
    }
  };

  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={rowData.image}
        alt={rowData.name}
        className="w-16 h-16 object-cover rounded-lg"
      />
    );
  };

  const viewMoreTemplate = (rowData) => {
    return (
      <Button
        label={t('buttons.viewMore')}
        className="p-button-sm p-button-info"
        onClick={() => navigate(`/shelter/pet/${rowData.petID}`)}
      />
    );
  };

  const sequentialID = (rowData, { rowIndex }) => {
    return rowIndex + 1;
  };

  return (
    <div className="container mx-auto p-4">
      <Toast ref={toast} />
      <Button
        label={t('buttons.addNewPet')}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-300"
        onClick={() => navigate("/shelter/pets/create")}
      />
      <h2 className="text-3xl font-bold mb-6 text-gray-800">{t('titles.pets')}</h2>
      <DataTable
        value={pets}
        loading={loading}
        paginator
        rows={10}
        className="p-datatable-custom"
      >
        <Column
          field="sequentialID"
          header={t('table.headers.no')}
          body={sequentialID}
          sortable
        />
        <Column header={t('table.headers.image')} body={imageBodyTemplate} />
        <Column field="name" header={t('table.headers.name')} sortable />
        <Column field="type" header={t('table.headers.type')} sortable />
        <Column field="gender" header={t('table.headers.gender')} sortable />
        <Column field="adoptionStatus" header={t('table.headers.adoptionStatus')} sortable />
        <Column header={t('table.headers.actions')} body={viewMoreTemplate} />
      </DataTable>
    </div>
  );
};

export default Pet;