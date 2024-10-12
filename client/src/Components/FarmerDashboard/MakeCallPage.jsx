import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
//import phoneImage from 'https://vectorified.com/images/call-or-text-icon-11.png'; // Phone image URL

const MakeCallPage = () => {
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

  return (
    <Container style={containerStyle}>
      <Card style={cardStyle}>
        <Card.Title style={titleStyle}>Make a Call</Card.Title>
        <Row className="mb-3">
          <Col md="6" className="text-center">
            <img src="https://vectorified.com/images/call-or-text-icon-11.png" alt="Phone" style={{ width: '100px', height: '100px' }} />
            <h5 className="mt-3">Call Us: 123-456-7890</h5> {/* Replace with your actual phone number */}
          </Col>
          <Col md="6">
            <div className="text-center">
              <p className="mt-3">Enter your phone number below to make a call.</p>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter phone number"
                />
                <button className="btn btn-primary" type="button">Call</button>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default MakeCallPage;
