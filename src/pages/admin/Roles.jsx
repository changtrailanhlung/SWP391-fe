import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Card } from "primereact/card";
import { useTranslation } from "react-i18next";
import axios from "../../services/axiosClient";

const Roles = () => {
  const { t } = useTranslation();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [error, setError] = useState(null);
  const toast = useRef(null);
  const mounted = useRef(false);

  // Define button styles similar to Shelter component
  const buttonBaseStyle =
    "px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm font-medium";
  const primaryButtonStyle = `${buttonBaseStyle} bg-blue-500 hover:bg-blue-600 text-white`;
  const successButtonStyle = `${buttonBaseStyle} bg-green-500 hover:bg-green-600 text-white`;
  const dangerButtonStyle = `${buttonBaseStyle} bg-red-500 hover:bg-red-600 text-white`;
  const infoButtonStyle = `${buttonBaseStyle} bg-cyan-500 hover:bg-cyan-600 text-white`;
  const cancelButtonStyle = `${buttonBaseStyle} bg-gray-500 hover:bg-gray-600 text-white`;

  useEffect(() => {
    mounted.current = true;
    fetchPendingRequests();
    return () => {
      mounted.current = false;
    };
  }, []);

  const fetchPendingRequests = async () => {
    if (!mounted.current) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get("/userrole/pendingrequests");
      const requests = response.data;
  
      if (!mounted.current) return;
  
      if (!requests || !Array.isArray(requests)) {
        setPendingRequests([]);
        setUserDetails({});
        return;
      }
  
      if (requests.length > 0) {
        const usersResponse = await axios.get("/users");
        const users = usersResponse.data;
        
        if (!mounted.current) return;
  
        const userDetailsMap = {};
        users.forEach(user => {
          userDetailsMap[user.id] = {
            username: user.username,
            email: user.email,
            phone: user.phone,
            location: user.location,
            currentRoles: user.roles
          };
        });
  
        setUserDetails(userDetailsMap);
      } else {
        setUserDetails({});
      }
  
      setPendingRequests(requests);
    } catch (error) {
      if (!mounted.current) return;
      
      console.error("Error fetching data:", error);
      setError(error);
      
      if (error.response?.status !== 404) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: t("toast.error.fetchData"),
          life: 3000,
        });
      }
      
      setPendingRequests([]);
      setUserDetails({});
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  const getRoleName = (roleId) => {
    const roleMap = {
      1: t("roles.admin"),
      2: t("roles.shelterStaff"),
      3: t("roles.donor"),
      4: t("roles.volunteer"),
      5: t("roles.adopter"),
    };
    return roleMap[roleId] || ` ${roleId}`;
  };

  const formatDate = (value) => {
    return new Date(value).toLocaleDateString();
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          className={infoButtonStyle}
          onClick={() => viewDetails(rowData)}
          tooltip={t("buttons.viewDetails")}
        />
        <Button
          icon="pi pi-check"
          className={successButtonStyle}
          onClick={() => confirmApprove(rowData)}
          tooltip={t("buttons.approve")}
        />
        <Button
          icon="pi pi-times"
          className={dangerButtonStyle}
          onClick={() => confirmReject(rowData)}
          tooltip={t("buttons.reject")}
        />
      </div>
    );
  };

  const viewDetails = (request) => {
    setSelectedRequest(request);
    setShowDialog(true);
  };

  const confirmApprove = (request) => {
    confirmDialog({
      message: t("confirmDialog.approve.message"),
      header: t("confirmDialog.approve.title"),
      icon: "pi pi-info-circle",
      accept: () => handleApprove(request),
      reject: () => {},
      acceptLabel: t("buttons.yes"),
      rejectLabel: t("buttons.no"),
      acceptIcon: "pi pi-check",
      rejectIcon: "pi pi-times",
      acceptClassName: `${successButtonStyle} w-24`,
      rejectClassName: `${cancelButtonStyle} w-24`,
      className: "custom-confirm-dialog",
      style: { width: '400px' },
      contentClassName: "p-4",
      position: 'center',
      footer: (options) => {
        return (
          <div className="flex justify-end gap-2 mt-4">
            <Button
              label={t("buttons.no")}
              icon="pi pi-times"
              onClick={options.reject}
              className={`${cancelButtonStyle} w-24`}
            />
            <Button
              label={t("buttons.yes")}
              icon="pi pi-check"
              onClick={options.accept}
              className={`${successButtonStyle} w-24`}
            />
          </div>
        );
      }
    });
  };

  const confirmReject = (request) => {
    confirmDialog({
      message: t("confirmDialog.reject.message"),
      header: t("confirmDialog.reject.title"),
      icon: "pi pi-exclamation-triangle",
      accept: () => handleReject(request),
      reject: () => {},
      acceptLabel: t("buttons.yes"),
      rejectLabel: t("buttons.no"),
      acceptIcon: "pi pi-check",
      rejectIcon: "pi pi-times",
      acceptClassName: `${dangerButtonStyle} w-24`,
      rejectClassName: `${cancelButtonStyle} w-24`,
      className: "custom-confirm-dialog",
      style: { width: '400px' },
      contentClassName: "p-4",
      position: 'center',
      footer: (options) => {
        return (
          <div className="flex justify-end gap-2 mt-4">
            <Button
              label={t("buttons.no")}
              icon="pi pi-times"
              onClick={options.reject}
              className={`${cancelButtonStyle} w-24`}
            />
            <Button
              label={t("buttons.yes")}
              icon="pi pi-check"
              onClick={options.accept}
              className={`${dangerButtonStyle} w-24`}
            />
          </div>
        );
      }
    });
  };

  const handleApprove = async (request) => {
    try {
      setLoading(true);
      await axios.put(`/userrole/acceptrole/${request.userId}/${request.roleId}`);
      
      if (!mounted.current) return;

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: t("toast.success.approveRequest"),
        life: 3000,
      });
      
      setPendingRequests(prev => prev.filter(req => 
        !(req.userId === request.userId && req.roleId === request.roleId)
      ));
      
      await fetchPendingRequests();
    } catch (error) {
      if (!mounted.current) return;
      
      console.error("Error approving request:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: t("toast.error.approveRequest"),
        life: 3000,
      });
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  const handleReject = async (request) => {
    try {
      setLoading(true);
      await axios.delete(`/userrole/${request.userId}/${request.roleId}`);
      
      if (!mounted.current) return;

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: t("toast.success.rejectRequest"),
        life: 3000,
      });
      
      setPendingRequests(prev => prev.filter(req => 
        !(req.userId === request.userId && req.roleId === request.roleId)
      ));
      
      await fetchPendingRequests();
    } catch (error) {
      if (!mounted.current) return;
      
      console.error("Error rejecting request:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: t("toast.error.rejectRequest"),
        life: 3000,
      });
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  const userDetailContent = (user) => {
    if (!user) return null;

    return (
      <div className="grid grid-cols-2 gap-6">
        <Card className="h-full">
          <div className="flex flex-column gap-4">
            <div className="flex items-center gap-2">
              <i className="pi pi-user text-xl text-primary"></i>
              <span className="font-bold">{t("dialog.userInfo.title")}</span>
            </div>
            <div className="flex flex-column gap-3">
              <div className="flex justify-between">
                <span className="font-semibold">{t("dialog.userInfo.username")}:</span>
                <span>{user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">{t("dialog.userInfo.email")}:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">{t("dialog.userInfo.phone")}:</span>
                <span>{user.phone || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">{t("dialog.userInfo.location")}:</span>
                <span>{user.location || "N/A"}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="h-full">
          <div className="flex flex-column gap-4">
            <div className="flex items-center gap-2">
              <i className="pi pi-id-card text-xl text-primary"></i>
              <span className="font-bold">{t("dialog.roleInfo.title")}</span>
            </div>
            <div className="flex flex-column gap-3">
              <div className="flex justify-between">
                <span className="font-semibold">{t("dialog.roleInfo.currentRoles")}:</span>
                <span>
                  {user.currentRoles
                    ?.map((role) => getRoleName(role))
                    .join(", ") || "None"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">{t("dialog.roleInfo.requestedRole")}:</span>
                <span>
                  {selectedRequest
                    ? getRoleName(selectedRequest.roleId)
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">{t("dialog.roleInfo.requestDate")}:</span>
                <span>
                  {selectedRequest
                    ? formatDate(selectedRequest.createdDate)
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto p-8 bg-gray-50">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
        {t("sidebar.roles")}
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <DataTable
          value={pendingRequests}
          loading={loading}
          paginator
          rows={10}
          className="p-datatable-custom"
          emptyMessage={t("table.emptyMessage")}
          rowHover
          stripedRows
        >
          <Column
            field="userId"
            header={t("table.columns.user")}
            body={(rowData) =>
              userDetails[rowData.userId]?.username || rowData.userId
            }
            sortable
          />
          <Column
            field="roleId"
            header={t("table.columns.requestedRole")}
            body={(rowData) => getRoleName(rowData.roleId)}
            sortable
          />
          <Column
            field="createdDate"
            header={t("table.columns.requestDate")}
            body={(rowData) => formatDate(rowData.createdDate)}
            sortable
          />
          <Column
            body={actionBodyTemplate}
            header={t("table.columns.actions")}
            exportable={false}
            style={{ minWidth: "12rem" }}
          />
        </DataTable>
      </div>

      <Dialog
        header={t("dialog.userDetails")}
        visible={showDialog}
        style={{ width: "80vw" }}
        onHide={() => setShowDialog(false)}
        contentClassName="p-6"
      >
        {selectedRequest &&
          userDetailContent(userDetails[selectedRequest.userId])}
      </Dialog>
    </div>
  );
};

export default Roles;