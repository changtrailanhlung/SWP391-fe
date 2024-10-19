import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axiosClient";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const UpdateInfo = () => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState({
    username: "",
    location: "",
    phone: "",
    status: true,
    shelterId: "", // Cần cập nhật giá trị hợp lệ
    roleIds: [], // Cần cập nhật giá trị hợp lệ
    image: null, // Hình ảnh mới được chọn
    currentImage: null, // Hình ảnh hiện tại từ API
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem("nameid");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/users/${userId}`);
        setUserData((prevData) => ({
          ...prevData,
          username: response.data.username,
          location: response.data.location,
          phone: response.data.phone,
          status: response.data.status || true, // Khởi tạo giá trị từ API
          shelterId: response.data.shelterId || "", // Khởi tạo giá trị từ API
          roleIds: response.data.roleIds || [], // Khởi tạo giá trị từ API
          currentImage: response.data.image || null, // Lưu hình ảnh hiện tại từ API
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error(t("updateInfo.profileUpdateError"));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(); // Khởi tạo FormData

    // Thêm các trường vào FormData
    formData.append("Username", userData.username);
    formData.append("Location", userData.location);
    formData.append("Phone", userData.phone);
    formData.append("Status", userData.status);
    if (userData.image) {
      formData.append("Image", userData.image); // Đảm bảo rằng userData.image có dữ liệu hình ảnh hợp lệ
    }
    formData.append("ShelterId", userData.shelterId);
    userData.roleIds.forEach((roleId) => formData.append("RoleIds", roleId)); // Thêm từng roleId vào FormData

    try {
      await axios.put(`/users/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Đặt Content-Type cho yêu cầu
        },
      });
      toast.success(t("updateInfo.profileUpdateSuccess"));
      navigate("/user-info");
    } catch (error) {
      console.error(
        "Error updating user info:",
        error.response ? error.response.data : error
      );
      toast.error(t("updateInfo.profileUpdateError"));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData((prevData) => ({
        ...prevData,
        image: file, // Cập nhật hình ảnh mới
        currentImage: URL.createObjectURL(file), // Cập nhật hình ảnh hiện tại để hiển thị
      }));
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">
        {t("updateInfo.title")}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="username"
          >
            {t("updateInfo.username")}
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={userData.username}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="location"
          >
            {t("updateInfo.location")}
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={userData.location}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="phone"
          >
            {t("updateInfo.phone")}
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={userData.phone}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="image"
          >
            {t("updateInfo.image")}
            {/* Thay đổi để hiển thị label cho hình ảnh */}
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*" // Chỉ cho phép chọn hình ảnh
            onChange={handleImageChange}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />

          {/* Hiển thị hình ảnh hiện tại nếu có */}
          {userData.currentImage && (
            <div className="mb-4">
              <img
                src={userData.currentImage} // Sử dụng hình ảnh mới hoặc hình ảnh từ API
                alt="Current"
                className="w-32 h-32 object-cover rounded-md mb-2 p-2" // Kích thước hình ảnh
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
          disabled={loading}
        >
          {loading ? t("loading") : t("updateInfo.button")}
        </button>
      </form>
    </div>
  );
};

export default UpdateInfo;
