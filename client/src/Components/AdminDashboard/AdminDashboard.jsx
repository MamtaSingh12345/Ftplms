import React, { useState } from 'react';
import { Card, Button, Container, Row, Col, Navbar, Nav, NavDropdown, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
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
    width: '80px', // Reduced width
    height: '80px', // Reduced height
    objectFit: 'cover',
    borderRadius: '50%', // Circular shape
    margin: '0 auto 15px', // Centering and spacing
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
    padding: '10px', // Added padding for a better look
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
              <NavDropdown.Item as={Link} to="/farmer-management">Farmer Management</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/resource-management">Resource Management</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/notifications">Notifications & Announcements</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/support">Support & Help</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/user-management">User Management</NavDropdown.Item>
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
        <h2 className="text-center mb-4">Welcome to the Admin's Portal</h2>
        <Row className="g-4">
          {/* First Row of Cards */}
          <Col xs={12} md={6} lg={4}>
            <Card style={cardStyle}>
              <Card.Img
                variant="top"
                src="https://icon-library.com/images/farm-icon/farm-icon-15.jpg"
                alt="Farmer Management"
                style={cardImageStyle}
              />
              <Card.Body>
                <Card.Title style={cardTitleStyle}>Farmer Management</Card.Title>
                <Card.Text style={cardTextStyle}>
                  Manage all farmer-related information and data efficiently.
                </Card.Text>
                <Link to="/farmer-management">
                  <Button variant="success" block>Manage Farmers</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <Card style={cardStyle}>
              <Card.Img
                variant="top"
                src="https://static.vecteezy.com/system/resources/previews/007/132/336/original/an-icon-of-resource-management-in-isometric-design-vector.jpg"
                alt="Resource Management"
                style={cardImageStyle}
              />
              <Card.Body>
                <Card.Title style={cardTitleStyle}>Resource Management</Card.Title>
                <Card.Text style={cardTextStyle}>
                  Track and allocate agricultural resources effectively.
                </Card.Text>
                <Link to="/resource-management">
                  <Button variant="info" block>Manage Resources</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <Card style={cardStyle}>
              <Card.Img
                variant="top"
                src="https://icon-library.com/images/notification-icon-png/notification-icon-png-7.jpg"
                alt="Notifications"
                style={cardImageStyle}
              />
              <Card.Body>
                <Card.Title style={cardTitleStyle}>Notifications & Requests</Card.Title>
                <Card.Text style={cardTextStyle}>
                  Stay updated with the latest news and alerts.
                </Card.Text>
                <Link to="/notifications">
                  <Button variant="warning" block>View Notifications</Button>
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
                src="https://icon-library.com/images/support-icon-png/support-icon-png-12.jpg"
                alt="Support"
                style={cardImageStyle}
              />
              <Card.Body>
                <Card.Title style={cardTitleStyle}>Support & Help</Card.Title>
                <Card.Text style={cardTextStyle}>
                  Get assistance with any issues or queries.
                </Card.Text>
                <Link to="/support">
                  <Button variant="primary" block>Get Support</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <Card style={cardStyle}>
              <Card.Img
                variant="top"
                src="https://static.vecteezy.com/system/resources/previews/000/380/027/original/user-management-vector-icon.jpg"
                alt="User Management"
                style={cardImageStyle}
              />
              <Card.Body>
                <Card.Title style={cardTitleStyle}>User Management</Card.Title>
                <Card.Text style={cardTextStyle}>
                  Manage users and their access roles efficiently.
                </Card.Text>
                <Link to="/user-management">
                  <Button variant="danger" block>Manage Users</Button>
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
            height: 80px; /* Adjusted size for smaller screens */
            width: 80px;
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

export default AdminDashboard;
