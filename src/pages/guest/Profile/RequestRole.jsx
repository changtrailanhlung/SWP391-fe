import React, { useState } from "react";
import axios from "../../../services/axiosClient";
const RequestRole = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const userId = localStorage.getItem("nameid"); // Retrieve userId from local storage

  // Define roles with their corresponding IDs
  const roles = [
    { name: "Admin", id: 1 },
    { name: "Shelter", id: 2 },
    { name: "Donor", id: 3 },
    { name: "Volunteer", id: 4 },
    { name: "Adopter", id: 5 },
  ];

  const handleRequestRole = async () => {
    // Validate if a role is selected
    if (!selectedRole) {
      setErrorMessage("Please select a role.");
      return;
    }

    const payload = {
      userId: userId ? parseInt(userId, 10) : null, // Ensure userId is an integer
      roleId: selectedRole.id, // Use the selected role's ID
    };

    console.log("Payload to submit:", payload);

    try {
      // POST the payload to the API
      const response = await axios.post("/userrole/requestrole", payload);
      alert("Request submitted successfully!");
      setSelectedRole(null); // Reset the selected role after successful submission
      setErrorMessage(""); // Clear any previous error messages
    } catch (error) {
      console.error("Error submitting request:", error);

      // Handle error responses
      if (error.response) {
        console.error("Response data:", error.response.data);
        if (error.response.data.errors) {
          setErrorMessage(
            `Validation errors: ${JSON.stringify(error.response.data.errors)}`
          );
        } else if (error.response.data.message) {
          setErrorMessage(
            `Failed to submit request: ${error.response.data.message}`
          );
        } else {
          setErrorMessage(
            "Failed to submit request: An unknown error occurred."
          );
        }
      } else {
        setErrorMessage("Failed to submit request: No response from server.");
      }
    }
  };

  const updateSelectedRole = (role) => {
    setSelectedRole(role); // Update the selected role
    setErrorMessage(""); // Clear error message when a role is selected
  };

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">Request Role</h2>
      {roles.map((role) => (
        <label key={role.name} className="flex items-center mb-2">
          <input
            type="radio"
            checked={selectedRole && selectedRole.id === role.id}
            onChange={() => updateSelectedRole(role)}
            className="mr-2"
          />
          {role.name}
        </label>
      ))}
      <button
        onClick={handleRequestRole}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit Request
      </button>
      {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default RequestRole;
