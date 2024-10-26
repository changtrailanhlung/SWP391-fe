import React, { useState, useEffect } from 'react';
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';

const Shelter = () => {
  const [shelters, setShelters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    capacity: '',
    phoneNumber: '',
    status: 'Active'
  });

  // Giả lập dữ liệu mẫu
  useEffect(() => {
    setShelters([
      {
        id: 1,
        name: 'Happy Pets Shelter',
        address: '123 Main Street, City',
        capacity: 50,
        phoneNumber: '(123) 456-7890',
        status: 'Active'
      },
      {
        id: 2,
        name: 'Loving Home Shelter',
        address: '456 Park Avenue, Town',
        capacity: 35,
        phoneNumber: '(098) 765-4321',
        status: 'Active'
      }
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdd = () => {
    const newShelter = {
      id: shelters.length + 1,
      ...formData
    };
    setShelters(prev => [...prev, newShelter]);
    setShowModal(false);
    setFormData({
      name: '',
      address: '',
      capacity: '',
      phoneNumber: '',
      status: 'Active'
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this shelter?')) {
      setShelters(prev => prev.filter(shelter => shelter.id !== id));
    }
  };

  const filteredShelters = shelters.filter(shelter =>
    shelter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shelter.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-2xl font-bold">Shelter Management</h2>
        <MDBBtn onClick={() => setShowModal(true)} className="px-4">
          <MDBIcon icon="plus" className="me-2" /> Add New Shelter
        </MDBBtn>
      </div>

      <div className="mb-4">
        <MDBInput
          label="Search shelters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-100"
        />
      </div>

      <MDBTable responsive>
        <MDBTableHead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Capacity</th>
            <th>Phone Number</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {filteredShelters.map((shelter) => (
            <tr key={shelter.id}>
              <td>{shelter.id}</td>
              <td>{shelter.name}</td>
              <td>{shelter.address}</td>
              <td>{shelter.capacity}</td>
              <td>{shelter.phoneNumber}</td>
              <td>
                <span className={`badge ${shelter.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                  {shelter.status}
                </span>
              </td>
              <td>
                <MDBBtn 
                  color="danger" 
                  size="sm" 
                  className="ms-2"
                  onClick={() => handleDelete(shelter.id)}
                >
                  <MDBIcon icon="trash" />
                </MDBBtn>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>

      <MDBModal show={showModal} setShow={setShowModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Add New Shelter</MDBModalTitle>
              <MDBBtn 
                className="btn-close" 
                color="none" 
                onClick={() => setShowModal(false)}
              />
            </MDBModalHeader>
            <MDBModalBody>
              <form>
                <div className="mb-3">
                  <MDBInput
                    label="Shelter Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <MDBInput
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <MDBInput
                    label="Capacity"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <MDBInput
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </form>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={() => setShowModal(false)}>
                Close
              </MDBBtn>
              <MDBBtn onClick={handleAdd}>Save</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
};

export default Shelter;