import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import axios from "../../services/axiosClient"
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon
} from 'mdb-react-ui-kit';
import '../../style/LoginPage.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();
  const handleRegisterClick = () => {
    navigate('/admin/signup');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginResponse = await axios.post('/auth/login', { email, password });
  
      if (loginResponse.status === 200 && loginResponse.data.data) {
        const userId = loginResponse.data.data.user.id;
        const token = loginResponse.data.data.token;
  
        // Lưu token vào localStorage hoặc cookie
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
  
        // Lấy vai trò của người dùng
        const roleResponse = await axios.get(`/userrole/role/${userId}/roles`);
        const userRoles = roleResponse.data[0].roles;

        localStorage.setItem("userRoles", JSON.stringify(userRoles));

        // Set user in context
        setUser({ id: userId, username, roles: userRoles });

        // Redirect based on role
        if (userRoles && userRoles.includes("Admin")) {
          navigate("/admin/dashboard");
        } else if (userRoles.includes("ShelterStaff")) {
          navigate("/shelter/dashboard");
        } else {
          navigate('/');
        }
  
        toast.success('Đăng nhập thành công!');
      } else {
        toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      toast.error('Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.');
    }
  };

  return (
    <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden'>
      <ToastContainer />
      <MDBRow>
        {/* Phần nội dung bên trái */}
        <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>
        <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{color: 'hsl(218, 81%, 95%)'}}>
        {t("lg1")} <br />
            <span style={{color: 'hsl(218, 81%, 75%)'}}>{t("lg2")}</span>
          </h1>

          <p className='px-3' style={{color: 'hsl(218, 81%, 85%)'}}>
          {t("lg3")}
          </p>
        </MDBCol>

        {/* Phần form đăng nhập */}
        <MDBCol md='6' className='position-relative'>
          <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
          <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
          <MDBCard className='my-5 bg-glass'>
            <MDBCardBody className='p-5'>
              <h2 className='text-center' style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 20px 0' }}>Đăng nhập</h2>
              <form onSubmit={handleLogin}>
                <MDBInput
                  wrapperClass='mb-4'
                  label='Địa chỉ email'
                  id='form1'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <MDBInput
                  wrapperClass='mb-4'
                  label='Mật khẩu'
                  id='form2'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <MDBBtn type='submit' className='w-100 mb-4' size='md'>Login</MDBBtn>
              </form>
              <div className="text-center">
                <p>Chưa có tài khoản? <span onClick={handleRegisterClick} style={{ color: '#007bff', cursor: 'pointer' }}>Đăng ký</span></p>
              </div>
              <div className="text-center">
                <p>hoặc đăng nhập với:</p>
                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='google' size="sm"/>
                </MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;