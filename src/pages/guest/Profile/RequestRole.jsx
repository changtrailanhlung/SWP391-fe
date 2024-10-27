import React, { useEffect, useState } from "react";
import axios from "../../../services/axiosClient"; // Adjust the import path as necessary

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
  const userId = localStorage.getItem("nameid"); // Get the user ID from local storage

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`/userrole/role/${userId}/roles`);
        setCurrentRoles(response.data.roles || []); // Set current roles to those retrieved from the API
        setRolesToSubmit(response.data.roles || []); // Initialize rolesToSubmit as the currently assigned roles for new selection
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [userId]);

  const handleCheckboxChange = (role) => {
    // Allow selection of roles that are not currently assigned
    if (!currentRoles.includes(role)) {
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
    const payload = {
      userId: userId,
      roles: rolesToSubmit,
    };

    try {
      await axios.post("/userrole/requestrole", payload);
      alert("Request submitted successfully!"); // Display success message
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request."); // Display error message
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading roles...</div>;
  }

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

      {/* Display available roles for selection */}
      <h2 className="text-2xl font-bold mb-4">Change Roles</h2>
      <div className="flex flex-wrap space-x-4 mb-4">
        {" "}
        {/* Flex container for horizontal layout */}
        {roles.map((role) => (
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
