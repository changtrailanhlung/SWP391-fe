import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "../../../services/axiosClient"; // Import your axios instance

const HistoryForm = () => {
  const [petId, setPetId] = useState(10); // Assuming petId is 10; adjust as needed
  const [status, setStatus] = useState(null); // Default status to null
  const [data, setData] = useState([]); // State to hold data for the DataTable
  const donorId = localStorage.getItem("nameid"); // Assuming the donor ID is stored in localStorage

  // Function to fetch pet details for each petId in data
  const fetchPetDetails = async (petId) => {
    try {
      const response = await axios.get(`/pet/get-petbyid/${petId}`);
      return response.data; // Return pet details
    } catch (error) {
      console.error(`Error fetching pet details for petId ${petId}:`, error);
      return null; // Return null if there's an error
    }
  };

  // Function to fetch data (if needed)
  const fetchData = async () => {
    try {
      const response = await axios.get("/form"); // Adjust endpoint as needed
      const fetchedData = await Promise.all(
        response.data.map(async (item) => {
          const petDetails = await fetchPetDetails(item.petId);
          return {
            ...item,
            petName: petDetails ? petDetails.name : "Unknown", // Add pet name to the item
            gender: petDetails ? petDetails.gender : "Unknown",
            age: petDetails ? petDetails.age : "Unknown",
            color: petDetails ? petDetails.color : "Unknown",
            // Add other pet details as needed
          };
        })
      );
      setData(fetchedData); // Assuming response.data is an array
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data on component mount
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      adopterId: donorId,
      petId: petId,
      status: status,
    };

    try {
      const response = await axios.post("/form", payload);
      console.log("Response:", response.data);
      // Handle success (e.g., show a message, reset form, etc.)
      fetchData(); // Optionally refetch data to show the latest updates
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="p-col-12">
      <DataTable value={data} paginator rows={10} className="p-mt-3">
        <Column
          body={(rowData, options) => options.rowIndex + 1} // Display the row index + 1 as "No."
          header="No."
        />
        <Column field="petName" header="Pet Name" />
        <Column field="gender" header="Gender" />
        <Column field="age" header="Age" />
        <Column field="color" header="Color" />
        <Column field="status" header="Status" />
      </DataTable>
    </div>
  );
};

export default HistoryForm;
