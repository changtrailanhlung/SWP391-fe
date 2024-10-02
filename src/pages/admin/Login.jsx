import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon
}
from 'mdb-react-ui-kit';
import '../../style/LoginPage.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

function Login() {
    const navigate = useNavigate(); // Tạo biến điều hướng

    const handleRegisterClick = () => {
        navigate('/admin/signup'); // Chuyển hướng đến trang signup
  };
  return (
    <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden'>

      <MDBRow>

        <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>

        <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{color: 'hsl(218, 81%, 95%)'}}>
          Cùng chúng tôi <br />
            <span style={{color: 'hsl(218, 81%, 75%)'}}>tạo cơ hội thứ hai cho thú cưng</span>
          </h1>

          <p className='px-3' style={{color: 'hsl(218, 81%, 85%)'}}>
          Hãy giúp chúng tôi mang lại cuộc sống mới cho những thú cưng bị bỏ rơi. 
          Với sự ủng hộ của bạn, chúng tôi có thể cung cấp nơi ở an toàn, chăm sóc y tế, và tình yêu thương cho những người bạn bốn chân này. 
          Mỗi sự đóng góp và hành động nhận nuôi đều làm thay đổi cuộc đời một thú cưng.
          </p>

        </MDBCol>

        <MDBCol md='6' className='position-relative'>

          <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
          <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

          <MDBCard className='my-5 bg-glass'>
            <MDBCardBody className='p-5'>
            <h2 className='text-center' style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 20px 0' }}>Login</h2>
              <MDBInput wrapperClass='mb-4' label='Email address' id='form1' type='email'/>
              <MDBInput wrapperClass='mb-4' label='Password' id='form2' type='password'/>

              <MDBBtn className='w-100 mb-4' size='md'>Login</MDBBtn>

              <div className="text-center">
                <p>Don't have an account? <span onClick={handleRegisterClick} style={{ color: '#007bff', cursor: 'pointer' }}>Register</span></p>
              </div>

              <div className="text-center">
                <p>or login with:</p>

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
