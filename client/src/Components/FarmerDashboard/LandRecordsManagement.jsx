import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Table, Modal } from "react-bootstrap";

const LandRecordsManagement = () => {
  const [lands, setLands] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newLand, setNewLand] = useState({
    landId: "",
    tollah: "",
    village: "",
    panchayat: "",
    block: "",
    district: "",
    pinCode: "",
    sizeInAcres: "",
    sizeInBigha: "",
    waterSource: "",
    waterAvailability: "",
    distanceFromWaterSource: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false); // To track if we are editing

  const farmerID = localStorage.getItem("farmerID");

  // Auto-calculate Bigha based on Acres (1 Acre = 1.6 Bigha)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedLand = { ...newLand, [name]: value };

    if (name === "sizeInAcres") {
      updatedLand.sizeInBigha = (value * 1.6).toFixed(2);
    }
    if (name === "sizeInBigha") {
      updatedLand.sizeInAcres = (value / 1.6).toFixed(2);
    }

    setNewLand(updatedLand);
  };

  useEffect(() => {
    if (farmerID) {
      axios
        .get(`https://ftplms.onrender.com/register/land-details/${farmerID}`)
        .then((response) => {
          if (response.data && response.data.landDetails) {
            setLands(response.data.landDetails);
          } else {
            console.warn("No land details found.");
          }
        })
        .catch((error) => console.error("Error fetching land details:", error));
    }
  }, [farmerID]);

  const handleAddOrUpdateLand = async () => {
    try {
      const payload = {
        farmerID,
        landDetails: {
          landId: isEditing ? newLand.landId : Date.now().toString(), // Generate unique ID for new land or use existing for editing
          tollah: newLand.tollah,
          village: newLand.village,
          panchayat: newLand.panchayat,
          block: newLand.block,
          district: newLand.district,
          pinCode: newLand.pinCode,
          sizeInAcres: parseFloat(newLand.sizeInAcres),
          sizeInBigha: parseFloat(newLand.sizeInBigha),
          waterSource: newLand.waterSource,
          waterAvailability: newLand.waterAvailability,
          distanceFromWaterSource: parseFloat(newLand.distanceFromWaterSource),
          description: newLand.description,
        },
      };

      const response = await axios.post(
        isEditing
          ? `https://ftplms.onrender.com/register/land-details` // Update existing land
          : "https://ftplms.onrender.com/register/land-details", // Add new land
        payload
      );

      if (isEditing) {
        setLands((prevLands) =>
          prevLands.map((land) =>
            land.landId === newLand.landId ? { ...land, ...newLand } : land
          )
        );
      } else {
        setLands((prevLands) => [...prevLands, payload.landDetails]);
      }

      alert(isEditing ? "Land details updated successfully!" : "Land details added successfully!");
      resetForm();
      handleCloseModal();
    } catch (error) {
      console.error("Error adding/updating land record:", error);
      alert("Failed to add/update land details. Please try again.");
    }
  };

  const handleDeleteLand = async (landId) => {
    const farmerID = localStorage.getItem('farmerID'); // Retrieve farmerID from localStorage

    if (!farmerID || !landId) {
        alert('Farmer ID or Land ID is missing');
        return;
    }

    try {
        // Send DELETE request to the server with farmerID and landId
        const response = await axios.delete(
            'https://ftplms.onrender.com/register/land-details', 
            { data: { farmerID, landId } }
        );

        // If successful, filter out the deleted land from the local state
        setLands((prevLands) => prevLands.filter((land) => land.landId !== landId));

        alert('Land record deleted successfully!');
    } catch (error) {
        console.error('Error deleting land record:', error);
        alert('Failed to delete land record. Please try again.');
    }
};


  const handleEditLand = (land) => {
    setNewLand({ ...land });
    setIsEditing(true);
    handleShowModal();
  };

  const resetForm = () => {
    setNewLand({
      tollah: "",
      village: "",
      panchayat: "",
      block: "",
      district: "",
      pinCode: "",
      sizeInAcres: "",
      sizeInBigha: "",
      waterSource: "",
      waterAvailability: "",
      distanceFromWaterSource: "",
      description: "",
    });
    setIsEditing(false);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <Container>
      <h3 className="text-center mt-3">Land Records Management</h3>
      <div style={{ overflowX: "auto" }}>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Tollah</th>
              <th>Village</th>
              <th>Panchayat</th>
              <th>Block</th>
              <th>District</th>
              <th>Pin Code</th>
              <th>Size (Acres)</th>
              <th>Size (Bigha)</th>
              <th>Water Source</th>
              <th>Water Availability</th>
              <th>Distance from Water Source</th>
              <th>Description</th>
              <th>Actions</th> {/* Added actions column for editing and deleting */}
            </tr>
          </thead>
          <tbody>
            {lands.map((land, index) => (
              <tr key={land.landId}>
                <td>{index + 1}</td>
                <td>{land.tollah}</td>
                <td>{land.village}</td>
                <td>{land.panchayat}</td>
                <td>{land.block}</td>
                <td>{land.district}</td>
                <td>{land.pinCode}</td>
                <td>{land.sizeInAcres}</td>
                <td>{land.sizeInBigha}</td>
                <td>{land.waterSource}</td>
                <td>{land.waterAvailability}</td>
                <td>{land.distanceFromWaterSource}</td>
                <td>{land.description}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleEditLand(land)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteLand(land.landId)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="d-flex justify-content-center mt-3">
        <Button variant="primary" onClick={handleShowModal}>
          Add Land
        </Button>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Land Record" : "Add Land Record"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Address Tollah</Form.Label>
              <Form.Control
                type="text"
                name="tollah"
                value={newLand.tollah}
                onChange={handleInputChange}
                className="w-100"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address Village</Form.Label>
              <Form.Control
                type="text"
                name="village"
                value={newLand.village}
                onChange={handleInputChange}
                className="w-100"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Panchayat</Form.Label>
              <Form.Control
                type="text"
                name="panchayat"
                value={newLand.panchayat}
                onChange={handleInputChange}
                className="w-100"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Block</Form.Label>
              <Form.Control
                type="text"
                name="block"
                value={newLand.block}
                onChange={handleInputChange}
                className="w-100"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>District</Form.Label>
              <Form.Control
                type="text"
                name="district"
                value={newLand.district}
                onChange={handleInputChange}
                className="w-100"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pin Code</Form.Label>
              <Form.Control
                type="text"
                name="pinCode"
                value={newLand.pinCode}
                onChange={handleInputChange}
                className="w-100"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Land Size (Acres)</Form.Label>
              <Form.Control
                type="number"
                name="sizeInAcres"
                value={newLand.sizeInAcres}
                onChange={handleInputChange}
                className="w-100"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Land Size (Bigha)</Form.Label>
              <Form.Control
                type="number"
                name="sizeInBigha"
                value={newLand.sizeInBigha}
                onChange={handleInputChange}
                className="w-100"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Water Source</Form.Label>
              <Form.Control
                type="text"
                name="waterSource"
                value={newLand.waterSource}
                onChange={handleInputChange}
                className="w-100"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Water Availability</Form.Label>
              <Form.Control
                type="text"
                name="waterAvailability"
                value={newLand.waterAvailability}
                onChange={handleInputChange}
                className="w-100"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Distance from Water Source (in meters)</Form.Label>
              <Form.Control
                type="number"
                name="distanceFromWaterSource"
                value={newLand.distanceFromWaterSource}
                onChange={handleInputChange}
                className="w-100"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={newLand.description}
                onChange={handleInputChange}
                className="w-100"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddOrUpdateLand}>
            {isEditing ? "Update Land" : "Add Land"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LandRecordsManagement;
