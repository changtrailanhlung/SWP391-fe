import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "../../services/axiosClient";
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button'; 
const PetDetail = () => {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!pet) {
    return <div>Pet not found</div>;
  }

  const combinedDiseases = pet.statuses.map(status => status.disease).filter(Boolean).join(', ');
  const combinedVaccines = pet.statuses.map(status => status.vaccine).filter(Boolean).join(', ');

  return (
    <div className="container mx-auto p-4">
      <Toast ref={toast} />
      <Button 
        label="Back to Pets"
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full inline-flex items-center transition-colors duration-300"
        onClick={() => navigate('/shelter/pets')}
      />
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
      
    </div>
  );
};

export default PetDetail;