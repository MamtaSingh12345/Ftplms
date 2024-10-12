import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';

const WeatherPage = () => {
  const [date, setDate] = useState('');
  const [temperature, setTemperature] = useState('');
  const [rhValue, setRhValue] = useState('');
  const [precipitation, setPrecipitation] = useState('');
  const [cloudiness, setCloudiness] = useState('');

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

  const handleDateChange = (e) => {
    setDate(e.target.value);
    // Here you would typically fetch weather data based on the date
    // For demonstration purposes, let's just set some dummy data
    setTemperature('25°C');
    setRhValue('60%');
    setPrecipitation('0mm');
    setCloudiness('20%');
  };

  return (
    <Container style={containerStyle}>
      <Card style={cardStyle}>
        <Card.Title style={titleStyle}>Weather Information</Card.Title>
        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formDate">
                <Form.Label>Select Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={handleDateChange}
                  style={formControlStyle}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formTemperature">
                <Form.Label>Temperature</Form.Label>
                <Form.Control
                  type="text"
                  value={temperature}
                  readOnly
                  style={formControlStyle}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formRhValue">
                <Form.Label>Relative Humidity (RH)</Form.Label>
                <Form.Control
                  type="text"
                  value={rhValue}
                  readOnly
                  style={formControlStyle}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formPrecipitation">
                <Form.Label>Precipitation</Form.Label>
                <Form.Control
                  type="text"
                  value={precipitation}
                  readOnly
                  style={formControlStyle}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formCloudiness">
                <Form.Label>Cloudiness</Form.Label>
                <Form.Control
                  type="text"
                  value={cloudiness}
                  readOnly
                  style={formControlStyle}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="text-center">
            <Button variant="primary" type="button" onClick={() => handleDateChange()}>
              Fetch Weather Data
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default WeatherPage;
