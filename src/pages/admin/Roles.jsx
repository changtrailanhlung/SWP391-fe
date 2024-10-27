import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Card } from "primereact/card";
import axios from "../../services/axiosClient";

const Roles = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const toast = useRef(null);

  // Define button styles similar to Shelter component
  const buttonBaseStyle =
    "px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm font-medium";
  const primaryButtonStyle = `${buttonBaseStyle} bg-blue-500 hover:bg-blue-600 text-white`;
  const successButtonStyle = `${buttonBaseStyle} bg-green-500 hover:bg-green-600 text-white`;
  const dangerButtonStyle = `${buttonBaseStyle} bg-red-500 hover:bg-red-600 text-white`;
  const infoButtonStyle = `${buttonBaseStyle} bg-cyan-500 hover:bg-cyan-600 text-white`;

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/userrole/pendingrequests");
      const requests = response.data;

      // Fetch all users to get their roles
      const usersResponse = await axios.get("/users");
      const users = usersResponse.data;
      
      // Create a map of user details including their roles
      const userDetailsMap = {};
      users.forEach(user => {
        userDetailsMap[user.id] = {
          username: user.username,
          email: user.email,
          phone: user.phone,
          location: user.location,
          currentRoles: user.roles // The roles array from the API
        };
      });

      setUserDetails(userDetailsMap);
      setPendingRequests(requests);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch data",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = (roleId) => {
    const roleMap = {
      1: "Admin",
      2: "Shelter Staff",
      3: "Donor",
      4: "Volunteer",
      5: "Adopter",
    };
    return roleMap[roleId] || ` ${roleId}`;
  };

  const formatDate = (value) => {
    return new Date(value).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          className={infoButtonStyle}
          onClick={() => viewDetails(rowData)}
          tooltip="View Details"
        />
        <Button
          icon="pi pi-check"
          className={successButtonStyle}
          onClick={() => confirmApprove(rowData)}
          tooltip="Approve"
        />
        <Button
          icon="pi pi-times"
          className={dangerButtonStyle}
          onClick={() => confirmReject(rowData)}
          tooltip="Reject"
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
      message: "Are you sure you want to approve this role request?",
      header: "Approve Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: successButtonStyle,
      accept: () => handleApprove(request),
    });
  };

  const confirmReject = (request) => {
    confirmDialog({
      message: "Are you sure you want to reject this role request?",
      header: "Reject Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: dangerButtonStyle,
      accept: () => handleReject(request),
    });
  };

  const handleApprove = async (request) => {
    try {
      await axios.post(`/userrole/approve/${request.userId}/${request.roleId}`);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Request approved successfully",
        life: 3000,
      });
      await fetchPendingRequests();
    } catch (error) {
      console.error("Error approving request:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "Failed to approve request",
        life: 3000,
      });
    }
  };

  const handleReject = async (request) => {
    try {
      await axios.post(`/userrole/reject/${request.userId}/${request.roleId}`);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Request rejected successfully",
        life: 3000,
      });
      await fetchPendingRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "Failed to reject request",
        life: 3000,
      });
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
              <span className="font-bold">User Information</span>
            </div>
            <div className="flex flex-column gap-3">
              <div className="flex justify-between">
                <span className="font-semibold">Username:</span>
                <span>{user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Phone:</span>
                <span>{user.phone || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Location:</span>
                <span>{user.location || "N/A"}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="h-full">
          <div className="flex flex-column gap-4">
            <div className="flex items-center gap-2">
              <i className="pi pi-id-card text-xl text-primary"></i>
              <span className="font-bold">Role Information</span>
            </div>
            <div className="flex flex-column gap-3">
              <div className="flex justify-between">
                <span className="font-semibold">Current Roles:</span>
                <span>
                  {user.currentRoles
                    ?.map((role) => getRoleName(role))
                    .join(", ") || "None"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Requested Role:</span>
                <span>
                  {selectedRequest
                    ? getRoleName(selectedRequest.roleId)
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Request Date:</span>
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
          Role Requests Management
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <DataTable
          value={pendingRequests}
          loading={loading}
          paginator
          rows={10}
          className="p-datatable-custom"
          emptyMessage="No pending requests found."
          rowHover
          stripedRows
        >
          <Column
            field="userId"
            header="User"
            body={(rowData) =>
              userDetails[rowData.userId]?.username || rowData.userId
            }
            sortable
          />
          <Column
            field="roleId"
            header="Requested Role"
            body={(rowData) => getRoleName(rowData.roleId)}
            sortable
          />
          <Column
            field="createdDate"
            header="Request Date"
            body={(rowData) => formatDate(rowData.createdDate)}
            sortable
          />
          <Column
            body={actionBodyTemplate}
            header="Actions"
            exportable={false}
            style={{ minWidth: "12rem" }}
          />
        </DataTable>
      </div>

      <Dialog
        header="User Details"
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
