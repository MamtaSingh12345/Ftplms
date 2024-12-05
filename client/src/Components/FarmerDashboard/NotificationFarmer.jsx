import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

const NotificationPage = ({ farmerID }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state for better UX
  const [error, setError] = useState(null); // Add error state

  // Fetch notifications for the farmer
  useEffect(() => {
    console.log('Farmer ID:', farmerID); // Add this to check
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/register/notification/${farmerID}`);
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('There was an error fetching notifications.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchNotifications();
  }, [farmerID]);
  

  return (
    <Container className="mt-4">
      <Row>
        <Col md={12}>
          <h4>Notifications</h4>
          
          {/* Loading state */}
          {loading && <Alert variant="info">Loading notifications...</Alert>}
          
          {/* Error state */}
          {error && <Alert variant="danger">{error}</Alert>}
          
          {/* Notifications display */}
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <Card key={index} className="mb-3">
                <Card.Body>
                  <Card.Title>Status: {notification.status}</Card.Title>
                  <Card.Text>{notification.message}</Card.Text>
                  <Card.Text><small className="text-muted">Date: {new Date(notification.date).toLocaleDateString()}</small></Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : (
            <Alert variant="info">No notifications yet.</Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default NotificationPage;
