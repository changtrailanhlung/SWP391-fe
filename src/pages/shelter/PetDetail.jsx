import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "../../services/axiosClient";
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';

const PetDetail = () => {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    ShelterID: '',
    UserID: '',
    Name: '',
    Type: '',
    Breed: '',
    Gender: '',
    Age: null,
    Size: '',
    Color: '',
    Description: '',
    AdoptionStatus: '',
    Image: null
  });
  
  const { id } = useParams();
  const toast = React.useRef(null);
  const navigate = useNavigate();
  const shelterID = localStorage.getItem("shelterID");

  useEffect(() => {
    fetchPetDetails();
  }, [id]);

  const fetchPetDetails = async () => {
    try {
      const response = await axios.get('/pet', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const allPets = response.data;
      const filteredPet = allPets.find(pet => 
        pet.petID === parseInt(id) && pet.shelterID === parseInt(shelterID)
      );

      if (filteredPet) {
        setPet(filteredPet);
        setEditForm({
          ShelterID: filteredPet.shelterID,
          UserID: filteredPet.userID || '',
          Name: filteredPet.name || '',
          Type: filteredPet.type || '',
          Breed: filteredPet.breed || '',
          Gender: filteredPet.gender || '',
          Age: filteredPet.age || null,
          Size: filteredPet.size || '',
          Color: filteredPet.color || '',
          Description: filteredPet.description || '',
          AdoptionStatus: filteredPet.adoptionStatus || '',
          Image: null
        });
      } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Pet not found', life: 3000 });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pet details:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Unable to fetch pet details', life: 3000 });
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
      UserID: pet.userID || '',
      Name: pet.name || '',
      Type: pet.type || '',
      Breed: pet.breed || '',
      Gender: pet.gender || '',
      Age: pet.age || null,
      Size: pet.size || '',
      Color: pet.color || '',
      Description: pet.description || '',
      AdoptionStatus: pet.adoptionStatus || '',
      Image: null
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(editForm).forEach(key => {
        if (editForm[key] !== null) {
          formData.append(key, editForm[key]);
        }
      });

      const response = await axios.put(`/pet/update/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data) {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Pet updated successfully', life: 3000 });
        setPet(response.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating pet:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update pet', life: 3000 });
    }
  };

  const handleImageUpload = (event) => {
    if (event.files && event.files[0]) {
      setEditForm(prev => ({
        ...prev,
        Image: event.files[0]
      }));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!pet) {
    return <div>Pet not found</div>;
  }

  const combinedDiseases = pet.statuses.map(status => status.disease).filter(Boolean).join(', ');
  const combinedVaccines = pet.statuses.map(status => status.vaccine).filter(Boolean).join(', ');

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' }
  ];

  

  const typeOptions = [
    { label: 'Dog', value: 'dog' },
    { label: 'Cat', value: 'cat' },
  ];

  const adoptionStatusOptions = [
    { label: 'Available', value: 'Available' },
    { label: 'Adopted', value: 'Adopted' },
  ];

  return (
    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Toast ref={toast} />
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <Button 
              label="Back to Pets"
              icon="pi pi-arrow-left"
              onClick={() => navigate('/shelter/pets')}
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
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Edit Pet Details</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {/* Pet Name */}
              <div className="form-group">
                <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                  <i className="pi pi-tag text-blue-500 mr-2"></i>
                  Pet Name
                </label>
                <InputText
                  id="name"
                  value={editForm.Name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, Name: e.target.value }))}
                  className="w-full h-12 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4"
                  placeholder="Enter pet name"
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                {/* Pet Type */}
                <div className="form-group">
                  <label htmlFor="type" className="block text-gray-700 text-sm font-medium mb-2">
                    <i className="pi pi-list text-blue-500 mr-2"></i>
                    Pet Type
                  </label>
                  <Dropdown
                    id="type"
                    value={editForm.Type}
                    options={typeOptions}
                    onChange={(e) => setEditForm(prev => ({ ...prev, Type: e.value }))}
                    className="w-full"
                    placeholder="Select pet type"
                  />
                </div>

                {/* Breed */}
                <div className="form-group">
                  <label htmlFor="breed" className="block text-gray-700 text-sm font-medium mb-2">
                    <i className="pi pi-bookmark text-blue-500 mr-2"></i>
                    Breed
                  </label>
                  <InputText
                    id="breed"
                    value={editForm.Breed}
                    onChange={(e) => setEditForm(prev => ({ ...prev, Breed: e.target.value }))}
                    className="w-full h-12 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4"
                    placeholder="Enter breed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {/* Gender */}
                <div className="form-group">
                  <label htmlFor="gender" className="block text-gray-700 text-sm font-medium mb-2">
                    <i className="pi pi-user text-blue-500 mr-2"></i>
                    Gender
                  </label>
                  <Dropdown
                    id="gender"
                    value={editForm.Gender}
                    options={genderOptions}
                    onChange={(e) => setEditForm(prev => ({ ...prev, Gender: e.value }))}
                    className="w-full"
                    placeholder="Select gender"
                  />
                </div>

                {/* Age */}
                <div className="form-group">
                  <label htmlFor="age" className="block text-gray-700 text-sm font-medium mb-2">
                    <i className="pi pi-calendar text-blue-500 mr-2"></i>
                    Age
                  </label>
                  <InputNumber
                    id="age"
                    value={editForm.Age}
                    onValueChange={(e) => setEditForm(prev => ({ ...prev, Age: e.value }))}
                    className="w-full h-12"
                    placeholder="Enter age"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {/* Size */}
                <div className="form-group">
                <label htmlFor="size" className="block text-gray-700 text-sm font-medium mb-2">
                  <i className="pi pi-chart-bar text-blue-500 mr-2"></i>
                  Size
                </label>
                <InputText
                  id="size"
                  value={editForm.Size}
                  onChange={(e) => setEditForm(prev => ({ ...prev, Size: e.target.value }))}
                  className="w-full h-12 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4"
                  placeholder="Enter pet size"
                />
              </div>
                {/* Color */}
                <div className="form-group">
                  <label htmlFor="color" className="block text-gray-700 text-sm font-medium mb-2">
                    <i className="pi pi-palette text-blue-500 mr-2"></i>
                    Color
                  </label>
                  <InputText
                    id="color"
                    value={editForm.Color}
                    onChange={(e) => setEditForm(prev => ({ ...prev, Color: e.target.value }))}
                    className="w-full h-12 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4"
                    placeholder="Enter color"
                  />
                </div>
              </div>

              {/* Adoption Status */}
              <div className="form-group">
                <label htmlFor="status" className="block text-gray-700 text-sm font-medium mb-2">
                  <i className="pi pi-heart text-blue-500 mr-2"></i>
                  Adoption Status
                </label>
                <Dropdown
                  id="status"
                  value={editForm.AdoptionStatus}
                  options={adoptionStatusOptions}
                  onChange={(e) => setEditForm(prev => ({ ...prev, AdoptionStatus: e.value }))}
                  className="w-full"
                  placeholder="Select adoption status"
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">
                  <i className="pi pi-align-left text-blue-500 mr-2"></i>
                  Description
                </label>
                <InputTextarea
                  id="description"
                  value={editForm.Description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, Description: e.target.value }))}
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
          <h2 className="text-3xl font-bold mb-6 text-gray-800">{pet.name} Details</h2>
          <Card>
            <div className="grid grid-cols-2 gap-4">
              <img src={pet.image} alt={pet.name} className="w-full h-64 object-cover rounded-lg" />
              <div>
                <p><strong>ID:</strong> {pet.petID}</p>
                <p><strong>Type:</strong> {pet.type}</p>
                <p><strong>Breed:</strong> {pet.breed || 'N/A'}</p>
                <p><strong>Gender:</strong> {pet.gender || 'N/A'}</p>
                <p><strong>Age:</strong> {pet.age || 'N/A'}</p>
                <p><strong>Size:</strong> {pet.size || 'N/A'}</p>
                <p><strong>Color:</strong> {pet.color || 'N/A'}</p>
                <p><strong>Adoption Status:</strong> {pet.adoptionStatus}</p>
                <p><strong>Description:</strong> {pet.description || 'N/A'}</p>
              </div>
            </div>
          </Card>
          <h3 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Health Status</h3>
          <Card>
            <div className="grid grid-cols-1 gap-4">
              {combinedDiseases && (
                <p><strong>Disease:</strong> {combinedDiseases}</p>
              )}
              {combinedVaccines && (
                <p><strong>Vaccine:</strong> {combinedVaccines}</p>
              )}
            </div>
          </Card>
        </>
      )}
      
    </div>
  );
};

export default PetDetail;