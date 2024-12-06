import React, { useState } from 'react';
import { Card, Button, Container, Row, Col, Navbar, Nav, NavDropdown, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const FarmerDashboard = () => {
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/40");

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const containerStyle = {
    backgroundColor: '#f7f7f7',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  };

  const cardImageStyle = {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '50%',
    margin: '0 auto 15px',
  };

  const cardTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand as={Link} to="/">Farmer's Portal</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/farmer-dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            <Nav.Link href="/social-details">Social and Family Details</Nav.Link>
            <Nav.Link href="/land-records">Land Records</Nav.Link>

            <NavDropdown title="Menu" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/settings">Settings</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/help">Help</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/">Logout</Nav.Link>
          </Nav>
          <div style={{ position: 'relative' }}>
            <Image
              src={profileImage}
              roundedCircle
              style={{ width: '40px', height: '40px', marginLeft: '15px' }}
              alt="Farmer Profile"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '40px',
                height: '40px',
                opacity: '0',
                cursor: 'pointer',
              }}
            />
          </div>
        </Navbar.Collapse>
      </Navbar>

      <Container className="mt-5" style={containerStyle}>
        <h2 className="text-center mb-4">Farmer Dashboard</h2>
        <Row className="g-4">
          {/* Task and Information Cards */}
          <Col xs={12} md={6} lg={4}>
            <Card>
              <Card.Body>
                <Card.Title style={cardTitleStyle}>Assigned Tasks</Card.Title>
                <Card.Text className="text-center">View planting schedules and updates from Vriksha Sevak.</Card.Text>
                <Link to="/assigned-tasks"><Button variant="primary" block>View Tasks</Button></Link>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <Card>
              <Card.Body>
                <Card.Title style={cardTitleStyle}>Record Planting Activities</Card.Title>
                <Card.Text className="text-center">Log tree planting, maintenance, and growth metrics.</Card.Text>
                <Link to="/planting-activities"><Button variant="success" block>Record Activity</Button></Link>
              </Card.Body>
            </Card>
          </Col>


          <Col xs={12} md={6} lg={4}>
            <Card>
              <Card.Body>
                <Card.Title style={cardTitleStyle}>Weather Information</Card.Title>
                <Card.Text className="text-center">Check current weather and 3-5 day forecast.</Card.Text>
                <Link to="/weather"><Button variant="warning" block>Check Weather</Button></Link>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <Card>
              <Card.Body>
                <Card.Title style={cardTitleStyle}>Sync Data</Card.Title>
                <Card.Text className="text-center">Sync offline data with central database when online.</Card.Text>
                <Button variant="dark" block>Sync Now</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <Card>
              <Card.Body>
                <Card.Title style={cardTitleStyle}>Sell Carbon Credits</Card.Title>
                <Card.Text className="text-center">View carbon credits earned and track contributions.</Card.Text>
                <Link to="/carbon-credits"><Button variant="secondary" block>View Credits</Button></Link>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <Card>
              <Card.Body>
                <Card.Title style={cardTitleStyle}>Agro Advisory</Card.Title>
                <Card.Text className="text-center">Send your problem and ask to the Agricuture experts.</Card.Text>
                <Link to="/agro-advisory"><Button variant="primary" block>Get help</Button></Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        

        
      </Container>
    </>
  );
};

export default FarmerDashboard;
