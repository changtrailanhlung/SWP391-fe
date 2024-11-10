import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import axios from "../../services/axiosClient";
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
import "../../style/LoginPage.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { jwtDecode } from "jwt-decode";

function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const signupSuccess = localStorage.getItem("signupSuccess");
    if (signupSuccess === "true") {
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      localStorage.removeItem("signupSuccess");
    }
  }, []);

  const handleRegisterClick = () => {
    navigate("/admin/signup");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loginResponse = await axios.post("/auth/login", {
        email,
        password,
      });

      if (loginResponse.status === 200 && loginResponse.data.data) {
        const { id: userId, username } = loginResponse.data.data.user;
        const token = loginResponse.data.data.token;
        const decodedUser = jwtDecode(token);

        // Lưu thông tin cơ bản vào localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("nameid", decodedUser.nameid);
        localStorage.setItem("username", decodedUser.unique_name);
        localStorage.setItem("role", decodedUser.role || '');

        // Khởi tạo userData với roles mặc định là mảng rỗng
        let userData = {
          id: userId,
          username,
          roles: []
        };

        try {
          // Thử lấy roles của user
          const roleResponse = await axios.get(`/userrole/role/${userId}/roles`);
          if (roleResponse.data && roleResponse.data.roles) {
            userData.roles = roleResponse.data.roles;
            localStorage.setItem("userRoles", JSON.stringify(roleResponse.data.roles));

            // Kiểm tra và xử lý ShelterStaff
            if (roleResponse.data.roles.includes("ShelterStaff")) {
              try {
                const shelterResponse = await axios.get(`/shelter/user/${userId}`);
                if (shelterResponse.data && shelterResponse.data.id) {
                  localStorage.setItem("shelterID", shelterResponse.data.id);
                }
              } catch (shelterError) {
                console.warn("Could not fetch shelter ID:", shelterError);
              }
            }

            // Điều hướng dựa trên role nếu có
            if (roleResponse.data.roles.includes("Admin")) {
              navigate("/admin/dashboard");
            } else if (roleResponse.data.roles.includes("ShelterStaff")) {
              navigate("/shelter/dashboard");
            } else {
              navigate("/");
            }
          } else {
            // Nếu không có roles, điều hướng về home
            localStorage.setItem("userRoles", JSON.stringify([]));
            navigate("/");
          }
        } catch (roleError) {
          // Nếu không lấy được roles (404 hoặc lỗi khác), vẫn cho phép đăng nhập và điều hướng về home
          console.warn("Could not fetch user roles:", roleError);
          localStorage.setItem("userRoles", JSON.stringify([]));
          navigate("/");
        }

        // Set user data vào context
        setUser(userData);
        toast.success("Đăng nhập thành công!");
      } else {
        toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      toast.error("Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Return component JSX remains the same
  return (
    <MDBContainer fluid className="p-4 background-radial-gradient overflow-hidden">
      <ToastContainer />
      <MDBRow>
        <MDBCol md="6" className="text-center text-md-start d-flex flex-column justify-content-center">
          <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{ color: "hsl(218, 81%, 95%)" }}>
            {t("lg1")} <br />
            <span style={{ color: "hsl(218, 81%, 75%)" }}>{t("lg2")}</span>
          </h1>
          <p className="px-3" style={{ color: "hsl(218, 81%, 85%)" }}>
            {t("lg3")}
          </p>
        </MDBCol>
        <MDBCol md="6" className="position-relative">
          <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
          <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
          <MDBCard className="my-5 bg-glass">
            <MDBCardBody className="p-5">
              <h2 className="text-center" style={{ fontSize: "2.5rem", fontWeight: "bold", margin: "0 0 20px 0" }}>
                {t("login")}
              </h2>
              <form onSubmit={handleLogin}>
                <MDBInput
                  wrapperClass="mb-4"
                  label="Địa chỉ email"
                  id="form1"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <MDBInput
                  wrapperClass="mb-4"
                  label="Mật khẩu"
                  id="form2"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <MDBBtn type="submit" className="w-100 mb-4" size="md" disabled={loading}>
                  {loading ? "Đang đăng nhập..." : t("login")}
                </MDBBtn>
              </form>
              <div className="text-center">
                <p>
                  Chưa có tài khoản?{" "}
                  <span onClick={handleRegisterClick} style={{ color: "#007bff", cursor: "pointer" }}>
                    Đăng ký
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

export default Login;