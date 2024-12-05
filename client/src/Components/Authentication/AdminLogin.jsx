import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  // Hardcoded admin credentials
  const hardcodedPhoneNumber = '9876543210';
  const hardcodedPassword = 'admin123';

  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true); // Set loading to true when login starts

    // Simulate authentication by checking hardcoded credentials
    setTimeout(() => {
      if (contactNumber === hardcodedPhoneNumber && password === hardcodedPassword) {
        alert('Login successful!');
        navigate('/admin-dashboard'); // Navigate to admin dashboard
      } else {
        setErrorMessage('Invalid phone number or password. Please try again.');
      }
      setLoading(false); // Set loading to false after login is complete
    }, 1000); // Simulate a network request with a timeout
  };

  return (
    <section className="vh" style={{ backgroundColor: '#ade4b0' }}>
      <div className="container py-4 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: '1rem', padding: '20px', overflow: 'hidden' }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <img
                    src="https://wallpaperaccess.com/full/1598225.jpg"
                    alt="login form"
                    className="img-fluid"
                    style={{ borderRadius: '1rem 0 0 1rem' }}
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form onSubmit={handleLogin}>
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <span className="h5 fw-bold mb-0">Admin Login - Fruit Tree Management</span>
                      </div>
                      <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: '1px', fontSize: '20px' }}>
                        Sign into your account
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

                      {/* Password Field */}
                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="password"
                          className="form-control form-control-lg"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <label className="form-label" htmlFor="password">
                          Password
                        </label>
                      </div>

                      {/* Display error message if there's an issue */}
                      {errorMessage && (
                        <div className="alert alert-danger" role="alert" style={{ fontSize: '14px' }}>
                          {errorMessage}
                        </div>
                      )}

                      {/* Submit button */}
                      <div className="pt-1 mb-4">
                        <button
                          className="btn btn-dark btn-lg btn-block"
                          type="submit"
                          disabled={loading} // Disable button when loading
                        >
                          {loading ? 'Please wait...' : 'Login'} {/* Display 'Please wait...' when loading */}
                        </button>
                      </div>
                    </form>
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

export default AdminLogin;
