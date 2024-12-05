import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

const ViewProtectionPage = () => {
  const [treeType, setTreeType] = useState('');
  const [numberOfTrees, setNumberOfTrees] = useState('');
  const [ageOfTrees, setAgeOfTrees] = useState('');
  const [agrochemicalType, setAgrochemicalType] = useState('');
  const [showAgrochemicals, setShowAgrochemicals] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const containerStyle = {
    marginTop: '3rem',
    padding: '20px',
    maxWidth: '800px',
    backgroundColor: '#f0f8ff',
    borderRadius: '10px',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
  };

  const cardStyle = {
    padding: '30px',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const titleStyle = {
    textAlign: 'center',
    color: '#28a745',
    marginBottom: '1.5rem',
    fontWeight: 'bold',
  };

  const formControlStyle = {
    borderColor: '#007bff',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  };

  const buttonStyle = (type) => ({
    margin: '5px',
    padding: '10px 20px',
    backgroundColor: selectedOption === type ? '#007bff' : undefined,
    color: selectedOption === type ? '#ffffff' : undefined,
    fontWeight: selectedOption === type ? 'bold' : undefined,
  });

  const handleAgrochemicalSelection = (type) => {
    setShowAgrochemicals(true);
    setAgrochemicalType(type);
    setSelectedOption(type);
  };

  const handleSubmit = async () => {
    let farmerID = localStorage.getItem('farmerID'); // Retrieve farmerID
  
    if (!farmerID) {
      alert('Farmer ID not found in local storage.');
      return;
    }
    farmerID = farmerID.trim();
  
    // Ensure the payload structure matches your backend's expected format
    const payload = {
     
        treeType,
        numberOfTrees,
        ageOfTrees,
        agrochemicalType: showAgrochemicals ? agrochemicalType : '',
      
    };
  
    console.log('Payload to send:', payload); // Debugging line to inspect payload structure
  
    try {
      // Send the PUT request to the backend
      const response = await axios.put(`http://localhost:4000/register/plant-protection/${farmerID}`, payload, {
        headers: {
          'Content-Type': 'application/json', // Ensure JSON content-type
        },
      });
  
      alert('Saved: ' + response.data.message);
    } catch (error) {
      console.error('Error saving plant protection details:', error);
      if (error.response) {
        alert(`Error: ${error.response.data.message || 'Failed to save plant protection details.'}`);
      } else {
        alert('Failed to save plant protection details.');
      }
    }
  };


  return (
    <Container style={containerStyle}>
      <Card style={cardStyle}>
        <Card.Title style={titleStyle}>Tree Protection Details</Card.Title>
        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formTreeType">
                <Form.Label>Select Tree Type</Form.Label>
                <Form.Control
                  as="select"
                  value={treeType}
                  onChange={(e) => setTreeType(e.target.value)}
                  style={formControlStyle}
                >
                  <option value="">Select...</option>
                  <option value="Fruit Tree">Fruit Tree</option>
                  <option value="Shade Tree">Shade Tree</option>
                  <option value="Ornamental Tree">Ornamental Tree</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formNumberOfTrees">
                <Form.Label>Number of Trees</Form.Label>
                <Form.Control
                  type="number"
                  value={numberOfTrees}
                  onChange={(e) => setNumberOfTrees(e.target.value)}
                  placeholder="Enter number of trees"
                  style={formControlStyle}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formAgeOfTrees">
                <Form.Label>Age of Trees (in years)</Form.Label>
                <Form.Control
                  type="number"
                  value={ageOfTrees}
                  onChange={(e) => setAgeOfTrees(e.target.value)}
                  placeholder="Enter age of trees"
                  style={formControlStyle}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3 text-center">
            <Col>
              <Button
                variant="success"
                className="me-2"
                style={buttonStyle('Organic Fertilizer')}
                onClick={() => handleAgrochemicalSelection('Organic Fertilizer')}
              >
                Select Organic Fertilizer
              </Button>
              <Button
                variant="warning"
                style={buttonStyle('Pesticides')}
                onClick={() => handleAgrochemicalSelection('Pesticides')}
              >
                Select Pesticides
              </Button>
            </Col>
          </Row>

          {showAgrochemicals && (
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formAgrochemicalType">
                  <Form.Label>Agrochemical Type</Form.Label>
                  <Form.Control
                    type="text"
                    value={agrochemicalType}
                    onChange={(e) => setAgrochemicalType(e.target.value)}
                    placeholder="Specify type of Agrochemical"
                    style={formControlStyle}
                  />
                </Form.Group>
              </Col>
            </Row>
          )}

          <Button onClick={handleSubmit} variant="primary">
            Save Tree Protection Details
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default ViewProtectionPage;
