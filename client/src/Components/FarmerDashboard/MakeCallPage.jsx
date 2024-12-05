import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const MakeCallPage = () => {
  const [phoneNumber, setPhoneNumber] = useState(''); // State for entered phone number

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleCallClick = () => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      alert('Please enter a valid phone number.');
    }
  };

  return (
    <Container style={{ marginTop: '3rem' }}>
      <Card style={{
        padding: '2rem',
        borderRadius: '0.5rem',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}>
        <Card.Title style={{
          textAlign: 'center',
          color: '#007bff',
          marginBottom: '1.5rem',
        }}>
          Make a Call
        </Card.Title>
        <Row className="mb-3">
          <Col md="6" className="text-center">
            <img
              src="https://vectorified.com/images/call-or-text-icon-11.png"
              alt="Phone"
              style={{ width: '100px', height: '100px' }}
            />
            <h5 className="mt-3">
              <a href="tel:6398169466" style={{ textDecoration: 'none', color: '#007bff' }}>
                Call Us: 639-816-9466
              </a>
            </h5>
          </Col>
          <Col md="6">
            <div className="text-center">
              <p className="mt-3">Enter your phone number below to make a call.</p>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                />
                <button className="btn btn-primary" type="button" onClick={handleCallClick}>
                  Call
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default MakeCallPage;
