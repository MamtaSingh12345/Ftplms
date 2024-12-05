import React, { useEffect, useState } from 'react';
import { Table, Card, Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FarmerDetailsModal from './FarmerDetailModal'; // Ensure this is correctly imported

const AdminPlantingRequests = () => {
  const [plantingRequests, setPlantingRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false); // Added modal state
  const [selectedFarmer, setSelectedFarmer] = useState(null); // Added state for selected farmer

  // Function to open the modal and show farmer details
  const handleShowModal = (farmerData) => {
    setSelectedFarmer(farmerData);
    setShowModal(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFarmer(null);
  };

  // Fetching planting requests from the API
  useEffect(() => {
    const fetchPlantingRequests = async () => {
      try {
        const response = await axios.get('http://localhost:4000/register/planting-request');
        console.log('Planting Requests API Response:', response.data); // Log response to inspect the structure

        if (response.data && response.data.success) {
          setPlantingRequests(response.data.plantingRequests || []); // Safely set planting requests
        } else {
          setPlantingRequests([]); // Handle case where response is unsuccessful
        }
      } catch (error) {
        console.error('Error fetching planting requests:', error);
        setPlantingRequests([]); // Handle errors safely
      }
    };

    fetchPlantingRequests();
  }, []);

  // Fetching notifications from the API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:4000/register/notification');
        console.log('Notifications API Response:', response.data); // Log response to inspect the structure

        if (response.data && response.data.success) {
          setNotifications(response.data.notifications || []); // Safely set notifications
        } else {
          setNotifications([]); // Handle case where response is unsuccessful
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]); // Handle errors safely
      }
    };

    fetchNotifications();
  }, []);

  // Combine planting requests with their respective notification dates
  const getNotificationDate = (farmerID) => {
    const notification = notifications.find((notif) => notif.farmerID === farmerID);
    return notification ? new Date(notification.date).toLocaleDateString() : 'Date Not Available';
  };

  // Inline styles for container and card
  const containerStyle = {
    backgroundColor: '#f7f7f7',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  };

  const cardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #eaeaea',
    borderRadius: '8px',
    transition: 'transform 0.2s ease-in-out',
    padding: '20px',
    marginBottom: '20px',
  };

  const tableStyle = {
    textAlign: 'center',
    fontSize: '16px',
  };

  return (
    <Container style={containerStyle}>
      <h2 className="text-center mb-4">Planting Application Requests</h2>

      {/* Notifications Section */}
      <Row>
        <Col md={12}>
          <Card style={cardStyle}>
            <Card.Header className="text-center">
              <h4>
                Notifications <Badge variant="info">{notifications.length}</Badge>
              </h4>
            </Card.Header>
            <Card.Body>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div key={notification._id} className="mb-3">
                    <Card.Text>
                      <strong>{new Date(notification.date).toLocaleString()}</strong>: {notification.message}
                      <Badge
                        variant={notification.type === 'request' ? 'warning' : 'primary'}
                        className="ml-2"
                      >
                        {notification.type === 'request' ? 'Request' : 'Info'}
                      </Badge>
                    </Card.Text>
                  </div>
                ))
              ) : (
                <div>No notifications available.</div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Planting Requests Table */}
      <Row className="mt-5">
        <Col md={12}>
          <Card style={cardStyle}>
            <Card.Header className="text-center">
              <h4>Pending Planting Requests</h4>
            </Card.Header>
            <Card.Body>
              {Array.isArray(plantingRequests) && plantingRequests.length > 0 ? (
                <Table responsive bordered hover style={tableStyle}>
                  <thead className="thead-dark">
                    <tr>
                      <th>Farmer ID</th>
                      <th>Farmer Name</th>
                      <th>Village</th>
                      <th>Date Requested</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plantingRequests.map((request) => (
                      <tr key={request.farmerID}>
                        <td>{request.farmerID}</td>
                        <td>{request.farmerName}</td>
                        <td>{request.address.village || 'N/A'}</td> {/* Fallback to 'N/A' if village is missing */}
                        <td>{getNotificationDate(request.Date)}</td> {/* Use notification date */}
                        <td>
                          <Badge variant={request.status === 'Pending' ? 'warning' : 'success'}>
                            {request.status}
                          </Badge>
                        </td>
                        <td>
                          <Button variant="info" size="sm" onClick={() => handleShowModal(request)}>
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div>No planting requests available.</div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Farmer Details Modal */}
      {selectedFarmer && (
        <FarmerDetailsModal
          show={showModal}
          handleClose={handleCloseModal}
          farmerData={selectedFarmer}
          refreshData={() => setPlantingRequests([...plantingRequests])} // Assuming refreshData updates the requests list
        />
      )}
    </Container>
  );
};

export default AdminPlantingRequests;
