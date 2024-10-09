import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
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
import '../../style/SignupPage.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

function Signup() {
  const [showPassword, setShowPassword] = useState(false); // state để điều khiển việc hiển thị password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // state cho confirm password
  const { t, i18n } = useTranslation();
  return (
    <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden'>

      <MDBRow>

        <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>

          <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{color: 'hsl(218, 81%, 95%)'}}>
          {t("lg1")} <br />
            <span style={{color: 'hsl(218, 81%, 75%)'}}>{t("lg2")}</span>
          </h1>

          <p className='px-3' style={{color: 'hsl(218, 81%, 85%)'}}>
          {t("lg3")}
          </p>

        </MDBCol>

        <MDBCol md='6' className='position-relative'>

          <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
          <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
          
          <MDBCard className='my-5 bg-glass'>
            <MDBCardBody className='p-5'>
            <h2 className='text-center my-5' style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 20px 0' }}>Register</h2>
              <MDBInput wrapperClass='mb-4' label='UserName' id='form3' type='text'/>
              <MDBInput wrapperClass='mb-4' label='Email' id='form3' type='email'/>

              {/* Input cho Password với nút toggle hiển thị password */}
              <div className="mb-4 d-flex">
                <MDBInput
                  label="Password"
                  id="form4"
                  type={showPassword ? 'text' : 'password'}
                  className="flex-grow-1"
                />
                <MDBBtn
                  tag='a'
                  color='none'
                  onClick={() => setShowPassword(!showPassword)}
                  className="ms-2"
                >
                  {showPassword ? <MDBIcon fas icon="eye-slash" /> : <MDBIcon fas icon="eye" />}
                </MDBBtn>
              </div>

              {/* Input cho Confirm Password với nút toggle hiển thị password */}
              <div className="mb-4 d-flex">
                <MDBInput
                  label="Confirm Password"
                  id="form5"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="flex-grow-1"
                />
                
              </div>

              <MDBBtn className='w-100 mb-4' size='md'>Sign Up</MDBBtn>

              <div className="text-center">
                <p>or sign up with:</p>
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

export default Signup;
