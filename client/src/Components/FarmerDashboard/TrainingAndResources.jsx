import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const TrainingAndResources = () => {
  // Sample data for resources
  const resources = [
    {
      id: 1,
      title: "Tree Planting Guide",
      description: "Learn the best practices for tree planting and maintenance.",
      fileUrl: "/downloads/tree_planting_guide.pdf",
    },
    {
      id: 2,
      title: "Soil Management Techniques",
      description: "Improve soil health with these effective management techniques.",
      fileUrl: "/downloads/soil_management_techniques.pdf",
    },
    {
      id: 3,
      title: "Water Conservation in Agriculture",
      description: "Tips and strategies for conserving water on your farm.",
      fileUrl: "/downloads/water_conservation_guide.pdf",
    },
    {
      id: 4,
      title: "Organic Farming Practices",
      description: "A guide to adopting organic farming methods for better yields.",
      fileUrl: "/downloads/organic_farming_practices.pdf",
    },
  ];

  return (
    <Container className="my-4">
      <h3 className="mb-3">Training and Resources</h3>
      <p>Download or view training materials and guides to improve your farming practices.</p>
      <Row>
        {resources.map((resource) => (
          <Col md={6} lg={4} className="mb-4" key={resource.id}>
            <Card>
              <Card.Body>
                <Card.Title>{resource.title}</Card.Title>
                <Card.Text>{resource.description}</Card.Text>
                <Button variant="primary" href={resource.fileUrl} target="_blank" download>
                  Download
                </Button>
                <Button variant="secondary" href={resource.fileUrl} target="_blank" className="ms-2">
                  View
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default TrainingAndResources;
