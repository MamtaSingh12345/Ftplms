import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap'; // Import Bootstrap components

const ResetPassword = () => {
  const [contactNumber, setContactNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState(''); // State for OTP
  const [showOtpModal, setShowOtpModal] = useState(false); // State for modal visibility
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to send OTP
  const handleSendOtp = async () => {
    try {
      const response = await axios.post('https://ftplms.onrender.com/register/send-otp', {
        contactNumber,
      });
      if (response.data.success) {
        setShowOtpModal(true); // Show OTP modal on successful OTP request
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
  const handleVerifyOtp = async () => {
    if (!otp) {
      setErrorMessage('Please enter the OTP.');
      return;
    }
  
    try {
      const response = await axios.post('https://ftplms.onrender.com/register/verify-otp', {
        contactNumber,
        otp,
      });
      if (response.data.success) {
        setErrorMessage('');
        alert('OTP verified successfully');
        setShowOtpModal(false); // Close OTP modal on successful verification
      } else {
        setErrorMessage('Invalid OTP: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error.response ? error.response.data : error);
      setErrorMessage('Error verifying OTP: ' + (error.response?.data?.message || error.message));
    }
  };
  
  // Function to handle password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors
    setSuccessMessage(''); // Clear previous success messages
  
    try {
      const response = await axios.post('http://localhost:4000/register/reset-password', {
        contactNumber,
        newPassword,
        confirmPassword,
        otp, // Make sure you have this field as well
      });
  
      if (response.data.success) {
        setSuccessMessage('Password reset successfully. You can now log in.');
        setTimeout(() => {
          navigate('/login'); // Redirect to Login page after a short delay
        }, 2000);
      } else {
        setErrorMessage(response.data.message || 'Password reset failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      setErrorMessage('Error during password reset. Please try again.');
    }
  };
  
  return (
    <section className="vh" style={{ backgroundColor: '#ade4b0' }}>
      <div className="container py-4 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: '1rem', height: '100vh' }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <img
                    src="https://wallpaperaccess.com/full/1598225.jpg"
                    alt="reset password form"
                    className="img-fluid"
                    style={{ borderRadius: '1rem 0 0 1rem' }}
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center" style={{ height: '100vh' }}>
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form onSubmit={handleResetPassword}>
                      <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: '1px' }}>
                        Reset your password
                      </h5>

                      {/* Contact Number Field */}
                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          id="contactNumber"
                          className="form-control form-control-lg"
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                          required
                        />
                        <label className="form-label" htmlFor="contactNumber">
                          Phone Number
                        </label>
                      </div>

                      {/* New Password Field */}
                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="newPassword"
                          className="form-control form-control-lg"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        <label className="form-label" htmlFor="newPassword">
                          New Password
                        </label>
                      </div>

                      {/* Confirm Password Field */}
                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="confirmPassword"
                          className="form-control form-control-lg"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        <label className="form-label" htmlFor="confirmPassword">
                          Confirm Password
                        </label>
                      </div>

                      {/* Display error or success message */}
                      {errorMessage && (
                        <div className="alert alert-danger" role="alert">
                          {errorMessage}
                        </div>
                      )}
                      {successMessage && (
                        <div className="alert alert-success" role="alert">
                          {successMessage}
                        </div>
                      )}

                      {/* Send OTP button */}
                      <div className="pt-1 mb-4">
                        <button 
                          className="btn btn-primary btn-lg btn-block" 
                          type="button" 
                          onClick={handleSendOtp}>
                          Send OTP
                        </button>
                      </div>

                      {/* Submit button */}
                      <div className="pt-1 mb-4">
                        <button className="btn btn-dark btn-lg btn-block" type="submit">
                          Reset Password
                        </button>
                      </div>

                      <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>
                        Remembered your password?{' '}
                        <Link to="/login" style={{ color: '#393f81' }}>
                          Login here
                        </Link>
                      </p>
                      <a href="#!" className="small text-muted">
                        Terms of use.
                      </a>
                      <a href="#!" className="small text-muted">
                        Privacy policy
                      </a>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)}>
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
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOtpModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleVerifyOtp}>
            Verify OTP
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default ResetPassword;
