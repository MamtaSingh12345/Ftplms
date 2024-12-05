import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';

const PlantingApplication = () => {
  const [profile, setProfile] = useState({
    farmerID: '',
    farmerName: '',
    contactNumber: '',
    address: {
      village: '',
      gramPanchayat: '',
      block: '',
      district: '',
      state: '',
      country: '',
      pin: ''
    },
    aadharID: '',
    landInAcres: '',
    fruitSaplings: '', // Field to be filled by the user
    status: 'Pending' // Default status
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const containerStyle = {
    backgroundColor: 'lightgreen', // Light green background
    padding: '20px',
    borderRadius: '10px',
    maxWidth: '900px',
    margin: '0 auto',
  };
  
  const cardStyle = {
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  };
  
  const titleStyle = {
    fontSize: '2rem', // Enlarged heading
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333', // You can customize the title color if needed
  };
  
  const formControlStyle = {
    backgroundColor: '#f7f7f7',
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '5px',
  };

  useEffect(() => {
    const farmerID = localStorage.getItem('farmerID'); // Retrieve farmerID from localStorage
    if (farmerID) {
      fetchFarmerProfile(farmerID); // Fetch profile data if farmerID exists
    } else {
      setErrorMessage('Please log in to view your profile.');
    }
  }, []);

  const fetchFarmerProfile = async (farmerID) => {
    try {
      const response = await axios.get(`http://localhost:4000/register/fetch-profile/${farmerID}`);
      if (response.data.success) {
        setProfile({
          farmerID: response.data.data.farmerID || '',
          farmerName: response.data.data.farmerName || '',
          contactNumber: response.data.data.contactNumber || '',
          address: {
            village: response.data.data.address?.village || '',
            gramPanchayat: response.data.data.address?.gramPanchayat || '',
            block: response.data.data.address?.block || '',
            district: response.data.data.address?.district || '',
            state: response.data.data.address?.state || '',
            country: response.data.data.address?.country || '',
            pin: response.data.data.address?.pin || '',
          },
          aadharID: response.data.data.aadharID || '',
          landInAcres: response.data.data.landInAcres || '',
          fruitSaplings: '', // Will be filled by the user
          status: response.data.data.status || 'Pending' // Get status from the backend
        });
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching farmer profile:', error);
      setErrorMessage('Error fetching profile. Please try again later.');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const plantingApplicationData = {
      farmerID: profile.farmerID, // Ensure this is correctly set in profile
      farmerName: profile.farmerName,
      contactNumber: profile.contactNumber,
      address: profile.address,
      aadharID: profile.aadharID,
      landInAcres: profile.landInAcres,
      fruitSaplings: profile.fruitSaplings,
    };
  
    console.log('Submitting planting application data:', plantingApplicationData);
  
    try {
      // 1. Submit the planting application first
      const response = await axios.post('http://localhost:4000/register/planting-request', plantingApplicationData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Log the response to check its structure
      console.log('Response from backend:', response.data);
  
      if (response.data.success) {
        // Set success message for the user
        setSuccessMessage('Planting application submitted successfully.');
        setErrorMessage(''); // Clear any previous error messages
  
        // 2. Send a notification to the admin after successful submission
        const notificationData = {
          message: `New planting request from ${profile.farmerName}`,
          type: 'request',
          // Optionally, add more details to the notification like farmer ID or contact number
          date: new Date(), // Sending the current date for the notification
        };
  
        try {
          const notificationResponse = await axios.post('http://localhost:4000/register/notification', notificationData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          console.log('Notification sent:', notificationResponse.data);
        } catch (notificationError) {
          console.error('Error sending notification:', notificationError);
        }
  
        // Optionally clear the form or redirect after submission
      } else {
        console.error('Error from backend:', response.data.message); // Log the error message from backend
        setErrorMessage('Failed to submit the application: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error submitting planting application:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        setErrorMessage('Error submitting application: ' + (error.response.data.message || 'Please try again later.'));
      } else {
        setErrorMessage('Error submitting application. Please try again later.');
      }
    } finally {
      setLoading(false); // Reset loading state after submission attempt
    }
  };
  
  // Handle input change for fruitSaplings
  const handleInputChange = (e) => {
    setProfile({ ...profile, fruitSaplings: e.target.value });
  };

  // Fetch the farmer profile when the component mounts
  useEffect(() => {
    // Retrieve farmerID from local storage
    const storedFarmerID = localStorage.getItem('farmerID');
    if (storedFarmerID) {
      fetchFarmerProfile(storedFarmerID);
    } else {
      setErrorMessage('Farmer ID not found in local storage.');
    }
  }, []);


  return (
    <Container style={containerStyle}>
      <Card style={cardStyle}>
        <Card.Title style={titleStyle}>Planting Application Form</Card.Title>
        {errorMessage && <div style={{ color: 'red', marginBottom: '1rem' }}>{errorMessage}</div>}
        {successMessage && <div style={{ color: 'green', marginBottom: '1rem' }}>{successMessage}</div>}
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md="6">
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" value={profile.farmerName} style={formControlStyle} readOnly />
              </Form.Group>
            </Col>
            <Col md="6">
              <Form.Group controlId="formContact">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control type="text" value={profile.contactNumber} style={formControlStyle} readOnly />
              </Form.Group>
            </Col>
          </Row>
  
          <Row className="mb-3">
            <Col md="6">
              <Form.Group controlId="formVillage">
                <Form.Label>Village</Form.Label>
                <Form.Control type="text" value={profile.address.village} style={formControlStyle} readOnly />
              </Form.Group>
            </Col>
            <Col md="6">
              <Form.Group controlId="formGramPanchayat">
                <Form.Label>Gram Panchayat</Form.Label>
                <Form.Control type="text" value={profile.address.gramPanchayat} style={formControlStyle} readOnly />
              </Form.Group>
            </Col>
          </Row>
  
          <Row className="mb-3">
            <Col md="6">
              <Form.Group controlId="formBlock">
                <Form.Label>Block</Form.Label>
                <Form.Control type="text" value={profile.address.block} style={formControlStyle} readOnly />
              </Form.Group>
            </Col>
            <Col md="6">
              <Form.Group controlId="formDistrict">
                <Form.Label>District</Form.Label>
                <Form.Control type="text" value={profile.address.district} style={formControlStyle} readOnly />
              </Form.Group>
            </Col>
          </Row>
  
          <Row className="mb-3">
            <Col md="6">
              <Form.Group controlId="formState">
                <Form.Label>State</Form.Label>
                <Form.Control type="text" value={profile.address.state} style={formControlStyle} readOnly />
              </Form.Group>
            </Col>
            <Col md="6">
              <Form.Group controlId="formCountry">
                <Form.Label>Country</Form.Label>
                <Form.Control type="text" value={profile.address.country} style={formControlStyle} readOnly />
              </Form.Group>
            </Col>
          </Row>
  
          <Row className="mb-3">
            <Col md="6">
              <Form.Group controlId="formPin">
                <Form.Label>PIN Code</Form.Label>
                <Form.Control type="text" value={profile.address.pin} style={formControlStyle} readOnly />
              </Form.Group>
            </Col>
            <Col md="6">
              <Form.Group controlId="formLandInAcre">
                <Form.Label>Land (in acres)</Form.Label>
                <Form.Control type="text" value={profile.landInAcres} style={formControlStyle} readOnly />
              </Form.Group>
            </Col>
          </Row>
  
          <Row className="mb-3">
            <Col md="6">
              <Form.Group controlId="formFruitSaplings">
                <Form.Label>Fruit Saplings</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter number of saplings"
                  value={profile.fruitSaplings}
                  onChange={handleInputChange}
                  style={formControlStyle}
                  required
                />
              </Form.Group>
            </Col>
            <Col md="6">
              <Form.Group controlId="formAadharID">
                <Form.Label>Aadhar ID</Form.Label>
                <Form.Control type="text" value={profile.aadharID} style={formControlStyle} readOnly />
              </Form.Group>
            </Col>
          </Row>
           {/* Status field (read-only) */}
           <Row className="mb-3">
            <Col md="6">
              <Form.Group controlId="formStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  type="text"
                  value={profile.status}
                  style={{
                    ...formControlStyle,
                    backgroundColor: profile.status === 'Approved' ? '#d4edda' : profile.status === 'Rejected' ? '#f8d7da' : '#fff3cd',
                    color: profile.status === 'Approved' ? '#155724' : profile.status === 'Rejected' ? '#721c24' : '#856404',
                    borderColor: profile.status === 'Approved' ? '#c3e6cb' : profile.status === 'Rejected' ? '#f5c6cb' : '#ffeeba',
                    fontWeight: 'bold',
                    padding: '10px',
                    borderRadius: '5px',
                    textAlign: 'center'
                  }}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>

  
          <Button variant="success" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" /> Loading...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default PlantingApplication;
