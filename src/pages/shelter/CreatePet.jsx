import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "../../services/axiosClient";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";

const CreatePet = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const initialPetState = {
    shelterID: "",
    userID: null,
    name: "",
    type: "",
    breed: "",
    gender: "",
    age: "",
    size: "",
    color: "",
    description: "",
    adoptionStatus: "Available",
    image: null,
  };

  const [newPet, setNewPet] = useState(initialPetState);
  const [errors, setErrors] = useState({});
  const toast = useRef(null);
  const [isAgeFocused, setIsAgeFocused] = useState(false);

  const petTypes = [t('petType.dog'), t('petType.cat')];
  const genderOptions = [t('gender.male'), t('gender.female')];
  

  useEffect(() => {
    const storedShelterID = localStorage.getItem("shelterID");
    if (storedShelterID) {
      setNewPet((prev) => ({ ...prev, shelterID: storedShelterID }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPet((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleDropdownChange = (name, value) => {
    setNewPet((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileUpload = (event) => {
    if (event.files && event.files[0]) {
      setNewPet((prev) => ({ ...prev, image: event.files[0] }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = {
      name: t('pet.name'),
      type: t('pet.type'),
      breed: t('pet.breed'),
      gender: t('pet.gender'),
      age: t('pet.age'),
      size: t('pet.size'),
      color: t('pet.color'),
      description: t('pet.description'),
    };

    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!newPet[field]) {
        newErrors[field] = t('validation.required', { field: label });
      }
    });

    if (!newPet.image) {
      newErrors.image = t('validation.imageRequired');
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Vui lòng điền đầy đủ thông tin",
        life: 3000,
      });
      return;
    }

    const formData = new FormData();
    Object.entries(newPet).forEach(([key, value]) => {
      if (value !== null) {
        formData.append(key.charAt(0).toUpperCase() + key.slice(1), value);
      }
    });

    try {
      const response = await axios.post("/pet/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: "Tạo thú cưng mới thành công",
          life: 3000,
        });
        // Reset form
        setNewPet({
          ...initialPetState,
          shelterID: localStorage.getItem("shelterID"),
        });
        // Đợi toast hiển thị xong rồi mới chuyển trang
        setTimeout(() => {
          navigate("/shelter/pets");
        }, 1000);
      }
    } catch (error) {
      console.error("Error creating pet:", error);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: error.response?.data?.message || "Không thể tạo thú cưng mới",
        life: 3000,
      });
      return;
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <Toast ref={toast} />
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">{t('pet.createNew')}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-10">
          {/* Tên thú cưng */}
          <div className="form-group relative">
            <span className="p-float-label" style={{ height: '56px' }}>
              <InputText
                id="name"
                name="name"
                value={newPet.name}
                onChange={handleInputChange}
                className="w-full h-14 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <label 
                htmlFor="name" 
                className="flex items-center gap-2 text-lg bg-white px-2"
                style={{
                  transform: newPet.name ? 'translateY(-40px)' : 'translateY(0)',
                  transition: 'transform 0.2s',
                  left: '8px',
                  top: '16px'
                }}
              >
                <i className="pi pi-id-card text-blue-500"></i>
                {t('pet.name')}
              </label>
            </span>
            {errors.name && <small className="text-red-500">{errors.name}</small>}
          </div>

          {/* Loại */}
          <div className="form-group relative">
            <span className="p-float-label" style={{ height: '56px' }}>
              <Dropdown
                id="type"
                value={newPet.type}
                options={petTypes}
                onChange={(e) => handleDropdownChange("type", e.value)}
                className="w-full h-14 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <label 
                htmlFor="type" 
                className="flex items-center gap-2 text-lg bg-white px-2"
                style={{
                  transform: newPet.type ? 'translateY(-40px)' : 'translateY(0)',
                  transition: 'transform 0.2s',
                  left: '8px',
                  top: '16px'
                }}
              >
                <i className="pi pi-heart text-blue-500"></i>
                {t('pet.type')}
              </label>
            </span>
            {errors.type && <small className="text-red-500">{errors.type}</small>}
          </div>

          {/* Giới tính */}
          <div className="form-group relative">
            <span className="p-float-label" style={{ height: '56px' }}>
              <Dropdown
                id="gender"
                value={newPet.gender}
                options={genderOptions}
                onChange={(e) => handleDropdownChange("gender", e.value)}
                className="w-full h-14 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <label 
                htmlFor="gender" 
                className="flex items-center gap-2 text-lg bg-white px-2"
                style={{
                  transform: newPet.gender ? 'translateY(-40px)' : 'translateY(0)',
                  transition: 'transform 0.2s',
                  left: '8px',
                  top: '16px'
                }}
              >
                <i className="pi pi-user text-blue-500"></i>
                {t('pet.gender')}
              </label>
            </span>
            {errors.gender && <small className="text-red-500">{errors.gender}</small>}
          </div>

          {/* Kích thước */}
          <div className="form-group relative">
            <span className="p-float-label" style={{ height: '56px' }}>
              <InputText
                id="size"
                name="size"
                value={newPet.size}
                onChange={handleInputChange}
                className="w-full h-14 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <label 
                htmlFor="size" 
                className="flex items-center gap-2 text-lg bg-white px-2"
                style={{
                  transform: newPet.size ? 'translateY(-40px)' : 'translateY(0)',
                  transition: 'transform 0.2s',
                  left: '8px',
                  top: '16px'
                }}
              >
                <i className="pi pi-rulers text-blue-500"></i>
                {t('pet.size')}
              </label>
            </span>
            {errors.size && <small className="text-red-500">{errors.size}</small>}
          </div>
        </div>

        <div className="space-y-10">
          {/* Giống */}
          <div className="form-group relative">
            <span className="p-float-label" style={{ height: '56px' }}>
              <InputText
                id="breed"
                name="breed"
                value={newPet.breed}
                onChange={handleInputChange}
                className="w-full h-14 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <label 
                htmlFor="breed" 
                className="flex items-center gap-2 text-lg bg-white px-2"
                style={{
                  transform: newPet.breed ? 'translateY(-40px)' : 'translateY(0)',
                  transition: 'transform 0.2s',
                  left: '8px',
                  top: '16px'
                }}
              >
                <i className="pi pi-tag text-blue-500"></i>
                {t('pet.breed')}
              </label>
            </span>
            {errors.breed && <small className="text-red-500">{errors.breed}</small>}
          </div>

          {/* Tuổi */}
          <div className="form-group relative">
            <span className="p-float-label" style={{ height: '56px' }}>
              <InputNumber
                id="age"
                name="age"
                value={newPet.age}
                onFocus={() => setIsAgeFocused(true)} // Bắt sự kiện focus
                onBlur={() => setIsAgeFocused(false)}  // Bắt sự kiện blur
                onValueChange={(e) => handleDropdownChange("age", e.value)}
                mode="decimal"
                
                className="w-full h-14 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <label 
                htmlFor="age" 
                className="flex items-center gap-2 text-lg bg-white px-2"
                style={{
                  transform: newPet.age ? 'translateY(-40px)' : 'translateY(0)',
                  transition: 'transform 0.2s',
                  left: '8px',
                  top: '16px'
                }}
              >
                <i className="pi pi-calendar text-blue-500"></i>
                {t('pet.age')}
              </label>
            </span>
            {errors.age && <small className="text-red-500">{errors.age}</small>}
          </div>

          {/* Màu sắc */}
          <div className="form-group relative">
            <span className="p-float-label" style={{ height: '56px' }}>
              <InputText
                id="color"
                name="color"
                value={newPet.color}
                onChange={handleInputChange}
                className="w-full h-14 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <label 
                htmlFor="color" 
                className="flex items-center gap-2 text-lg bg-white px-2"
                style={{
                  transform: newPet.color ? 'translateY(-40px)' : 'translateY(0)',
                  transition: 'transform 0.2s',
                  left: '8px',
                  top: '16px'
                }}
              >
                <i className="pi pi-palette text-blue-500"></i>
                {t('pet.color')}
              </label>
            </span>
            {errors.color && <small className="text-red-500">{errors.color}</small>}
          </div>
        </div>
      </div>

      <div className="mt-9 space-y-15">
        {/* Mô tả */}
        <div className="form-group relative">
          <span className="p-float-label">
            <InputTextarea
              id="description"
              name="description"
              value={newPet.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <label 
              htmlFor="description" 
              className="flex items-center gap-2 text-lg bg-white px-2"
              style={{
                transform: newPet.description ? 'translateY(-40px)' : 'translateY(0)',
                transition: 'transform 0.2s',
                left: '8px',
                top: '16px'
              }}
            >
              <i className="pi pi-align-left text-blue-500"></i>
              {t('pet.description')}
            </label>
          </span>
          {errors.description && <small className="text-red-500">{errors.description}</small>}
        </div>

        {/* Hình ảnh */}
        <div className="form-group">
          <label className="flex items-center gap-2 text-lg bg-white px-2">
            <i className="pi pi-image text-blue-500"></i>
            Hình ảnh
          </label>
          <FileUpload
            mode="basic"
            name="image"
            url="/api/upload"
            accept="image/*"
            maxFileSize={1000000}
            onSelect={handleFileUpload}
            chooseLabel="Chọn hình ảnh"
            className="w-full"
            emptyTemplate={
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                <i className="pi pi-image text-4xl text-gray-400 mb-2"></i>
                <p className="text-gray-500">Kéo và thả hình ảnh vào đây hoặc click để chọn</p>
              </div>
            }
          />
          {errors.image && <small className="text-red-500">{errors.image}</small>}
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-8 gap-4">
        <Button
              label={t('common.back')}
              icon="pi pi-arrow-left"
              severity="secondary"
              outlined
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-300"
              onClick={() => navigate("/shelter/pets")}
            />
            <Button
              label={t('pet.create')}
              icon="pi pi-check"
              severity="success"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-300"
              onClick={handleSubmit}
            />
        </div>
      </div>
    </div>
  );
};

  export default CreatePet;
  