import React from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';

const PlantingApplication = () => {

  // Inline styles for the component
  const containerStyle = {
    marginTop: '3rem',
  };

  const cardStyle = {
    padding: '2rem',
    borderRadius: '0.5rem',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const titleStyle = {
    textAlign: 'center',
    color: '#007bff',
    marginBottom: '1.5rem',
  };

  const formControlStyle = {
    borderColor: '#007bff',
  };

  const invalidFeedbackStyle = {
    color: '#dc3545',
  };

  return (
    <Container style={containerStyle}>
      <Card style={cardStyle}>
        <Card.Title style={titleStyle}>Planting Application Form</Card.Title>
        <Form>
          <Row className="mb-3">
            <Col md="6">
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  style={formControlStyle}
                />
                <div style={invalidFeedbackStyle} className="invalid-feedback">Please enter your name.</div>
              </Form.Group>
            </Col>
            <Col md="6">
              <Form.Group controlId="formContact">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your contact number"
                  style={formControlStyle}
                />
                <div style={invalidFeedbackStyle} className="invalid-feedback">Please enter a valid contact number.</div>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md="6">
              <Form.Group controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your address"
                  style={formControlStyle}
                />
                <div style={invalidFeedbackStyle} className="invalid-feedback">Please enter your address.</div>
              </Form.Group>
            </Col>
            <Col md="6">
              <Form.Group controlId="formVillage">
                <Form.Label>Village</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your village"
                  style={formControlStyle}
                />
                <div style={invalidFeedbackStyle} className="invalid-feedback">Please enter your village.</div>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md="6">
              <Form.Group controlId="formGramPanchayat">
                <Form.Label>Gram Panchayat</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Gram Panchayat"
                  style={formControlStyle}
                />
                <div style={invalidFeedbackStyle} className="invalid-feedback">Please enter Gram Panchayat.</div>
              </Form.Group>
            </Col>
            <Col md="6">
              <Form.Group controlId="formDistrict">
                <Form.Label>District</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your district"
                  style={formControlStyle}
                />
                <div style={invalidFeedbackStyle} className="invalid-feedback">Please enter your district.</div>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md="6">
              <Form.Group controlId="formState">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your state"
                  style={formControlStyle}
                />
                <div style={invalidFeedbackStyle} className="invalid-feedback">Please enter your state.</div>
              </Form.Group>
            </Col>
            <Col md="6">
              <Form.Group controlId="formCountry">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your country"
                  style={formControlStyle}
                />
                <div style={invalidFeedbackStyle} className="invalid-feedback">Please enter your country.</div>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md="6">
              <Form.Group controlId="formPin">
                <Form.Label>PIN Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your PIN code"
                  style={formControlStyle}
                />
                <div style={invalidFeedbackStyle} className="invalid-feedback">Please enter your PIN code.</div>
              </Form.Group>
            </Col>
            <Col md="6">
              <Form.Group controlId="formAadhar">
                <Form.Label>Aadhar Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your Aadhar number"
                  style={formControlStyle}
                />
                <div style={invalidFeedbackStyle} className="invalid-feedback">Please enter your Aadhar number.</div>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md="6">
              <Form.Group controlId="formLandInAcre">
                <Form.Label>Land (in acres)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter land area in acres"
                  style={formControlStyle}
                />
                <div style={invalidFeedbackStyle} className="invalid-feedback">Please enter the land area in acres.</div>
              </Form.Group>
            </Col>
            <Col md="6">
              <Form.Group controlId="formFruitSaplings">
                <Form.Label>Fruit Saplings</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter number of fruit saplings"
                  style={formControlStyle}
                />
                <div style={invalidFeedbackStyle} className="invalid-feedback">Please enter the number of fruit saplings.</div>
              </Form.Group>
            </Col>
          </Row>

          <div className="text-center">
            <Button variant="primary" type="button">Submit</Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default PlantingApplication;
