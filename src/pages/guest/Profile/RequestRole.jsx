import React, { useEffect, useState } from "react";
import axios from "../../../services/axiosClient"; // Adjust the import path as necessary
import { DataTable } from "primereact/datatable"; // Import PrimeReact DataTable
import { Column } from "primereact/column"; // Import PrimeReact Column

const RequestRole = () => {
  const [roles] = useState([
    "Admin",
    "Shelter",
    "Donor",
    "Volunteer",
    "Adopter",
  ]); // Define all possible roles
  const [loading, setLoading] = useState(true);
  const [currentRoles, setCurrentRoles] = useState([]); // State to manage currently assigned roles
  const [rolesToSubmit, setRolesToSubmit] = useState([]); // State to manage roles that are selected for submission
  const [pendingRequests, setPendingRequests] = useState([]); // State to manage pending role requests
  const userId = localStorage.getItem("nameid"); // Get the user ID from local storage

  useEffect(() => {
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

    fetchRoles();
  }, [userId]);

  const handleCheckboxChange = (role) => {
    // Only allow selection of roles that are not currently assigned and not in pending requests
    if (
      !currentRoles.includes(role) &&
      !pendingRequests.some((req) => roles[req.roleId - 1] === role)
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
      console.log("Payload for role request:", payload);

      try {
        await axios.post("/userrole/requestrole", payload); // Send the POST request
        alert(`Request for role ${role} submitted successfully!`); // Display success message
      } catch (error) {
        console.error("Error submitting request:", error);
        alert(`Failed to submit request for role ${role}.`); // Display error message
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading roles...</div>;
  }

  // Check if there are any roles available for selection
  const availableRoles = roles.filter(
    (role) =>
      !currentRoles.includes(role) &&
      !pendingRequests.some((req) => req.roleId === roles.indexOf(role) + 1)
  );

  return (
    <div className="container mx-auto p-6">
      {/* Display current roles */}
      <h2 className="text-2xl font-bold mb-4">Current Roles</h2>
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
          <p>No current roles assigned.</p>
        )}
      </div>

      {/* Display available roles for selection or pending requests */}
      <h2 className="text-2xl font-bold mb-4">Change Roles</h2>
      {availableRoles.length > 0 ? (
        <div className="flex flex-wrap space-x-4 mb-4">
          {" "}
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
        <div>
          {/* Display pending requests if no roles available for selection */}
          <h3 className="text-lg font-semibold">Pending Role Requests</h3>
          <DataTable value={pendingRequests} className="mt-3">
            <Column
              field="roleId"
              header="Role ID"
              body={(rowData) => roles[rowData.roleId - 1]}
            />
            <Column
              field="createdDate"
              header="Request Date"
              body={(rowData) => new Date(rowData.createdDate).toLocaleString()}
            />
          </DataTable>
        </div>
      )}

      <button
        onClick={handleRequestRole} // Call the function on button click
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Save Roles
      </button>
    </div>
  );
};

export default RequestRole;
