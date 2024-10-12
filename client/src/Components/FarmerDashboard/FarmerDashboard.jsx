import React, { useState } from 'react';
import { Card, Button, Container, Row, Col, Navbar, Nav, NavDropdown, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Use React Router for navigation

const FarmerDashboard = () => {
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/40"); // Default profile image

  // Function to handle profile image change
  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  // Inline styles
  const containerStyle = {
    backgroundColor: '#f7f7f7',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  };

  const cardImageStyle = {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    marginBottom: '15px',
  };

  const cardTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '10px',
    textAlign: 'center',
    color: '#333',
  };

  const cardTextStyle = {
    fontSize: '14px',
    marginBottom: '10px',
    textAlign: 'center',
    color: '#666',
  };

  const cardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #eaeaea',
    borderRadius: '8px',
    transition: 'transform 0.2s ease-in-out',
    marginBottom: '20px',
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand as={Link} to="/">Farmer's Portal</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            <NavDropdown title="Menu" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/planting-application">Planting Application</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/weather">Weather Info</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/plant-protection">Plant Protection</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/agro-advisory">Agro Advisory</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/make-a-call">Make a Call</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/settings">Settings</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/help">Help</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
          </Nav>
          {/* Profile picture in navbar with upload feature */}
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

      {/* Farmer Dashboard Content */}
      <Container className="mt-5" style={containerStyle}>
        <h2 className="text-center mb-4">Welcome to the Farmer's Portal</h2>
        <Row className="g-4">
          {/* First Row of Cards */}
          <Col xs={12} md={6} lg={4}>
            <Card style={cardStyle}>
              <Card.Img
                variant="top"
                src="https://static.vecteezy.com/system/resources/previews/028/720/516/non_2x/people-planting-trees-ai-generative-free-png.png"
                alt="Planting Application"
                style={cardImageStyle}
              />
              <Card.Body>
                <Card.Title style={cardTitleStyle}>Application for Planting</Card.Title>
                <Card.Text style={cardTextStyle}>
                  Apply for the planting season and manage your crops effectively.
                </Card.Text>
                <Link to="/planting-application">
                  <Button variant="success" block>Apply Now</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <Card style={cardStyle}>
              <Card.Img
                variant="top"
                src="https://www.transparentpng.com/thumb/weather-report/android-weather-icons-png-12.png"
                alt="Weather"
                style={cardImageStyle}
              />
              <Card.Body>
                <Card.Title style={cardTitleStyle}>Weather Information</Card.Title>
                <Card.Text style={cardTextStyle}>
                  Get real-time weather updates for your farm location.
                </Card.Text>
                <Link to="/weather">
                  <Button variant="info" block>Check Weather</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <Card style={cardStyle}>
              <Card.Img
                variant="top"
                src="https://cdn3.iconfinder.com/data/icons/agriculture-farming-and-gardening-vol-6/90/Save_Plantsc7-1024.png"
                alt="Plant Protection"
                style={cardImageStyle}
              />
              <Card.Body>
                <Card.Title style={cardTitleStyle}>Plant Protection</Card.Title>
                <Card.Text style={cardTextStyle}>
                  Learn about plant protection techniques to safeguard your crops.
                </Card.Text>
                <Link to="/plant-protection">
                  <Button variant="warning" block>View Protection</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="g-4 mt-4">
          {/* Second Row of Cards */}
          <Col xs={12} md={6} lg={4}>
            <Card style={cardStyle}>
              <Card.Img
                variant="top"
                src="https://icon-library.com/images/agriculture-icon-png/agriculture-icon-png-25.jpg"
                alt="Agro Advisory"
                style={cardImageStyle}
              />
              <Card.Body>
                <Card.Title style={cardTitleStyle}>Agro Advisory</Card.Title>
                <Card.Text style={cardTextStyle}>
                  Get expert advice on agricultural practices and crop management.
                </Card.Text>
                <Link to="/agro-advisory">
                  <Button variant="primary" block>View Advisory</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <Card style={cardStyle}>
              <Card.Img
                variant="top"
                src="https://vectorified.com/images/call-or-text-icon-11.png"
                alt="Make a Call"
                style={cardImageStyle}
              />
              <Card.Body>
                <Card.Title style={cardTitleStyle}>Make a Call</Card.Title>
                <Card.Text style={cardTextStyle}>
                  Contact our helpline for immediate support or questions.
                </Card.Text>
                <Link to="/make-a-call">
                  <Button variant="danger" block>Contact Now</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Media queries for mobile responsiveness */}
      <style>{`
        @media (max-width: 768px) {
          .card-img-top {
            height: 120px;
          }
          .card-title {
            font-size: 16px;
          }
          .card-text {
            font-size: 12px;
          }
          .btn {
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );
};

export default FarmerDashboard;
