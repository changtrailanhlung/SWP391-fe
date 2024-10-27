import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import axios from "../../services/axiosClient";

const Shelter = () => {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [donations, setDonations] = useState([]);
  const [showDonationsModal, setShowDonationsModal] = useState(false);
  const [selectedShelterId, setSelectedShelterId] = useState(null);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const buttonBaseStyle = "px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm font-medium";
  const primaryButtonStyle = `${buttonBaseStyle} bg-blue-500 hover:bg-blue-600 text-white`;
  const successButtonStyle = `${buttonBaseStyle} bg-green-500 hover:bg-green-600 text-white`;
  const dangerButtonStyle = `${buttonBaseStyle} bg-red-500 hover:bg-red-600 text-white`;
  const secondaryButtonStyle = `${buttonBaseStyle} bg-gray-500 hover:bg-gray-600 text-white`;
  const infoButtonStyle = `${buttonBaseStyle} bg-cyan-500 hover:bg-cyan-600 text-white`;
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    location: '',
    phoneNumber: '',
    capacity: null,
    email: '',
    bankAccount: '',
    website: '',
    donationAmount: 0
  });

  const navigate = useNavigate();
  const toast = React.useRef(null);

  useEffect(() => {
    fetchShelters();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    const phoneRegex = /^\d{10}$/;
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.capacity) {
      newErrors.capacity = 'Capacity is required';
    } else if (formData.capacity <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0';
    }

    if (!formData.bankAccount.trim()) {
      newErrors.bankAccount = 'Bank account is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchShelters = async () => {
    try {
      const response = await axios.get('/shelter', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setShelters(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shelters:', error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Unable to fetch shelters",
        life: 3000,
      });
      setLoading(false);
    }
  };

  const handleInputChange = (e, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target?.value ?? e.value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post('/shelter/create_shelter', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      fetchShelters();
      handleCloseModal();
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Shelter created successfully",
        life: 3000,
      });
    } catch (error) {
      console.error('Error creating shelter:', error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to create shelter",
        life: 3000,
      });
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      await axios.put(`/shelter/update/${formData.id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      fetchShelters();
      handleCloseModal();
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Shelter updated successfully",
        life: 3000,
      });
    } catch (error) {
      console.error('Error updating shelter:', error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update shelter",
        life: 3000,
      });
    }
  };

  const handleDelete = async (shelterId) => {
    try {
      await axios.delete(`/shelter/${shelterId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchShelters();
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Shelter deleted successfully",
        life: 3000,
      });
    } catch (error) {
      console.error('Error deleting shelter:', error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete shelter",
        life: 3000,
      });
    }
  };

  const handleOpenUpdateModal = (shelter) => {
    setFormData({
      id: shelter.id,
      name: shelter.name || '',
      location: shelter.location || '',
      phoneNumber: shelter.phoneNumber || '',
      capacity: shelter.capacity || null,
      email: shelter.email || '',
      bankAccount: shelter.bankAccount || '',
      website: shelter.website || '',
      donationAmount: shelter.donationAmount || 0
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setErrors({});
    setFormData({
      id: null,
      name: '',
      location: '',
      phoneNumber: '',
      capacity: null,
      email: '',
      bankAccount: '',
      website: '',
      donationAmount: 0
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className={primaryButtonStyle}
          onClick={() => handleOpenUpdateModal(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className={dangerButtonStyle}
          onClick={() => handleDelete(rowData.id)}
        />
        <Button
          icon="pi pi-info-circle"
          className={successButtonStyle}
          onClick={() => handleViewDetails(rowData)}
        />
      </div>
    );
  };

  const fetchDonations = async () => {
    try {
      const response = await axios.get('/donate', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDonations(response.data);
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Unable to fetch donations",
        life: 3000,
      });
    }
  };

  const handleAcceptDonation = async (donationId) => {
    try {
      await axios.put(`/donate/${donationId}/status`, 
        { status: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Donation accepted successfully",
        life: 3000,
      });
      
      fetchDonations();
    } catch (error) {
      console.error('Error accepting donation:', error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to accept donation",
        life: 3000,
      });
    }
  };

  const handleViewDetails = (shelter) => {
    setSelectedShelter(shelter);
    setSelectedShelterId(shelter.id);
    fetchDonations();
    setShowDonationsModal(true);
  };

  return (
    <div className="container mx-auto p-8 bg-gray-50">
      <Toast ref={toast} />
      
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Shelters Management</h2>
        <Button
          label="Add New Shelter"
          icon="pi pi-plus"
          className={successButtonStyle}
          onClick={() => setShowModal(true)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <DataTable
          value={shelters}
          loading={loading}
          paginator
          rows={10}
          className="p-datatable-custom"
          emptyMessage="No shelters found"
          rowHover
        >
          <Column
            field="sequentialID"
            header="No."
            body={(rowData, { rowIndex }) => rowIndex + 1}
            sortable
          />
          <Column field="name" header="Name" sortable />
          <Column field="location" header="Location" sortable />
          <Column field="phoneNumber" header="Phone Number" />
          {/* <Column field="email" header="Email" />
          <Column 
            field="capacity" 
            header="Capacity (ha)" 
            sortable
            body={(rowData) => rowData.capacity + ' ha'}
          />
          <Column 
            field="donationAmount" 
            header="Total Donations" 
            sortable
            body={(rowData) => formatCurrency(rowData.donationAmount)}
          /> */}
          <Column header="Actions" body={actionBodyTemplate} />
        </DataTable>
      </div>

      {/* Add/Edit Shelter Modal */}
      <Dialog
        visible={showModal}
        header={
          <h3 className="text-2xl font-semibold text-gray-800">
            {isEditMode ? "Update Shelter" : "Add New Shelter"}
          </h3>
        }
        onHide={handleCloseModal}
        className="w-full max-w-2xl"
        contentClassName="p-6"
      >
        <div className="grid grid-cols-2 gap-6">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shelter Name*
            </label>
            <InputText
              value={formData.name}
              onChange={(e) => handleInputChange(e, 'name')}
              className={`w-full ${errors.name ? 'p-invalid' : ''}`}
            />
            {errors.name && <small className="text-red-500">{errors.name}</small>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location*
            </label>
            <InputText
              value={formData.location}
              onChange={(e) => handleInputChange(e, 'location')}
              className={`w-full ${errors.location ? 'p-invalid' : ''}`}
            />
            {errors.location && <small className="text-red-500">{errors.location}</small>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number*
            </label>
            <InputText
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange(e, 'phoneNumber')}
              className={`w-full ${errors.phoneNumber ? 'p-invalid' : ''}`}
            />
            {errors.phoneNumber && <small className="text-red-500">{errors.phoneNumber}</small>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email*
            </label>
            <InputText
              value={formData.email}
              onChange={(e) => handleInputChange(e, 'email')}
              className={`w-full ${errors.email ? 'p-invalid' : ''}`}
            />
            {errors.email && <small className="text-red-500">{errors.email}</small>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacity (ha)*
            </label>
            <InputNumber
              value={formData.capacity}
              onValueChange={(e) => handleInputChange(e, 'capacity')}
              className={`w-full ${errors.capacity ? 'p-invalid' : ''}`}
              min={0}
              mode="decimal"
              minFractionDigits={1}
              maxFractionDigits={2}
            />
            {errors.capacity && <small className="text-red-500">{errors.capacity}</small>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Account*
            </label><InputText
              value={formData.bankAccount}
              onChange={(e) => handleInputChange(e, 'bankAccount')}
              className={`w-full ${errors.bankAccount ? 'p-invalid' : ''}`}
            />
            {errors.bankAccount && <small className="text-red-500">{errors.bankAccount}</small>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <InputText
              value={formData.website}
              onChange={(e) => handleInputChange(e, 'website')}
              className="w-full"
            />
          </div>

          <div className="col-span-2 flex justify-end gap-4">
            <Button
              label="Cancel"
              icon="pi pi-times"
              className={secondaryButtonStyle}
              onClick={handleCloseModal}
            />
            <Button
              label={isEditMode ? "Update" : "Save"}
              icon="pi pi-check"
              className={successButtonStyle}
              onClick={isEditMode ? handleUpdate : handleAdd}
            />
          </div>
        </div>
      </Dialog>

      {/* Details and Donations Modal */}
      <Dialog
        visible={showDonationsModal}
        header={
          <h3 className="text-2xl font-semibold text-gray-800">
            Shelter Details and Donations
          </h3>
        }
        onHide={() => setShowDonationsModal(false)}
        className="w-full max-w-4xl"
        contentClassName="p-6"
      >
        {selectedShelter && (
          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-4">Shelter Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Name:</p>
                <p>{selectedShelter.name}</p>
              </div>
              <div>
                <p className="font-medium">Location:</p>
                <p>{selectedShelter.location}</p>
              </div>
              <div>
                <p className="font-medium">Phone Number:</p>
                <p>{selectedShelter.phoneNumber}</p>
              </div>
              <div>
                <p className="font-medium">Email:</p>
                <p>{selectedShelter.email}</p>
              </div>
              <div>
                <p className="font-medium">Capacity:</p>
                <p>{selectedShelter.capacity} ha</p>
              </div>
              <div>
                <p className="font-medium">Bank Account:</p>
                <p>{selectedShelter.bankAccount}</p>
              </div>
              <div>
                <p className="font-medium">Website:</p>
                <p>{selectedShelter.website || 'N/A'}</p>
              </div>
              <div>
                <p className="font-medium">Total Donations:</p>
                <p>{formatCurrency(selectedShelter.donationAmount)}</p>
              </div>
            </div>
          </div>
        )}

        <div>
          <h4 className="text-xl font-semibold mb-4">Pending Donations</h4>
          <DataTable
            value={donations.filter(d => d.shelterId === selectedShelterId && !d.status)}
            paginator
            rows={5}
            className="p-datatable-custom"
            emptyMessage="No pending donations"
            rowHover
          >
            <Column field="id" header="ID" sortable />
            <Column 
              field="amount" 
              header="Amount" 
              body={(rowData) => formatCurrency(rowData.amount)}
              sortable 
            />
            <Column 
              field="date" 
              header="Date" 
              body={(rowData) => new Date(rowData.date).toLocaleDateString('vi-VN')}
              sortable 
            />
            <Column field="donorId" header="Donor ID" sortable />
            <Column body={(rowData) => (
              <Button
                label="Accept"
                className={successButtonStyle}
                onClick={() => handleAcceptDonation(rowData.id)}
              />
            )} />
          </DataTable>
        </div>

        <div className="mt-6">
          <h4 className="text-xl font-semibold mb-4">Accepted Donations</h4>
          <DataTable
            value={donations.filter(d => d.shelterId === selectedShelterId && d.status)}
            paginator
            rows={5}
            className="p-datatable-custom"
            emptyMessage="No accepted donations"
            rowHover
          >
            <Column field="id" header="ID" sortable />
            <Column 
              field="amount" 
              header="Amount" 
              body={(rowData) => formatCurrency(rowData.amount)}
              sortable 
            />
            <Column 
              field="date" 
              header="Date" 
              body={(rowData) => new Date(rowData.date).toLocaleDateString('vi-VN')}
              sortable 
            />
            <Column field="donorId" header="Donor ID" sortable />
            <Column 
              field="status" 
              header="Status" 
              body={() => <span className="text-green-500">Accepted</span>}
            />
          </DataTable>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            label="Close"
            icon="pi pi-times"
            className={secondaryButtonStyle}
            onClick={() => setShowDonationsModal(false)}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default Shelter;