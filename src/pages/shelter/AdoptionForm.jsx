import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axiosClient";
import { useTranslation } from "react-i18next";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { InputTextarea } from "primereact/inputtextarea";

const AdoptionForm = () => {
  const { t } = useTranslation();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [petDetails, setPetDetails] = useState(null);
  const [showPetDialog, setShowPetDialog] = useState(false);
  const toast = useRef(null);
  const shelterID = localStorage.getItem("shelterID");
  const [userDetails, setUserDetails] = useState(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [tempFormData, setTempFormData] = useState(null);
  const [tempStatus, setTempStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const formResponse = await axios.get("/form", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          accept: "text/plain",
        },
      });

      const userResponse = await axios.get("/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          accept: "text/plain",
        },
      });

      const users = userResponse.data.reduce((acc, user) => {
        acc[user.id] = user.username;
        return acc;
      }, {});

      const filteredForms = formResponse.data
        .filter((form) => form.shelter === `Shelter${shelterID}`)
        .map((form) => ({
          ...form,
          username: users[form.adopterId],
        }));

      setForms(filteredForms);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching forms:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Unable to fetch forms",
        life: 3000,
      });
      setLoading(false);
    }
  };

  const fetchPetDetails = async (petId) => {
    try {
      const response = await axios.get(`/pet/id/${petId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          accept: "*/*",
        },
      });
      setPetDetails(response.data);
      setShowPetDialog(true);
    } catch (error) {
      console.error("Error fetching pet details:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch pet details",
        life: 3000,
      });
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const currentForm = forms.find((form) => form.id === id);

      if (newStatus && checkPetHasConfirmedForm(currentForm.petId)) {
        toast.current.show({
          severity: "warning",
          summary: "Warning",
          detail:
            "This pet already has a confirmed adoption form. Please reject other forms first.",
          life: 3000,
        });
        return;
      }

      const shelterStaffId = parseInt(localStorage.getItem("nameid"));

      const formData = new FormData();
      formData.append("SocialAccount", currentForm.socialAccount || "");
      formData.append("IncomeAmount", currentForm.incomeAmount || 0);
      formData.append(
        "IdentificationImage",
        currentForm.identificationImage || ""
      );
      formData.append(
        "IdentificationImageBackSide",
        currentForm.identificationImageBackSide || ""
      );
      formData.append("AdopterId", currentForm.adopterId || 0);
      formData.append("PetId", currentForm.petId || 0);
      formData.append("Status", newStatus);
      formData.append("ShelterStaffId", shelterStaffId);
      formData.append("Shelter", `Shelter${shelterID}`);

      const response = await axios.put(`/form/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          accept: "*/*",
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: `Form ${newStatus ? "confirmed" : "rejected"} successfully`,
          life: 3000,
        });

        await sendNotification(currentForm.adopterId, newStatus);

        setForms(
          forms.map((form) =>
            form.id === id
              ? {
                  ...form,
                  status: newStatus,
                  shelterStaffId: shelterStaffId,
                  shelter: `Shelter${shelterID}`,
                }
              : form
          )
        );
      }
    } catch (error) {
      console.error("Error updating form:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update form",
        life: 3000,
      });
    }
    setShowNotificationDialog(false);
    setNotificationMessage("");
  };

  const confirmStatusUpdate = (id, newStatus) => {
    const currentForm = forms.find((form) => form.id === id);

    if (newStatus && checkPetHasConfirmedForm(currentForm.petId)) {
      toast.current.show({
        severity: "warning",
        summary: "Warning",
        detail:
          "This pet already has a confirmed adoption form. Please reject other forms first.",
        life: 3000,
      });
      return;
    }

    setTempFormData(currentForm);
    setTempStatus(newStatus);
    setShowNotificationDialog(true);
  };

  const renderNotificationDialog = () => {
    const dialogFooter = (
      <div className="flex justify-end gap-2 mt-4">
        <Button
          icon="pi pi-times"
          label={t('buttons.cancel')}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-full inline-flex items-center transition-colors duration-300"
          onClick={() => {
            setShowNotificationDialog(false);
            setNotificationMessage("");
          }}
        />
        <Button
          icon="pi pi-check"
          label={t('button.save')}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full inline-flex items-center transition-colors duration-300 mr-4"
          onClick={() => {
            if (tempFormData && tempStatus !== null) {
              updateStatus(tempFormData.id, tempStatus);
            }
          }}
        />
      </div>
    );

    return (
      <Dialog
        visible={showNotificationDialog}
        style={{ width: "50vw" }}
        header={
          <h3 className="text-2xl font-semibold text-gray-800">
            {`Send Notification - ${
              tempStatus ? "Confirm" : "Reject"
            } Adoption`}
          </h3>
        }
        modal
        footer={dialogFooter}
        onHide={() => {
          setShowNotificationDialog(false);
          setNotificationMessage("");
        }}
        className="p-0"
      >
        <div className="p-6">
          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Notification Message
            </label>
            <InputTextarea
              id="message"
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              rows={5}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your message to the adopter..."
            />
          </div>
        </div>
      </Dialog>
    );
  };
  const deleteForm = async (id) => {
    try {
      await axios.delete(`/form/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          accept: "*/*",
        },
      });

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Form deleted successfully",
        life: 3000,
      });

      setForms(forms.filter((form) => form.id !== id));
    } catch (error) {
      console.error("Error deleting form:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete form",
        life: 3000,
      });
    }
  };

  const confirmDelete = (id) => {
    confirmDialog({
      message: t("adoptionForms.confirmDelete"),
      header: t("adoptionForms.deleteConfirmation"),
      icon: "pi pi-exclamation-triangle",
      acceptClassName:
        "bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full inline-flex items-center transition-colors duration-300 mr-4",
      rejectClassName:
        "bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-full inline-flex items-center transition-colors duration-300",
      acceptLabel: t("common.delete"),
      rejectLabel: t("common.cancel"),
      className: "custom-confirm-dialog",
      accept: () => deleteForm(id),
      style: { width: "400px" },
      contentStyle: { padding: "1.5rem" },
    });
  };
  const checkPetHasConfirmedForm = (petId) => {
    return forms.some((form) => form.petId === petId && form.status === true);
  };
  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={rowData.identificationImage}
        alt={`ID Front ${rowData.id}`}
        className="w-16 h-16 object-cover rounded-lg"
      />
    );
  };

  const imageBackBodyTemplate = (rowData) => {
    return (
      <img
        src={rowData.identificationImageBackSide}
        alt={`ID Back ${rowData.id}`}
        className="w-16 h-16 object-cover rounded-lg"
      />
    );
  };

  const sequentialID = (rowData, { rowIndex }) => {
    return rowIndex + 1;
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <span
        className={`px-3 py-1 rounded-full ${
          rowData.status === null
            ? "bg-yellow-100 text-yellow-800"
            : rowData.status
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {rowData.status === null
          ? t("status.pending")
          : rowData.status
          ? t("status.confirmed")
          : t("status.rejected")}
      </span>
    );
  };
  const sendNotification = async (userId, status) => {
    try {
       // Tạo đối tượng Date cho thời gian hiện tại
    const currentDate = new Date();
    // Cộng thêm 7 tiếng
    currentDate.setHours(currentDate.getHours() + 7);
    // Chuyển đổi sang ISO string
    const adjustedDate = currentDate.toISOString();
      const title = status
        ? "Adoption Form Approved Successfully"
        : "Adoption Form Rejected";

      const notificationData = {
        title: title,
        message: notificationMessage,
        date: adjustedDate,
        userId: userId,
      };

      await axios.post("/notifications", notificationData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Notification sent successfully",
        life: 3000,
      });
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to send notification",
        life: 3000,
      });
    }
  };

  const actionBodyTemplate = (rowData) => {
    const hasConfirmedForm = forms.some(
      (form) =>
        form.petId === rowData.petId &&
        form.status === true &&
        form.id !== rowData.id
    );

    return (
      <div className="flex gap-2">
        {rowData.status === null && (
          <>
            {!hasConfirmedForm && (
              <Button
                icon="pi pi-check"
                className="p-button-rounded p-button-success p-button-sm"
                onClick={() => confirmStatusUpdate(rowData.id, true)}
                tooltip={t('tooltip.confirm')}
              />
            )}
            <Button
              icon="pi pi-times"
              className="p-button-rounded p-button-danger p-button-sm"
              onClick={() => confirmStatusUpdate(rowData.id, false)}
              tooltip={t('tooltip.reject')}
            />
          </>
        )}
        <Button
          icon="pi pi-user"
          className="p-button-rounded p-button-info p-button-sm"
          onClick={() => fetchUserDetails(rowData.adopterId)}
          tooltip="View User Details"
        />
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
  const renderUserDialog = () => {
    if (!userDetails) return null;

    return (
      <Dialog
        header={
          <h3 className="text-2xl font-semibold text-gray-800">
            {t("adoptionForms.userDetails")}
          </h3>
        }
        visible={showUserDialog}
        onHide={() => setShowUserDialog(false)}
        style={{ width: "50vw" }}
        className="p-0"
      >
        <div className="p-6">
          <div className="mb-8 flex justify-center">
            <div className="relative w-32 h-32 overflow-hidden rounded-full shadow-md">
              <img
                src={userDetails.image}
                alt={userDetails.username}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">
                {t('common.basicInformation')}
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("profile.username")}:</span>
                  <span className="font-medium text-gray-800">
                    {userDetails.username}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("profile.email")}:</span>
                  <span className="font-medium text-gray-800">
                    {userDetails.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("profile.phone")}:</span>
                  <span className="font-medium text-gray-800">
                    {userDetails.phone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("profile.location")}:</span>
                  <span className="font-medium text-gray-800">
                    {userDetails.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">
              {t("tooltip.AdditionalInformation")}
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("profile.donate")}:</span>
                  <span className="font-medium text-gray-800">
                    {userDetails.totalDonation.toLocaleString()} VND
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">{t("table.roles")}:</span>
                  <span className="font-medium text-gray-800">
                    {userDetails.roles.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("Event.dialog.points")}:</span>
                  <span className="font-medium text-gray-800">
                    {userDetails.point}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    );
  };

  const renderPetDialog = () => {
    if (!petDetails) return null;

    const combinedDiseases = petDetails.statuses
      ?.map((status) => status.disease)
      .filter(Boolean)
      .join(", ");

    const combinedVaccines = petDetails.statuses
      ?.map((status) => status.vaccine)
      .filter(Boolean)
      .join(", ");

    return (
      <Dialog
        header={
          <h3 className="text-2xl font-semibold text-gray-800">
            {t('adoptionForms.petDetails')}
          </h3>
        }
        visible={showPetDialog}
        onHide={() => setShowPetDialog(false)}
        style={{ width: "50vw" }}
        className="p-0"
      >
        <div className="p-6">
          <div className="mb-8">
            <div className="relative w-full h-64 mb-6 overflow-hidden rounded-lg shadow-md">
              <img
                src={petDetails.image}
                alt={petDetails.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">
              {t('common.basicInformation')}
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('pet.name')}:</span>
                  <span className="font-medium text-gray-800">
                    {petDetails.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('pet.type')}:</span>
                  <span className="font-medium text-gray-800">
                    {petDetails.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('pet.breed')}:</span>
                  <span className="font-medium text-gray-800">
                    {petDetails.breed || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('pet.gender')}:</span>
                  <span className="font-medium text-gray-800">
                    {petDetails.gender || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('pet.age')}:</span>
                  <span className="font-medium text-gray-800">
                    {petDetails.age || "Not specified"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">
              {t('tooltip.AdditionalInformation')}
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('pet.size')}:</span>
                  <span className="font-medium text-gray-800">
                    {petDetails.size || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('pet.color')}:</span>
                  <span className="font-medium text-gray-800">
                    {petDetails.color || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('pet.status')}:</span>
                  <span className="font-medium text-gray-800">
                    {petDetails.adoptionStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">
            {t('tooltip.MedicalHistory')}
            </h4>
            {petDetails.statuses && petDetails.statuses.length > 0 ? (
              <div className="space-y-3">
                {combinedDiseases && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('tooltip.disease')}:</span>
                    <span className="font-medium text-gray-800">
                      {combinedDiseases}
                    </span>
                  </div>
                )}
                {combinedVaccines && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('tooltip.vaccine')}:</span>
                    <span className="font-medium text-gray-800">
                      {combinedVaccines}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">{t('tooltip.Nomedicalhistoryavailable')}</p>
            )}
          </div>

          {petDetails.description && (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">
              {t("tooltip.Description")}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {petDetails.description}
              </p>
            </div>
          )}
        </div>
      </Dialog>
    );
  };
  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          accept: "text/plain",
        },
      });
      setUserDetails(response.data);
      setShowUserDialog(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch user details",
        life: 3000,
      });
    }
  };
  return (
    <div className="container mx-auto p-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      {renderPetDialog()}
      {renderUserDialog()}
      {renderNotificationDialog()}
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        {t("adoptionForms.title")}
      </h2>
      <DataTable
        value={forms}
        loading={loading}
        paginator
        rows={10}
        className="p-datatable-custom"
      >
        <Column
          field="sequentialID"
          header={t('tooltip.no')}
          body={sequentialID}
          sortable
        />
        <Column field="username" header={t('tooltip.AdopteName')} sortable />
        <Column header={t('tooltip.IDFront')} body={imageBodyTemplate} />
        <Column header={t('tooltip.IDBack')} body={imageBackBodyTemplate} />
        <Column field="socialAccount" header={t('tooltip.socialAccount')} sortable />
        <Column field="incomeAmount" header={t('tooltip.incomeAmount')} sortable />
        <Column
          field="status"
          header={t('table.status')}
          body={statusBodyTemplate}
          sortable
        />
        <Column
          header="Action"
          body={actionBodyTemplate}
          style={{ width: "200px" }}
        />
      </DataTable>
    </div>
  );
};

export default AdoptionForm;
