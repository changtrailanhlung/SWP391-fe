import React, { useState } from "react";
import { post } from "../../services/axiosClient";
import { toast } from "react-toastify";

function RegistrationForm() {
  // Form state
  const [formData, setFormData] = useState({
    identityProof: "",
    incomeAmount: 0,
    image: "",
    condition: "",
    adopterId: 0,
    shelterStaffId: 0,
    petId: 0,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prevData) => ({
          ...prevData,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await post("/adoptionregistrationform", formData);
      toast.success("Form submitted successfully!");
      setFormData({
        identityProof: "",
        incomeAmount: 0,
        image: "",
        condition: "",
        adopterId: 0,
        shelterStaffId: 0,
        petId: 0,
      });
      setImagePreview(null);
    } catch (error) {
      toast.error("Error submitting form. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-28">
      <h1 className="text-2xl font-bold mb-6">Adoption Registration Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Identity Proof
          </label>
          <input
            type="text"
            name="identityProof"
            value={formData.identityProof}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Income</label>
          <input
            type="number"
            name="incomeAmount"
            value={formData.incomeAmount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-4 w-full h-auto rounded-lg"
            />
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Condition
          </label>
          <input
            type="text"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Adopter ID
          </label>
          <input
            type="number"
            name="adopterId"
            value={formData.adopterId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Shelter Staff ID
          </label>
          <input
            type="number"
            name="shelterStaffId"
            value={formData.shelterStaffId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Pet ID</label>
          <input
            type="number"
            name="petId"
            value={formData.petId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default RegistrationForm;
