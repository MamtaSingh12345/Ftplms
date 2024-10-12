import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const RegisterFarmerForm = () => {
  const [primaryData, setPrimaryData] = useState({
    farmerName: '',
    contactNumber: '',
    aadharID: '',
    voterID: '',
    password: '',
  });

  const [otp, setOtp] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(''); // Add this state for backend error messages

  

  useEffect(() => {
    if (otpSent) {
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpSent]);

  const handleResendOTP = async () => {
    try {
      await handleSendOTP();
      setOtp('');
      setOtpVerified(false);
      setResendDisabled(true);
      setResendCooldown(30);
    } catch (error) {
      console.error('Error resending OTP:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrimaryData({ ...primaryData, [name]: value });
  };

  // Function to send OTP
const handleSendOTP = async () => {
  try {
    const response = await axios.post('http://localhost:4000/register/send-otp', {
      contactNumber: primaryData.contactNumber,
    });
    if (response.data.success) {
      setOtpSent(true);
      alert('OTP sent to your contact number.');
    } else {
      alert('Failed to send OTP: ' + response.data.message);
    }
  } catch (error) {
    console.error('Error sending OTP:', error.response ? error.response.data : error);
    alert('Error sending OTP: ' + (error.response?.data?.message || error.message));
  }
};

// Function to verify OTP
const handleVerifyOTP = async () => {
  if (!primaryData.contactNumber) {
    setErrors((prevErrors) => ({ ...prevErrors, otp: 'Please enter your contact number.' }));
    return;
  }
  if (!otp) {
    setErrors((prevErrors) => ({ ...prevErrors, otp: 'Please enter the OTP.' }));
    return;
  }

  try {
    const response = await axios.post('http://localhost:4000/register/verify-otp', {
      contactNumber: primaryData.contactNumber,
      otp,
    });
    if (response.data.success) {
      setErrors((prevErrors) => ({ ...prevErrors, otp: null }));
      alert('OTP verified successfully');
      setOtpVerified(true);
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, otp: 'Invalid OTP: ' + response.data.message }));
      setOtpVerified(false);
    }
  } catch (error) {
    console.error('Error verifying OTP:', error.response ? error.response.data : error);
    setOtpVerified(false);
    setErrors((prevErrors) => ({
      ...prevErrors,
      otp: 'Error verifying OTP: ' + (error.response?.data?.message || error.message),
    }));
  }
};




const handleSubmit = async () => {
  const newErrors = {};

  // Form validation
  if (!primaryData.farmerName) newErrors.farmerName = 'Farmer name is required';
  if (!primaryData.contactNumber) newErrors.contactNumber = 'Phone number is required';
  if (!otpVerified) newErrors.otp = 'OTP must be verified';
  if (!primaryData.aadharID && !primaryData.voterID) newErrors.aadharVoter = 'Either Aadhar or Voter ID is required';
  if (!primaryData.password) newErrors.password = 'Password is required';
  if (primaryData.password !== primaryData.confirmPassword) newErrors.confirmPassword = 'Passwords must match';

  setErrors(newErrors);
  setGeneralError(''); // Clear any previous error messages

  // If no validation errors, proceed with form submission
  if (Object.keys(newErrors).length === 0) {

    const primarySubmissionData = {
      ...primaryData,
    };

    try {
      const response = await fetch('http://localhost:4000/register/primary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(primarySubmissionData),
      });

      const result = await response.json();

      if (response.ok) {
        // Show an alert message for successful registration
        alert('Registration successful! Redirecting to login page.');

        // Redirect to the login page after success
        window.location.href = '/login';
      } else {
        // Set the backend error message in the state for frontend display
        setGeneralError(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      setGeneralError('An error occurred while submitting the form. Please try again.');
    }
  }
};


return (
  <section className="vh" style={{ backgroundColor: '#ade4b0' }}>
    <div className="container py-4 h-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col col-xl-10">
          <div className="card" style={{ borderRadius: '1rem', height: 'auto' }}>
            <div className="row g-0">
              <div className="col-md-6 d-none d-md-block">
                <img
                  src="https://wallpaperaccess.com/full/1598225.jpg"
                  alt="register form"
                  className="img-fluid"
                  style={{ borderRadius: '1rem 0 0 1rem', objectFit: 'cover', height: '100%' }}
                />
              </div>
              <div className="col-md-6 d-flex align-items-center" style={{ padding: '20px' }}>
                
                <div className="card-body p-4 p-lg-5 text-black">
                <h3 className="text-center mb-4">Farmer Registration</h3>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '16px' }}>Farmer Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="farmerName"
                        value={primaryData.farmerName}
                        onChange={handleChange}
                        isInvalid={!!errors.farmerName}
                        style={{ fontSize: '14px' }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.farmerName}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '16px' }}>Phone Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="contactNumber"
                        placeholder="+91XXXXXXXXXX"
                        value={primaryData.contactNumber}
                        onChange={handleChange}
                        isInvalid={!!errors.contactNumber}
                        style={{ fontSize: '14px' }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.contactNumber}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <div className="d-flex mb-3">
                      <Button
                        className="btn btn-secondary"
                        onClick={handleSendOTP}
                        disabled={otpSent || !primaryData.contactNumber}
                      >
                        {otpSent ? 'OTP Sent' : 'Send OTP'}
                      </Button>
                      <Button
                        className="btn btn-warning ms-2"
                        onClick={handleResendOTP}
                        disabled={resendDisabled}
                      >
                        Resend OTP {resendDisabled && `(${resendCooldown}s)`}
                      </Button>
                    </div>
                    {errors.otp && <div className="alert alert-danger">{errors.otp}</div>}

                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '16px' }}>Aadhar ID (optional)</Form.Label>
                      <Form.Control
                        type="text"
                        name="aadharID"
                        value={primaryData.aadharID}
                        onChange={handleChange}
                        style={{ fontSize: '14px' }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '16px' }}>Voter ID (mandatory if no Aadhar)</Form.Label>
                      <Form.Control
                        type="text"
                        name="voterID"
                        value={primaryData.voterID}
                        onChange={handleChange}
                        isInvalid={!!errors.aadharVoter}
                        style={{ fontSize: '14px' }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.aadharVoter}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '16px' }}>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={primaryData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        style={{ fontSize: '14px' }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '16px' }}>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={primaryData.confirmPassword}
                        onChange={handleChange}
                        isInvalid={!!errors.confirmPassword}
                        style={{ fontSize: '14px' }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {generalError && (
                      <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
                        {generalError}
                      </div>
                    )}

                      <div className="d-flex justify-content-between mb-4">
                        <Button
                          className="btn btn-primary"
                          onClick={() => setShowModal(true)}
                          disabled={!otpSent}
                        >
                          Verify
                        </Button>
                        <Button
                          type="button"
                          className="btn btn-primary w-100 ms-2"
                          onClick={handleSubmit}
                          disabled={!otpVerified}
                        >
                          Register
                        </Button>
                      </div>
                      <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>
                        Already registered?{' '}
                        <Link to="/login" style={{ color: '#393f81' }}>
                          Login here
                        </Link>
                      </p>

                    

                    {/* OTP Verification Modal */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                      <Modal.Header closeButton>
                        <Modal.Title>Verify OTP</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form.Group className="mb-3">
                          <Form.Label>Enter OTP</Form.Label>
                          <Form.Control
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            style={{ fontSize: '14px' }}
                          />
                        </Form.Group>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={async () => {
                            try {
                              await handleVerifyOTP();
                              setShowModal(false);
                            } catch (error) {
                              console.error('Error verifying OTP:', error);
                              setOtpVerified(false);
                            }
                          }}
                        >
                          Verify
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
};

export default RegisterFarmerForm;
