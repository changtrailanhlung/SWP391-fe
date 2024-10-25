import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../services/axiosClient";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";

const PetDetail = () => {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isStatusDialogVisible, setIsStatusDialogVisible] = useState(false);
  const [diseases, setDiseases] = useState([""]);
  const [vaccines, setVaccines] = useState([""]);
  const [statusLoading, setStatusLoading] = useState(false);
  const [existingStatuses, setExistingStatuses] = useState([]);
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [selectedVaccines, setSelectedVaccines] = useState([]);
  const [originalDiseases, setOriginalDiseases] = useState([]);
  const [originalVaccines, setOriginalVaccines] = useState([]);
  const [initialDiseases, setInitialDiseases] = useState([]);
  const [initialVaccines, setInitialVaccines] = useState([]);
  const [editForm, setEditForm] = useState({
    ShelterID: "",
    UserID: "",
    Name: "",
    Type: "",
    Breed: "",
    Gender: "",
    Age: null,
    Size: "",
    Color: "",
    Description: "",
    AdoptionStatus: "",
    Image: null,
  });

  const { id } = useParams();
  const toast = React.useRef(null);
  const navigate = useNavigate();
  const shelterID = localStorage.getItem("shelterID");

  useEffect(() => {
    fetchPetDetails();
  }, [id]);
  useEffect(() => {
    if (id) {
      fetchStatusDetails();
    }
  }, [id]);
  const fetchStatusDetails = async () => {
    try {
      const response = await axios.get(`/statuspet/pet/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setExistingStatuses(response.data);

      // Tách diseases và vaccines từ status data
      const diseases = response.data
        .filter((status) => status.disease)
        .map((status) => ({
          id: status.statusId,
          value: status.disease,
          hasVaccine: status.vaccine !== null,
        }));

      const vaccines = response.data
        .filter((status) => status.vaccine)
        .map((status) => ({
          id: status.statusId,
          value: status.vaccine,
          hasDisease: status.disease !== null,
        }));

      setSelectedDiseases(diseases);
      setSelectedVaccines(vaccines);
      setOriginalDiseases(JSON.parse(JSON.stringify(diseases)));
      setOriginalVaccines(JSON.parse(JSON.stringify(vaccines)));
        // Lưu trữ trạng thái ban đầu
      const initialDiseaseValues = diseases.map(d => d.value);
      const initialVaccineValues = vaccines.map(v => v.value);
      setInitialDiseases(initialDiseaseValues);
      setInitialVaccines(initialVaccineValues);
      setDiseases(diseases.map((d) => d.value));
      setVaccines(vaccines.map((v) => v.value));
    } catch (error) {
      console.error("Error fetching status details:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch status details",
        life: 3000,
      });
    }
  };
  const handleCloseDialog = () => {
    setDiseases(initialDiseases.length > 0 ? [...initialDiseases] : ['']);
    setVaccines(initialVaccines.length > 0 ? [...initialVaccines] : ['']);
    setSelectedDiseases(JSON.parse(JSON.stringify(originalDiseases)));
    setSelectedVaccines(JSON.parse(JSON.stringify(originalVaccines)));
    setIsStatusDialogVisible(false);
  };
  const fetchPetDetails = async () => {
    try {
      const response = await axios.get("/pet", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const allPets = response.data;
      const filteredPet = allPets.find(
        (pet) =>
          pet.petID === parseInt(id) && pet.shelterID === parseInt(shelterID)
      );

      if (filteredPet) {
        setPet(filteredPet);
        setEditForm({
          ShelterID: filteredPet.shelterID,
          UserID: filteredPet.userID || "",
          Name: filteredPet.name || "",
          Type: filteredPet.type || "",
          Breed: filteredPet.breed || "",
          Gender: filteredPet.gender || "",
          Age: filteredPet.age || null,
          Size: filteredPet.size || "",
          Color: filteredPet.color || "",
          Description: filteredPet.description || "",
          AdoptionStatus: filteredPet.adoptionStatus || "",
          Image: null,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Pet not found",
          life: 3000,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pet details:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Unable to fetch pet details",
        life: 3000,
      });
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      ShelterID: pet.shelterID,
      UserID: pet.userID || "",
      Name: pet.name || "",
      Type: pet.type || "",
      Breed: pet.breed || "",
      Gender: pet.gender || "",
      Age: pet.age || null,
      Size: pet.size || "",
      Color: pet.color || "",
      Description: pet.description || "",
      AdoptionStatus: pet.adoptionStatus || "",
      Image: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(editForm).forEach((key) => {
        if (editForm[key] !== null) {
          formData.append(key, editForm[key]);
        }
      });

      const response = await axios.put(`/pet/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Pet updated successfully",
          life: 3000,
        });
        setPet(response.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating pet:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update pet",
        life: 3000,
      });
    }
  };

  const handleImageUpload = (event) => {
    if (event.files && event.files[0]) {
      setEditForm((prev) => ({
        ...prev,
        Image: event.files[0],
      }));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!pet) {
    return <div>Pet not found</div>;
  }

  const combinedDiseases = pet.statuses
    .map((status) => status.disease)
    .filter(Boolean)
    .join(", ");
  const combinedVaccines = pet.statuses
    .map((status) => status.vaccine)
    .filter(Boolean)
    .join(", ");

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ];

  const typeOptions = [
    { label: "Dog", value: "dog" },
    { label: "Cat", value: "cat" },
  ];

  const adoptionStatusOptions = [
    { label: "Available", value: "Available" },
    { label: "Adopted", value: "Adopted" },
  ];
  const handleAddDisease = () => {
    setDiseases([...diseases, ""]);
  };

  const handleAddVaccine = () => {
    setVaccines([...vaccines, ""]);
  };

  const handleDiseaseChange = (index, value) => {
    const newDiseases = [...selectedDiseases];
    if (newDiseases[index]) {
      newDiseases[index].value = value;
      setSelectedDiseases(newDiseases);
    }

    const diseaseValues = [...diseases];
    diseaseValues[index] = value;
    setDiseases(diseaseValues);
  };

  const handleVaccineChange = (index, value) => {
    const newVaccines = [...selectedVaccines];
    if (newVaccines[index]) {
      newVaccines[index].value = value;
      setSelectedVaccines(newVaccines);
    }

    const vaccineValues = [...vaccines];
    vaccineValues[index] = value;
    setVaccines(vaccineValues);
  };

  const handleRemoveDisease = (index) => {
    if (diseases.length > 1) {
      const newDiseases = diseases.filter((_, i) => i !== index);
      setDiseases(newDiseases);
    }
  };

  const handleRemoveVaccine = (index) => {
    if (vaccines.length > 1) {
      const newVaccines = vaccines.filter((_, i) => i !== index);
      setVaccines(newVaccines);
    }
  };

  const handleStatusSubmit = async () => {
    setStatusLoading(true);
    try {
      // 1. Xử lý xóa status
      const deletionPromises = [];
      const updatePromises = [];

      // Lấy current state của diseases và vaccines từ form
      const currentDiseases = diseases.filter((d) => d);
      const currentVaccines = vaccines.filter((v) => v);

      // Xử lý xóa diseases
      selectedDiseases.forEach((disease) => {
        if (!currentDiseases.includes(disease.value)) {
          const status = existingStatuses.find(
            (s) => s.statusId === disease.id
          );

          if (status) {
            if (!status.vaccine) {
              // Trường hợp 1: Status độc lập - xóa hoàn toàn
              deletionPromises.push(
                axios.delete(`/statuspet/${disease.id}`, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                })
              );
            } else {
              // Trường hợp 2: Status không độc lập
              const pairedVaccine = selectedVaccines.find(
                (v) => v.id === disease.id
              );

              if (!currentVaccines.includes(pairedVaccine?.value)) {
                // 2a: Cả disease và vaccine đều bị xóa - xóa toàn bộ status
                deletionPromises.push(
                  axios.delete(`/statuspet/${disease.id}`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  })
                );
              } else {
                // 2b: Chỉ xóa disease - update disease thành null
                updatePromises.push(
                  axios.put(
                    `/statuspet/${disease.id}`,
                    {
                      date: new Date().toISOString(),
                      disease: null,
                      vaccine: status.vaccine,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                    }
                  )
                );
              }
            }
          }
        }
      });

      // Xử lý xóa vaccines
      selectedVaccines.forEach((vaccine) => {
        if (!currentVaccines.includes(vaccine.value)) {
          const status = existingStatuses.find(
            (s) => s.statusId === vaccine.id
          );

          if (status) {
            if (!status.disease) {
              // Trường hợp 1: Status độc lập - xóa hoàn toàn
              deletionPromises.push(
                axios.delete(`/statuspet/${vaccine.id}`, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                })
              );
            } else {
              // Trường hợp 2: Status không độc lập
              const pairedDisease = selectedDiseases.find(
                (d) => d.id === vaccine.id
              );

              if (!currentDiseases.includes(pairedDisease?.value)) {
                // 2a: Cả disease và vaccine đều bị xóa - xóa toàn bộ status
                // (Skip nếu đã được xử lý trong phần diseases)
                if (
                  !deletionPromises.some((p) =>
                    p.config?.url?.includes(vaccine.id)
                  )
                ) {
                  deletionPromises.push(
                    axios.delete(`/statuspet/${vaccine.id}`, {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                    })
                  );
                }
              } else {
                // 2b: Chỉ xóa vaccine - update vaccine thành null
                updatePromises.push(
                  axios.put(
                    `/statuspet/${vaccine.id}`,
                    {
                      date: new Date().toISOString(),
                      disease: status.disease,
                      vaccine: null,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                    }
                  )
                );
              }
            }
          }
        }
      });

      // 2. Thực hiện các thao tác update hiện có cho các status còn lại
      // Update diseases đã thay đổi
      selectedDiseases
        .filter((d) => d.id && currentDiseases.includes(d.value))
        .forEach((d) => {
          const original = originalDiseases.find((od) => od.id === d.id);
          if (original && original.value !== d.value) {
            updatePromises.push(
              axios.put(
                `/statuspet/${d.id}`,
                {
                  date: new Date().toISOString(),
                  disease: d.value,
                  vaccine: existingStatuses.find((s) => s.statusId === d.id)
                    ?.vaccine,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              )
            );
          }
        });

      // Update vaccines đã thay đổi
      selectedVaccines
        .filter((v) => v.id && currentVaccines.includes(v.value))
        .forEach((v) => {
          const original = originalVaccines.find((ov) => ov.id === v.id);
          if (original && original.value !== v.value) {
            updatePromises.push(
              axios.put(
                `/statuspet/${v.id}`,
                {
                  date: new Date().toISOString(),
                  vaccine: v.value,
                  disease: existingStatuses.find((s) => s.statusId === v.id)
                    ?.disease,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              )
            );
          }
        });

      // 3. Xử lý thêm mới status (giữ nguyên logic cũ)
      const createPromises = [];

      // Tìm status có trường rỗng để update
      const emptyDiseaseStatuses = existingStatuses.filter(
        (s) => s.disease === null && s.vaccine !== null
      );
      const emptyVaccineStatuses = existingStatuses.filter(
        (s) => s.vaccine === null && s.disease !== null
      );

      // Xử lý diseases mới
      const newDiseases = currentDiseases.filter(
        (d) => !selectedDiseases.some((sd) => sd.value === d)
      );
      newDiseases.forEach((disease, index) => {
        if (emptyDiseaseStatuses[index]) {
          updatePromises.push(
            axios.put(
              `/statuspet/${emptyDiseaseStatuses[index].statusId}`,
              {
                date: new Date().toISOString(),
                disease: disease,
                vaccine: emptyDiseaseStatuses[index].vaccine,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
          );
        } else {
          const formData = new FormData();
          formData.append("Disease", disease);
          formData.append("Vaccine", "");
          formData.append("Date", new Date().toISOString());
          formData.append("PetId", id);

          createPromises.push(
            axios.post("/statuspet", formData, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
          );
        }
      });

      // Xử lý vaccines mới
      const newVaccines = currentVaccines.filter(
        (v) => !selectedVaccines.some((sv) => sv.value === v)
      );
      newVaccines.forEach((vaccine, index) => {
        if (emptyVaccineStatuses[index]) {
          updatePromises.push(
            axios.put(
              `/statuspet/${emptyVaccineStatuses[index].statusId}`,
              {
                date: new Date().toISOString(),
                vaccine: vaccine,
                disease: emptyVaccineStatuses[index].disease,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
          );
        } else {
          const formData = new FormData();
          formData.append("Disease", "");
          formData.append("Vaccine", vaccine);
          formData.append("Date", new Date().toISOString());
          formData.append("PetId", id);

          createPromises.push(
            axios.post("/statuspet", formData, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
          );
        }
      });

      // Thực thi tất cả các promises
      await Promise.all([
        ...deletionPromises,
        ...updatePromises,
        ...createPromises,
      ]);

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Health status updated successfully",
        life: 3000,
      });

      // Reset form và đóng dialog
      setIsStatusDialogVisible(false);
      setDiseases([""]);
      setVaccines([""]);

      // Refresh dữ liệu
      await fetchStatusDetails();
      await fetchPetDetails();
    } catch (error) {
      console.error("Error updating health status:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update health status",
        life: 3000,
      });
    } finally {
      setStatusLoading(false);
    }
  };
  const renderStatusDialog = () => {
    return (
      <Dialog
        visible={isStatusDialogVisible}
        onHide={() => setIsStatusDialogVisible(false)}
        header={
          <div className="text-2xl font-bold text-gray-800 p-4">
            <i className="pi pi-heart-fill text-blue-500 mr-2"></i>
            Update Health Status
          </div>
        }
        footer={
          <div className="flex justify-end gap-4 p-4 border-t">
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={handleCloseDialog}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
            />
            <Button
              label="Save Changes"
              icon="pi pi-check"
              onClick={handleStatusSubmit}
              loading={statusLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
            />
          </div>
        }
        className="w-full max-w-2xl"
        contentClassName="pb-0"
      >
        <div className="p-6">
          {/* Diseases Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                <i className="pi pi-exclamation-circle text-blue-500 mr-2"></i>
                Diseases
              </h3>
              <Button
                label="Add Disease"
                icon="pi pi-plus"
                onClick={handleAddDisease}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
              />
            </div>
            <div className="space-y-4">
              {diseases.map((disease, index) => (
                <div key={`disease-${index}`} className="flex gap-2">
                  <div className="flex-grow">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Disease {index + 1}
                    </label>
                    <div className="p-inputgroup">
                      <InputText
                        value={disease}
                        onChange={(e) =>
                          handleDiseaseChange(index, e.target.value)
                        }
                        placeholder="Enter disease name"
                        className="w-full h-12 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      {diseases.length > 1 && (
                        <Button
                          icon="pi pi-times"
                          onClick={() => handleRemoveDisease(index)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vaccines Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                <i className="pi pi-check-circle text-blue-500 mr-2"></i>
                Vaccines
              </h3>
              <Button
                label="Add Vaccine"
                icon="pi pi-plus"
                onClick={handleAddVaccine}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
              />
            </div>
            <div className="space-y-4">
              {vaccines.map((vaccine, index) => (
                <div key={`vaccine-${index}`} className="flex gap-2">
                  <div className="flex-grow">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Vaccine {index + 1}
                    </label>
                    <div className="p-inputgroup">
                      <InputText
                        value={vaccine}
                        onChange={(e) =>
                          handleVaccineChange(index, e.target.value)
                        }
                        placeholder="Enter vaccine name"
                        className="w-full h-12 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      {vaccines.length > 1 && (
                        <Button
                          icon="pi pi-times"
                          onClick={() => handleRemoveVaccine(index)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Dialog>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Toast ref={toast} />
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <Button
            label="Back to Pets"
            icon="pi pi-arrow-left"
            onClick={() => navigate("/shelter/pets")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
          />
          {!isEditing && (
            <Button
              label="Edit Pet"
              icon="pi pi-pencil"
              onClick={handleEdit}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
            />
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Edit Pet Details
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Pet Name */}
            <div className="form-group">
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                <i className="pi pi-tag text-blue-500 mr-2"></i>
                Pet Name
              </label>
              <InputText
                id="name"
                value={editForm.Name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, Name: e.target.value }))
                }
                className="w-full h-12 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4"
                placeholder="Enter pet name"
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Pet Type */}
              <div className="form-group">
                <label
                  htmlFor="type"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  <i className="pi pi-list text-blue-500 mr-2"></i>
                  Pet Type
                </label>
                <Dropdown
                  id="type"
                  value={editForm.Type}
                  options={typeOptions}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, Type: e.value }))
                  }
                  className="w-full"
                  placeholder="Select pet type"
                />
              </div>

              {/* Breed */}
              <div className="form-group">
                <label
                  htmlFor="breed"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  <i className="pi pi-bookmark text-blue-500 mr-2"></i>
                  Breed
                </label>
                <InputText
                  id="breed"
                  value={editForm.Breed}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, Breed: e.target.value }))
                  }
                  className="w-full h-12 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4"
                  placeholder="Enter breed"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Gender */}
              <div className="form-group">
                <label
                  htmlFor="gender"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  <i className="pi pi-user text-blue-500 mr-2"></i>
                  Gender
                </label>
                <Dropdown
                  id="gender"
                  value={editForm.Gender}
                  options={genderOptions}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, Gender: e.value }))
                  }
                  className="w-full"
                  placeholder="Select gender"
                />
              </div>

              {/* Age */}
              <div className="form-group">
                <label
                  htmlFor="age"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  <i className="pi pi-calendar text-blue-500 mr-2"></i>
                  Age
                </label>
                <InputNumber
                  id="age"
                  value={editForm.Age}
                  onValueChange={(e) =>
                    setEditForm((prev) => ({ ...prev, Age: e.value }))
                  }
                  className="w-full h-12"
                  placeholder="Enter age"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Size */}
              <div className="form-group">
                <label
                  htmlFor="size"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  <i className="pi pi-chart-bar text-blue-500 mr-2"></i>
                  Size
                </label>
                <InputText
                  id="size"
                  value={editForm.Size}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, Size: e.target.value }))
                  }
                  className="w-full h-12 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4"
                  placeholder="Enter pet size"
                />
              </div>
              {/* Color */}
              <div className="form-group">
                <label
                  htmlFor="color"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  <i className="pi pi-palette text-blue-500 mr-2"></i>
                  Color
                </label>
                <InputText
                  id="color"
                  value={editForm.Color}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, Color: e.target.value }))
                  }
                  className="w-full h-12 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4"
                  placeholder="Enter color"
                />
              </div>
            </div>

            {/* Adoption Status */}
            <div className="form-group">
              <label
                htmlFor="status"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                <i className="pi pi-heart text-blue-500 mr-2"></i>
                Adoption Status
              </label>
              <Dropdown
                id="status"
                value={editForm.AdoptionStatus}
                options={adoptionStatusOptions}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, AdoptionStatus: e.value }))
                }
                className="w-full"
                placeholder="Select adoption status"
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label
                htmlFor="description"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                <i className="pi pi-align-left text-blue-500 mr-2"></i>
                Description
              </label>
              <InputTextarea
                id="description"
                value={editForm.Description}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    Description: e.target.value,
                  }))
                }
                rows={3}
                className="w-full border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-4"
                placeholder="Enter pet description"
              />
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                <i className="pi pi-image text-blue-500 mr-2"></i>
                Pet Image
              </label>
              <FileUpload
                mode="basic"
                name="Image"
                accept="image/*"
                maxFileSize={1000000}
                onSelect={handleImageUpload}
                className="w-full"
                chooseLabel="Choose Image"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-4">
              <Button
                type="button"
                label="Cancel"
                icon="pi pi-times"
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
              />
              <Button
                type="submit"
                label="Save Changes"
                icon="pi pi-check"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
              />
            </div>
          </form>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            {pet.name} Details
          </h2>
          <Card>
            <div className="grid grid-cols-2 gap-4">
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div>
                <p>
                  <strong>ID:</strong> {pet.petID}
                </p>
                <p>
                  <strong>Type:</strong> {pet.type}
                </p>
                <p>
                  <strong>Breed:</strong> {pet.breed || "N/A"}
                </p>
                <p>
                  <strong>Gender:</strong> {pet.gender || "N/A"}
                </p>
                <p>
                  <strong>Age:</strong> {pet.age || "N/A"}
                </p>
                <p>
                  <strong>Size:</strong> {pet.size || "N/A"}
                </p>
                <p>
                  <strong>Color:</strong> {pet.color || "N/A"}
                </p>
                <p>
                  <strong>Adoption Status:</strong> {pet.adoptionStatus}
                </p>
                <p>
                  <strong>Description:</strong> {pet.description || "N/A"}
                </p>
              </div>
            </div>
          </Card>
          <h3 className="text-2xl font-bold mt-6 mb-4 text-gray-800">
            Health Status
          </h3>
          <Button
            label="Add Health Status"
            icon="pi pi-plus"
            onClick={() => setIsStatusDialogVisible(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
          />
          <Card>
            <div className="grid grid-cols-1 gap-4">
              {combinedDiseases && (
                <p>
                  <strong>Disease:</strong> {combinedDiseases}
                </p>
              )}
              {combinedVaccines && (
                <p>
                  <strong>Vaccine:</strong> {combinedVaccines}
                </p>
              )}
            </div>
          </Card>
        </>
      )}
      {renderStatusDialog()}
    </div>
  );
};

export default PetDetail;
