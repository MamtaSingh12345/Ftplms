import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';

const ViewProtectionPage = () => {
  const [treeType, setTreeType] = useState('');
  const [numberOfTrees, setNumberOfTrees] = useState('');
  const [ageOfTrees, setAgeOfTrees] = useState('');

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
              <Button variant="success" className="me-2" onClick={() => alert('Organic Fertilizer Selected')}>
                Select Organic Fertilizer
              </Button>
              <Button variant="warning" onClick={() => alert('Pesticides Selected')}>
                Select Pesticides
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Container>
  );
};

export default ViewProtectionPage;
