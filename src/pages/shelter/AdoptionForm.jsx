import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosClient';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const AdoptionForm = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = React.useRef(null);
  const shelterID = localStorage.getItem('shelterID');
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await axios.get('/form', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'accept': 'text/plain'
        }
      });
      const filteredForms = response.data.filter(form => form.shelter === `Shelter${shelterID}`);
      setForms(filteredForms);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Unable to fetch forms', life: 3000 });
      setLoading(false);
    }
  };

  const imageBodyTemplate = (rowData) => {
    return <img src={rowData.identificationImage} alt={`ID Front ${rowData.id}`} className="w-16 h-16 object-cover rounded-lg" />;
  };

  const imageBackBodyTemplate = (rowData) => {
    return <img src={rowData.identificationImageBackSide} alt={`ID Back ${rowData.id}`} className="w-16 h-16 object-cover rounded-lg" />;
  };

  const sequentialID = (rowData, { rowIndex }) => {
    return rowIndex + 1;
  };

  return (
    <div className="container mx-auto p-4">
      <Toast ref={toast} />
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Adoption Forms</h2>
      <DataTable value={forms} loading={loading} paginator rows={10} className="p-datatable-custom">
        <Column field="sequentialID" header="No." body={sequentialID} sortable />
        <Column header="ID Front" body={imageBodyTemplate} />
        <Column header="ID Back" body={imageBackBodyTemplate} />
        <Column field="socialAccount" header="Social Account" sortable />
        <Column field="incomeAmount" header="Income Amount" sortable />
      </DataTable>
    </div>
  );
};

export default AdoptionForm;
