import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';

const FarmerDetailsModal = ({ show, handleClose, farmerData, refreshData }) => {
  const [status, setStatus] = useState(farmerData?.status || 'Pending');
  const [message, setMessage] = useState('');

  // Handle status update
  const handleStatusUpdate = async (requestID) => {
    if (!requestID) {
      setMessage('Request ID is missing.');
      return;
    }
  
    console.log('Updating status for Request ID:', requestID);
    
    try {
      const response = await axios.put(
        `http://localhost:4000/register/planting-reques/${farmerData.requestID}`, // Use requestID in URL
        { status },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      console.log('API Response:', response.data);  // Log API response for debugging
  
      if (response.data.success) {
        setMessage('Status updated successfully!');
        refreshData(); // Call a function to refresh the list of requests
        setTimeout(() => {
          setMessage('');
          handleClose(); // Close modal after success
        }, 1500);
      } else {
        setMessage('Failed to update status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage('Error updating status. Please try again later.');
    }
  };
  
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Farmer Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && <Alert variant={message.includes('success') ? 'success' : 'danger'}>{message}</Alert>}
        {farmerData && (
          <>
            <Row>
              <Col md={6}>
                <h5>Farmer Information</h5>
                <p><strong>Request ID:</strong> {farmerData.requestID}</p>
                <p><strong>Farmer Name:</strong> {farmerData.farmerName}</p>
                <p><strong>Date of Birth:</strong> {new Date(farmerData.dateOfBirth).toLocaleDateString()}</p>
                <p><strong>Contact Number:</strong> {farmerData.contactNumber}</p>
                <p><strong>Aadhar ID:</strong> {farmerData.aadharID || 'N/A'}</p>
                <p><strong>Voter ID:</strong> {farmerData.voterID || 'N/A'}</p>
                <p><strong>Village:</strong> {farmerData.address.village}</p>
                <p><strong>Gram Panchayat:</strong> {farmerData.address.gramPanchayat}</p>
                <p><strong>Block:</strong> {farmerData.address.block}</p>
                <p><strong>District:</strong> {farmerData.address.district}</p>
                <p><strong>State:</strong> {farmerData.address.state}</p>
                <p><strong>Country:</strong> {farmerData.address.country}</p>
                <p><strong>Pin:</strong> {farmerData.address.pin}</p>
              </Col>
              <Col md={6}>
                <h5>Planting Request Information</h5>
                <p><strong>Planting Type:</strong> {farmerData.plantingType}</p>
                <p><strong>Date Requested:</strong> {new Date(farmerData.dateRequested).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {farmerData.status}</p>
                <h5>Update Status</h5>
                <Form.Control
                  as="select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </Form.Control>
                <Button variant="primary" className="mt-3" onClick={handleStatusUpdate}>
                  Update Status
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FarmerDetailsModal;
