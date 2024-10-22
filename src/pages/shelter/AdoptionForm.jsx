import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosClient';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const AdoptionForm = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [petDetails, setPetDetails] = useState(null);
  const [showPetDialog, setShowPetDialog] = useState(false);
  const toast = useRef(null);
  const shelterID = localStorage.getItem('shelterID');
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const formResponse = await axios.get('/form', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'accept': 'text/plain',
        }
      });
  
      const userResponse = await axios.get('/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'accept': 'text/plain',
        }
      });
  
      const users = userResponse.data.reduce((acc, user) => {
        acc[user.id] = user.username;
        return acc;
      }, {});
  
      const filteredForms = formResponse.data
        .filter(form => form.shelter === `Shelter${shelterID}`)
        .map(form => ({
          ...form,
          username: users[form.adopterId],
        }));
  
      setForms(filteredForms);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Unable to fetch forms', life: 3000 });
      setLoading(false);
    }
  };

  const fetchPetDetails = async (petId) => {
    try {
      const response = await axios.get(`/pet/id/${petId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'accept': '*/*',
        }
      });
      setPetDetails(response.data);
      setShowPetDialog(true);
    } catch (error) {
      console.error('Error fetching pet details:', error);
      toast.current.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Failed to fetch pet details', 
        life: 3000 
      });
    }
  };

  const updateStatus = async (id) => {
    try {
      const response = await axios.put(`/form/${id}/status?status=true`, null, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'accept': '*/*',
        }
      });

      if (response.data.message) {
        toast.current.show({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Form status updated successfully', 
          life: 3000 
        });
        
        setForms(forms.map(form => 
          form.id === id ? { ...form, status: true } : form
        ));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.current.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Failed to update status', 
        life: 3000 
      });
    }
  };

  const deleteForm = async (id) => {
    try {
      await axios.delete(`/form/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'accept': '*/*',
        }
      });

      toast.current.show({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Form deleted successfully', 
        life: 3000 
      });
      
      setForms(forms.filter(form => form.id !== id));
    } catch (error) {
      console.error('Error deleting form:', error);
      toast.current.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Failed to delete form', 
        life: 3000 
      });
    }
  };

  const confirmDelete = (id) => {
    confirmDialog({
      message: 'Are you sure you want to delete this form?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full inline-flex items-center transition-colors duration-300 mr-4',
      rejectClassName: 'bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-full inline-flex items-center transition-colors duration-300',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      className: 'custom-confirm-dialog',
      accept: () => deleteForm(id),
      style: { width: '400px' },
      contentStyle: { padding: '1.5rem' },
    });
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

  const statusBodyTemplate = (rowData) => {
    return (
      <span className={`px-3 py-1 rounded-full ${rowData.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {rowData.status ? 'Confirmed' : 'Unconfirmed'}
      </span>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        {!rowData.status && (
          <Button
            icon="pi pi-check"
            className="p-button-rounded p-button-success p-button-sm"
            onClick={() => updateStatus(rowData.id)}
            tooltip="Confirm Form"
          />
        )}
        <Button
          icon="pi pi-info-circle"
          className="p-button-rounded p-button-info p-button-sm"
          onClick={() => fetchPetDetails(rowData.petId)}
          tooltip="View Pet Details"
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-sm"
          onClick={() => confirmDelete(rowData.id)}
          tooltip="Delete Form"
        />
      </div>
    );
  };

  const renderPetDialog = () => {
    if (!petDetails) return null;

    const combinedDiseases = petDetails.statuses
      ?.map(status => status.disease)
      .filter(Boolean)
      .join(', ');
    
    const combinedVaccines = petDetails.statuses
      ?.map(status => status.vaccine)
      .filter(Boolean)
      .join(', ');

    return (
      <Dialog
        header="Pet Details"
        visible={showPetDialog}
        onHide={() => setShowPetDialog(false)}
        style={{ width: '50vw' }}
        className="p-fluid"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <img 
              src={petDetails.image} 
              alt={petDetails.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold mb-2">{petDetails.name}</h3>
              <p className="text-gray-600">Type: {petDetails.type}</p>
              <p className="text-gray-600">Breed: {petDetails.breed || 'Not specified'}</p>
              <p className="text-gray-600">Gender: {petDetails.gender || 'Not specified'}</p>
              <p className="text-gray-600">Age: {petDetails.age || 'Not specified'}</p>
              <p className="text-gray-600">Size: {petDetails.size || 'Not specified'}</p>
              <p className="text-gray-600">Color: {petDetails.color || 'Not specified'}</p>
              <p className="text-gray-600">Status: {petDetails.adoptionStatus}</p>
            </div>
          </div>

          <div className="col-span-2">
            <h4 className="text-lg font-semibold mb-2">Medical History</h4>
            {petDetails.statuses && petDetails.statuses.length > 0 ? (
              <div className="space-y-2">
                {combinedDiseases && (
                  <p className="text-gray-600"><strong>Disease:</strong> {combinedDiseases}</p>
                )}
                {combinedVaccines && (
                  <p className="text-gray-600"><strong>Vaccine:</strong> {combinedVaccines}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No medical history available</p>
            )}
          </div>

          {petDetails.description && (
            <div className="col-span-2">
              <h4 className="text-lg font-semibold mb-2">Description</h4>
              <p className="text-gray-600">{petDetails.description}</p>
            </div>
          )}
        </div>
      </Dialog>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      {renderPetDialog()}
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Adoption Forms</h2>
      <DataTable value={forms} loading={loading} paginator rows={10} className="p-datatable-custom">
        <Column field="sequentialID" header="No." body={sequentialID} sortable />
        <Column field="username" header="AdopteName" sortable />
        <Column header="ID Front" body={imageBodyTemplate} />
        <Column header="ID Back" body={imageBackBodyTemplate} />
        <Column field="socialAccount" header="Social Account" sortable />
        <Column field="incomeAmount" header="Income Amount" sortable />
        <Column field="status" header="Status" body={statusBodyTemplate} sortable />
        <Column header="Action" body={actionBodyTemplate} style={{ width: '200px' }} />
      </DataTable>
    </div>
  );
};

export default AdoptionForm;