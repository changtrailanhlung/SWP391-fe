import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../../services/axiosClient";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const Pet = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = React.useRef(null);
  const shelterID = localStorage.getItem("shelterID");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await axios.get('/pet', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const filteredPets = response.data.filter(pet => pet.shelterID === parseInt(shelterID));
      setPets(filteredPets);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pets:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Unable to fetch pets', life: 3000 });
      setLoading(false);
    }
  };

  const imageBodyTemplate = (rowData) => {
    return <img src={rowData.image} alt={rowData.name} className="w-16 h-16 object-cover rounded-lg" />;
  };

  const viewMoreTemplate = (rowData) => {
    return (
      <Button
        label="View More"
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
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Pets</h2>
      <DataTable value={pets} loading={loading} paginator rows={10} className="p-datatable-custom">
      <Column field="sequentialID" header="No." body={sequentialID} sortable />
        <Column header="Image" body={imageBodyTemplate} />
        <Column field="name" header="Name" sortable />
        <Column field="type" header="Type" sortable />
        <Column field="gender" header="Gender" sortable />
        <Column field="adoptionStatus" header="Adoption Status" sortable />
        <Column header="Actions" body={viewMoreTemplate} />
      </DataTable>
    </div>
  );
};

export default Pet;