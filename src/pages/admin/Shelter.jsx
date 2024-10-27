import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { useTranslation } from "react-i18next";
import axios from "../../services/axiosClient";

const Shelter = () => {
  const { t } = useTranslation();

  const [donorsMap, setDonorsMap] = useState({});
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [donations, setDonations] = useState([]);
  const [showDonationsModal, setShowDonationsModal] = useState(false);
  const [selectedShelterId, setSelectedShelterId] = useState(null);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const buttonBaseStyle =
    "px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm font-medium";
  const primaryButtonStyle = `${buttonBaseStyle} bg-blue-500 hover:bg-blue-600 text-white`;
  const successButtonStyle = `${buttonBaseStyle} bg-green-500 hover:bg-green-600 text-white`;
  const dangerButtonStyle = `${buttonBaseStyle} bg-red-500 hover:bg-red-600 text-white`;
  const secondaryButtonStyle = `${buttonBaseStyle} bg-gray-500 hover:bg-gray-600 text-white`;
  const infoButtonStyle = `${buttonBaseStyle} bg-cyan-500 hover:bg-cyan-600 text-white`;
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    location: "",
    phoneNumber: "",
    capacity: null,
    email: "",
    bankAccount: "",
    website: "",
    donationAmount: 0,
  });

  const navigate = useNavigate();
  const toast = React.useRef(null);

  useEffect(() => {
    fetchShelters();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t("shelter.modal.fields.name.error");
    } else if (formData.name.length < 2) {
      newErrors.name = t("shelter.modal.fields.name.lengthError");
    }

    if (!formData.location.trim()) {
      newErrors.location = t("shelter.modal.fields.location.error");
    }

    const phoneRegex = /^\d{10}$/;
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t("shelter.modal.fields.phone.error");
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = t("shelter.modal.fields.phone.formatError");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("shelter.modal.fields.email.error");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("shelter.modal.fields.email.formatError");
    }

    if (!formData.capacity) {
      newErrors.capacity = t("shelter.modal.fields.capacity.error");
    } else if (formData.capacity <= 0) {
      newErrors.capacity = t("shelter.modal.fields.capacity.formatError");
    }

    if (!formData.bankAccount.trim()) {
      newErrors.bankAccount = t("shelter.modal.fields.bankAccount.error");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchShelters = async () => {
    try {
      const response = await axios.get("/shelter", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setShelters(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shelters:", error);
      toast.current.show({
        severity: "error",
        summary: t("shelter.toast.error.title"),
        detail: t("shelter.toast.error.fetch"),
        life: 3000,
      });
      setLoading(false);
    }
  };

  const handleInputChange = (e, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target?.value ?? e.value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    try {
      const formDataObj = new FormData();
      formDataObj.append("Name", formData.name);
      formDataObj.append("Location", formData.location);
      formDataObj.append("PhoneNumber", formData.phoneNumber);
      formDataObj.append("Capacity", formData.capacity);
      formDataObj.append("Email", formData.email);
      formDataObj.append("BankAccount", formData.bankAccount);
      formDataObj.append("Website", formData.website);
      formDataObj.append("DonationAmount", formData.donationAmount);

      const response = await axios.post(
        "/shelter/create_shelter",
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data) {
        await fetchShelters();
        handleCloseModal();
        toast.current.show({
          severity: "success",
          summary: t("shelter.toast.success.title"),
          detail: t("shelter.toast.success.create"),
          life: 3000,
        });
      }
    } catch (error) {
      console.error(
        "Error creating shelter:",
        error.response?.data || error.message
      );
      toast.current.show({
        severity: "error",
        summary: t("shelter.toast.error.title"),
        detail: t("shelter.toast.error.create"),
        life: 3000,
      });
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      const formDataObj = new FormData();
      formDataObj.append("Name", formData.name);
      formDataObj.append("Location", formData.location);
      formDataObj.append("PhoneNumber", formData.phoneNumber);
      formDataObj.append("Capacity", formData.capacity);
      formDataObj.append("Email", formData.email);
      formDataObj.append("BankAccount", formData.bankAccount);
      formDataObj.append("Website", formData.website);
      formDataObj.append("DonationAmount", formData.donationAmount);

      const response = await axios.put(
        `/shelter/update/${formData.id}`,
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data) {
        await fetchShelters();
        handleCloseModal();
        toast.current.show({
          severity: "success",
          summary: t("shelter.toast.success.title"),
          detail: t("shelter.toast.success.update"),
          life: 3000,
        });
      }
    } catch (error) {
      console.error(
        "Error updating shelter:",
        error.response?.data || error.message
      );
      toast.current.show({
        severity: "error",
        summary: t("shelter.toast.error.title"),
        detail: t("shelter.toast.error.update"),
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
        summary: t("shelter.toast.success.title"),
        detail: t("shelter.toast.success.delete"),
        life: 3000,
      });
    } catch (error) {
      console.error("Error deleting shelter:", error);
      toast.current.show({
        severity: "error",
        summary: t("shelter.toast.error.title"),
        detail: t("shelter.toast.error.delete"),
        life: 3000,
      });
    }
  };

  const handleOpenUpdateModal = (shelter) => {
    setFormData({
      id: shelter.id,
      name: shelter.name || "",
      location: shelter.location || "",
      phoneNumber: shelter.phoneNumber || "",
      capacity: shelter.capacity || null,
      email: shelter.email || "",
      bankAccount: shelter.bankAccount || "",
      website: shelter.website || "",
      donationAmount: shelter.donationAmount || 0,
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
      name: "",
      location: "",
      phoneNumber: "",
      capacity: null,
      email: "",
      bankAccount: "",
      website: "",
      donationAmount: 0,
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
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
      const response = await axios.get("/donate", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const donationsData = response.data;
      setDonations(donationsData);

      // Get unique donor IDs and fetch their information
      const donorIds = donationsData.map((donation) => donation.donorId);
      await fetchDonors(donorIds);
    } catch (error) {
      console.error("Error fetching donations:", error);
      toast.current.show({
        severity: "error",
        summary: t("shelter.toast.error.title"),
        detail: t("shelter.toast.error.fetchDonations"),
        life: 3000,
      });
    }
  };
  const handleAcceptDonation = async (donationId) => {
    try {
      await axios.put(
        `/donate/${donationId}/status`,
        { status: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.current.show({
        severity: "success",
        summary: t("shelter.toast.success.title"),
        detail: t("shelter.toast.success.acceptDonation"),
        life: 3000,
      });

      // Refresh both donations and shelter data
      await fetchDonations();
      await fetchShelters();

      // Update selected shelter data
      if (selectedShelterId) {
        const updatedShelter = shelters.find((s) => s.id === selectedShelterId);
        setSelectedShelter(updatedShelter);
      }
    } catch (error) {
      console.error("Error accepting donation:", error);
      toast.current.show({
        severity: "error",
        summary: t("shelter.toast.error.title"),
        detail: t("shelter.toast.error.acceptDonation"),
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

  const fetchDonors = async (donorIds) => {
    try {
      const uniqueDonorIds = [...new Set(donorIds)];
      const donorsData = {};

      for (const id of uniqueDonorIds) {
        const response = await axios.get(`/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        donorsData[id] = response.data.name || "Unknown";
      }

      setDonorsMap(donorsData);
    } catch (error) {
      console.error("Error fetching donors:", error);
    }
  };
  return (
    <div className="container mx-auto p-8 bg-gray-50">
      <Toast ref={toast} />

      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">
          {t("shelter.title")}
        </h2>
        <Button
          label={t("shelter.addNew")}
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
          emptyMessage={t("shelter.noShelters")}
          rowHover
        >
          <Column
            field="sequentialID"
            header={t("shelter.columns.no")}
            body={(rowData, { rowIndex }) => rowIndex + 1}
            sortable
          />
          <Column field="name" header={t("shelter.columns.name")} sortable />
          <Column
            field="location"
            header={t("shelter.columns.location")}
            sortable
          />
          <Column field="phoneNumber" header={t("shelter.columns.phone")} />
          <Column
            header={t("shelter.columns.actions")}
            body={actionBodyTemplate}
          />
        </DataTable>
      </div>

      {/* Add/Edit Shelter Modal */}
      <Dialog
        visible={showModal}
        header={
          <h3 className="text-2xl font-semibold text-gray-800">
            {isEditMode ? t("shelter.modal.update") : t("shelter.modal.add")}
          </h3>
        }
        onHide={handleCloseModal}
        className="w-full max-w-2xl"
        contentClassName="p-6"
      >
        <div className="grid grid-cols-2 gap-6">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("shelter.modal.fields.name.label")}
            </label>
            <InputText
              value={formData.name}
              onChange={(e) => handleInputChange(e, "name")}
              className={`w-full ${errors.name ? "p-invalid" : ""}`}
            />
            {errors.name && (
              <small className="text-red-500">{errors.name}</small>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("shelter.modal.fields.location.label")}
            </label>
            <InputText
              value={formData.location}
              onChange={(e) => handleInputChange(e, "location")}
              className={`w-full ${errors.location ? "p-invalid" : ""}`}
            />
            {errors.location && (
              <small className="text-red-500">{errors.location}</small>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("shelter.modal.fields.phone.label")}
            </label>
            <InputText
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange(e, "phoneNumber")}
              className={`w-full ${errors.phoneNumber ? "p-invalid" : ""}`}
            />
            {errors.phoneNumber && (
              <small className="text-red-500">{errors.phoneNumber}</small>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("shelter.modal.fields.email.label")}
            </label>
            <InputText
              value={formData.email}
              onChange={(e) => handleInputChange(e, "email")}
              className={`w-full ${errors.email ? "p-invalid" : ""}`}
            />
            {errors.email && (
              <small className="text-red-500">{errors.email}</small>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("shelter.modal.fields.capacity.label")}
            </label>
            <InputNumber
              value={formData.capacity}
              onValueChange={(e) => handleInputChange(e, "capacity")}
              className={`w-full ${errors.capacity ? "p-invalid" : ""}`}
              min={0}
              mode="decimal"
              minFractionDigits={1}
              maxFractionDigits={2}
            />
            {errors.capacity && (
              <small className="text-red-500">{errors.capacity}</small>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("shelter.modal.fields.bankAccount.label")}
            </label>
            <InputText
              value={formData.bankAccount}
              onChange={(e) => handleInputChange(e, "bankAccount")}
              className={`w-full ${errors.bankAccount ? "p-invalid" : ""}`}
            />
            {errors.bankAccount && (
              <small className="text-red-500">{errors.bankAccount}</small>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("shelter.modal.fields.website.label")}
            </label>
            <InputText
              value={formData.website}
              onChange={(e) => handleInputChange(e, "website")}
              className="w-full"
            />
          </div>

          <div className="col-span-2 flex justify-end gap-4">
            <Button
              label={t("shelter.modal.buttons.cancel")}
              icon="pi pi-times"
              className={secondaryButtonStyle}
              onClick={handleCloseModal}
            />
            <Button
              label={isEditMode ? t("shelter.modal.buttons.update") : t("shelter.modal.buttons.save")}
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
            {t("shelter.details.title")}
          </h3>
        }
        onHide={() => setShowDonationsModal(false)}
        className="w-full max-w-4xl"
        contentClassName="p-6"
      >
        {selectedShelter && (
          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-4">
              {t("shelter.details.info.title")}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">{t("shelter.details.info.name")}:</p>
                <p>{selectedShelter.name}</p>
              </div>
              <div>
                <p className="font-medium">
                  {t("shelter.details.info.location")}:
                </p>
                <p>{selectedShelter.location}</p>
              </div>
              <div>
                <p className="font-medium">
                  {t("shelter.details.info.phone")}:
                </p>
                <p>{selectedShelter.phoneNumber}</p>
              </div>
              <div>
                <p className="font-medium">
                  {t("shelter.details.info.email")}:
                </p>
                <p>{selectedShelter.email}</p>
              </div>
              <div>
                <p className="font-medium">
                  {t("shelter.details.info.capacity")}:
                </p>
                <p>{selectedShelter.capacity} ha</p>
              </div>
              <div>
                <p className="font-medium">
                  {t("shelter.details.info.bankAccount")}:
                </p>
                <p>{selectedShelter.bankAccount}</p>
              </div>
              <div>
                <p className="font-medium">Website:</p>
                <p>{selectedShelter.website || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">
                  {t("shelter.details.info.totalDonations")}:
                </p>
                <p>{formatCurrency(selectedShelter.donationAmount)}</p>
              </div>
            </div>
          </div>
        )}

        <div>
          <h4 className="text-xl font-semibold mb-4">
            {t("shelter.details.donations.pending")}
          </h4>
          <DataTable
            value={donations.filter(
              (d) => d.shelterId === selectedShelterId && !d.status
            )}
            paginator
            rows={5}
            className="p-datatable-custom"
            emptyMessage={t("shelter.details.donations.noPending")}
            rowHover
          >
            <Column
              body={(rowData, { rowIndex }) => rowIndex + 1}
              header={t("shelter.details.donations.columns.id")}
              sortable
            />
            <Column
              field="amount"
              header={t("shelter.details.donations.columns.amount")}
              body={(rowData) => formatCurrency(rowData.amount)}
              sortable
            />
            <Column
              field="date"
              header={t("shelter.details.donations.columns.date")}
              body={(rowData) =>
                new Date(rowData.date).toLocaleDateString("vi-VN")
              }
              sortable
            />
            <Column
              field="donorId"
              header={t("shelter.details.donations.columns.donorId")}
              sortable
            />
            <Column
              body={(rowData) => (
                <Button
                  label={t("shelter.details.donations.actions.accept")}
                  className={successButtonStyle}
                  onClick={() => handleAcceptDonation(rowData.id)}
                />
              )}
            />
          </DataTable>
        </div>

        <div className="mt-6">
          <h4 className="text-xl font-semibold mb-4">
            {t("shelter.details.donations.accepted")}
          </h4>
          <DataTable
            value={donations.filter(
              (d) => d.shelterId === selectedShelterId && d.status
            )}
            paginator
            rows={5}
            className="p-datatable-custom"
            emptyMessage={t("shelter.details.donations.noAccepted")}
            rowHover
          >
            <Column
              body={(rowData, { rowIndex }) => rowIndex + 1}
              header={t("shelter.details.donations.columns.id")}
              sortable
            />
            <Column
              field="amount"
              header={t("shelter.details.donations.columns.amount")}
              body={(rowData) => formatCurrency(rowData.amount)}
              sortable
            />
            <Column
              field="date"
              header={t("shelter.details.donations.columns.date")}
              body={(rowData) =>
                new Date(rowData.date).toLocaleDateString("vi-VN")
              }
              sortable
            />
            <Column
              field="donorId"
              
              header="Donor ID"
              sortable
            />
            <Column
              field="status"
              header={t("shelter.details.donations.columns.status")}
              body={() => (
                <span className="text-green-500">
                  {t("shelter.details.donations.status.accepted")}
                </span>
              )}
            />
          </DataTable>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            label={t("shelter.details.donations.actions.close")}
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
