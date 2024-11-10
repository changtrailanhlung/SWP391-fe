import React, { useEffect, useState } from "react";
import axios from "../../../services/axiosClient"; // Adjust the import path as necessary
import { DataTable } from "primereact/datatable"; // Import PrimeReact DataTable
import { Column } from "primereact/column"; // Import PrimeReact Column
import { useTranslation } from "react-i18next"; // Import useTranslation
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast

const RequestRole = () => {
  const { t } = useTranslation(); // Initialize translation
  const [roles] = useState([
    "Admin",
    "ShelterStaff",
    "Donor",
    "Volunteer",
    "Adopter",
  ]); // Define all possible roles
  const [loading, setLoading] = useState(true);
  const [currentRoles, setCurrentRoles] = useState([]); // State to manage currently assigned roles
  const [rolesToSubmit, setRolesToSubmit] = useState([]); // State to manage roles that are selected for submission
  const [pendingRequests, setPendingRequests] = useState([]); // State to manage pending role requests
  const userId = localStorage.getItem("nameid"); // Get the user ID from local storage

  const fetchRoles = async () => {
    try {
      // Fetch current roles
      const response = await axios.get(`/userrole/role/${userId}/roles`);
      setCurrentRoles(response.data.roles || []); // Set current roles

      // Fetch pending requests
      const pendingResponse = await axios.get(
        `/userrole/pendingrequests?userId=${userId}`
      );
      setPendingRequests(pendingResponse.data || []); // Set pending requests
    } catch (error) {
      console.error("Error fetching roles or pending requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [userId]);

  const handleCheckboxChange = (role) => {
    // Only allow selection of roles that are not currently assigned and not in pending requests
    if (
      !currentRoles.includes(role) &&
      !pendingRequests.some((req) => roles[req.roleId - 1] === role) &&
      role !== "Admin" && // Prevent selecting Admin
      role !== "ShelterStaff" // Prevent selecting ShelterStaff
    ) {
      setRolesToSubmit((prevRoles) => {
        if (prevRoles.includes(role)) {
          // Remove role if already selected
          return prevRoles.filter((r) => r !== role);
        } else {
          // Add role if not selected
          return [...prevRoles, role];
        }
      });
    }
  };

  const handleRequestRole = async () => {
    // Filter roles to submit that are not currently assigned
    const rolesToRequest = rolesToSubmit.filter(
      (role) => !currentRoles.includes(role)
    );

    // Loop through each role and send a POST request
    for (const role of rolesToRequest) {
      const payload = {
        userId: userId,
        roleId: roles.indexOf(role) + 1, // Calculate roleId based on index
      };

      // Log the payload to the console for each request
      // console.log("Payload for role request:", payload);

      try {
        await axios.post("/userrole/requestrole", payload); // Send the POST request
        toast.success(t("requestRole.success", { role })); // Display success message using toast
      } catch (error) {
        console.error("Error submitting request:", error);
        toast.error(t("requestRole.error", { role })); // Display error message using toast
      }
    }

    // Reset the selected roles and fetch updated roles and requests
    setRolesToSubmit([]);
    fetchRoles(); // Re-fetch the roles and pending requests
  };

  if (loading) {
    return <div className="text-center mt-5">{t("loading.roles")}</div>;
  }

  // Check if there are any roles available for selection, excluding Admin and ShelterStaff
  const availableRoles = roles.filter(
    (role) =>
      !currentRoles.includes(role) &&
      !pendingRequests.some((req) => req.roleId === roles.indexOf(role) + 1) &&
      role !== "Admin" && // Exclude Admin
      role !== "ShelterStaff" // Exclude ShelterStaff
  );

  return (
    <div className="container mx-auto p-6">
      {/* Toast container for notifications */}
      <ToastContainer />

      {/* Display current roles */}
      <h2 className="text-2xl font-bold mb-4">{t("currentRoles.title")}</h2>
      <div className="mb-4">
        {currentRoles.length > 0 ? (
          currentRoles.map((role) => (
            <span
              key={role}
              className="bg-gray-200 rounded-full px-3 py-1 mr-2"
            >
              {role}
            </span>
          ))
        ) : (
          <p>{t("currentRoles.none")}</p>
        )}
      </div>

      {/* Display available roles for selection */}
      <h2 className="text-2xl font-bold mb-4">{t("changeRoles.title")}</h2>
      {availableRoles.length > 0 ? (
        <div className="flex flex-wrap space-x-4 mb-4">
          {/* Flex container for horizontal layout */}
          {availableRoles.map((role) => (
            <div key={role} className="flex items-center">
              <input
                type="checkbox"
                id={role}
                value={role}
                checked={rolesToSubmit.includes(role)} // Check if the role is selected for submission
                onChange={() => handleCheckboxChange(role)} // Call the function on change
                className="mr-2"
              />
              <label htmlFor={role} className="text-lg">
                {role}
              </label>
            </div>
          ))}
        </div>
      ) : (
        <p>{t("changeRoles.none")}</p>
      )}

      <button
        onClick={handleRequestRole} // Call the function on button click
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {t("saveRoles")} {/* Use translation for button text */}
      </button>

      {/* Display pending requests */}
      <h3 className="text-lg font-semibold mt-6">
        {t("pendingRequests.title")}
      </h3>
      {pendingRequests.length > 0 ? (
        <DataTable value={pendingRequests} className="mt-3">
          <Column
            field="roleId"
            header={t("pendingRequests.role")}
            body={(rowData) => roles[rowData.roleId - 1]}
          />
          <Column
            field="createdDate"
            header={t("pendingRequests.date")}
            body={(rowData) => new Date(rowData.createdDate).toLocaleString()}
          />
        </DataTable>
      ) : (
        <p>{t("pendingRequests.none")}</p>
      )}
    </div>
  );
};

export default RequestRole;
