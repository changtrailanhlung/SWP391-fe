import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useTranslation } from "react-i18next";
import axios from "../../../services/axiosClient";

const HistoryForm = () => {
  const { t } = useTranslation();
  const [petId, setPetId] = useState(10);
  const [status, setStatus] = useState(null);
  const [data, setData] = useState([]);
  const donorId = localStorage.getItem("nameid");

  const fetchPetDetails = async (petId) => {
    try {
      const response = await axios.get(`/pet/id/${petId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pet details for petId ${petId}:`, error);
      return null;
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("/form");
      const fetchedData = await Promise.all(
        response.data.map(async (item) => {
          const petDetails = await fetchPetDetails(item.petId);
          const statusText =
            item.status === true
              ? t("HistoryForm.status.approved")
              : item.status === false
              ? t("HistoryForm.status.denied")
              : t("HistoryForm.status.pending");

          return {
            ...item,
            petName: petDetails ? petDetails.name : "Unknown",
            gender: petDetails ? petDetails.gender : "Unknown",
            age: petDetails ? petDetails.age : "Unknown",
            color: petDetails ? petDetails.color : "Unknown",
            shelterName: item.shelter || "Unknown", // Sử dụng trường shelter từ item
            status: statusText,
          };
        })
      );
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      adopterId: donorId,
      petId: petId,
      status: status,
    };

    try {
      const response = await axios.post("/form", payload);
      console.log("Response:", response.data);
      fetchData();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">
        {t("HistoryForm.title")}
      </h2>
      <DataTable value={data} paginator rows={10} className="p-mt-3">
        <Column
          body={(rowData, options) => options.rowIndex + 1}
          header="No."
        />
        <Column field="petName" sortable header="Pet Name" />
        <Column field="gender" sortable header="Gender" />
        <Column field="age" sortable header="Age" />
        <Column field="color" sortable header="Color" />
        <Column field="shelterName" sortable header="Shelter Name" />
        <Column field="status" sortable header="Status" />
      </DataTable>
    </div>
  );
};

export default HistoryForm;