import React from 'react';
import { Container, Row, Col, Card, Button, ProgressBar } from 'react-bootstrap';

const CarbonCreditsPage = () => {
  return (
    <Container className="my-4">
      <h2>Carbon Credits Dashboard</h2>
      <p>Track your contributions to carbon offset, geotag your trees, and view your potential earnings from carbon credits.</p>

      <Row className="mb-4">
        {/* Carbon Footprint Tracker */}
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Carbon Footprint Tracker</Card.Title>
              <p>Monitor the environmental impact of your planted trees through carbon offset tracking.</p>
              <ProgressBar now={60} label={`${60}%`} variant="success" className="mb-2" />
              <p>Current Carbon Offset: <strong>150 kg CO₂</strong></p>
              <p>Target Carbon Offset: <strong>250 kg CO₂</strong></p>
            </Card.Body>
          </Card>
        </Col>

        {/* Geotagging Tool */}
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Geotagging Tool</Card.Title>
              <p>Capture geotagged data for each tree or geofence an entire cluster.</p>
              <Button variant="primary">Capture Geotag for Tree</Button>
              <Button variant="secondary" className="ms-2">Geofence Cluster</Button>
              <p className="mt-3">Geotag Status: <strong>Active</strong></p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Carbon Credit Sales Status */}
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>Carbon Credit Sales Status</Card.Title>
              <p>View your earnings from carbon credits. Track contributions as facilitated by the Admin or Manager.</p>
              <p>Total Carbon Credits Earned: <strong>50 Credits</strong></p>
              <p>Potential Earnings: <strong>$500</strong></p>
              <Button variant="primary">View Sales History</Button>
              <Button variant="success" className="ms-2">Sell Carbon Credits</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CarbonCreditsPage;
