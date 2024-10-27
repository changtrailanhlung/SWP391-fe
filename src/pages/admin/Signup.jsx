import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
} from "mdb-react-ui-kit";
import "../../style/SignupPage.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "../../services/axiosClient";

function Signup() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  // Form state with additional fields
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    location: "",
    phone: "",
    password: "",
    confirmPassword: "",
    status: true,
  });

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleLoginClick = () => {
    navigate("/admin/login");
  };

  // Phone number validation
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/; // Basic Vietnamese phone number validation
    return phoneRegex.test(phone);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      setLoading(false);
      return;
    }

    if (!validatePhone(formData.phone)) {
      toast.error("Số điện thoại không hợp lệ! Vui lòng nhập 10 chữ số.");
      setLoading(false);
      return;
    }

    try {
      // Prepare request data according to API spec
      const requestData = {
        username: formData.username,
        email: formData.email,
        location: formData.location,
        phone: formData.phone,
        status: true,
        password: formData.password,
      };

      // Sử dụng axios client đã setup
      const response = await axios.post(
        "/auth/register", // Chỉ cần path tương đối vì base URL đã được cấu hình
        requestData
      );

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("signupSuccess", "true");
        navigate("/admin/login");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      let errorMessage =
        "Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.";

      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 400) {
          errorMessage = "Thông tin đăng ký không hợp lệ.";
        } else if (error.response.status === 409) {
          errorMessage = "Email hoặc tên người dùng đã tồn tại.";
        }
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <MDBContainer
      fluid
      className="p-4 background-radial-gradient overflow-hidden"
    >
      <ToastContainer />
      <MDBRow>
        <MDBCol
          md="6"
          className="text-center text-md-start d-flex flex-column justify-content-center"
        >
          <h1
            className="my-5 display-3 fw-bold ls-tight px-3"
            style={{ color: "hsl(218, 81%, 95%)" }}
          >
            {t("lg1")} <br />
            <span style={{ color: "hsl(218, 81%, 75%)" }}>{t("lg2")}</span>
          </h1>
          <p className="px-3" style={{ color: "hsl(218, 81%, 85%)" }}>
            {t("lg3")}
          </p>
        </MDBCol>

        <MDBCol md="6" className="position-relative">
          <div
            id="radius-shape-1"
            className="position-absolute rounded-circle shadow-5-strong"
          ></div>
          <div
            id="radius-shape-2"
            className="position-absolute shadow-5-strong"
          ></div>

          <MDBCard className="my-5 bg-glass">
            <MDBCardBody className="p-5">
              <h2
                className="text-center"
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  margin: "0 0 20px 0",
                }}
              >
                Đăng ký
              </h2>

              <form onSubmit={handleSubmit}>
                <MDBInput
                  wrapperClass="mb-4"
                  label="Tên người dùng"
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />

                <MDBInput
                  wrapperClass="mb-4"
                  label="Email"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <MDBInput
                  wrapperClass="mb-4"
                  label="Địa chỉ"
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />

                <MDBInput
                  wrapperClass="mb-4"
                  label="Số điện thoại"
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  placeholder="Ví dụ: 0912345678"
                />

                <div className="mb-4 d-flex">
                  <MDBInput
                    label="Mật khẩu"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="flex-grow-1"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <MDBBtn
                    tag="a"
                    color="none"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ms-2"
                  >
                    {showPassword ? (
                      <MDBIcon fas icon="eye-slash" />
                    ) : (
                      <MDBIcon fas icon="eye" />
                    )}
                  </MDBBtn>
                </div>

                <div className="mb-4 d-flex">
                  <MDBInput
                    label="Xác nhận mật khẩu"
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="flex-grow-1"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <MDBBtn
                    tag="a"
                    color="none"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="ms-2"
                  >
                    {showConfirmPassword ? (
                      <MDBIcon fas icon="eye-slash" />
                    ) : (
                      <MDBIcon fas icon="eye" />
                    )}
                  </MDBBtn>
                </div>

                <MDBBtn
                  type="submit"
                  className="w-100 mb-4"
                  size="md"
                  disabled={loading}
                >
                  {loading ? "Đang đăng ký..." : "Đăng ký"}
                </MDBBtn>
              </form>

              <div className="text-center">
                <p>
                  Đã có tài khoản?{" "}
                  <span
                    onClick={handleLoginClick}
                    style={{ color: "#007bff", cursor: "pointer" }}
                  >
                    Đăng nhập
                  </span>
                </p>
              </div>

              
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Signup;
