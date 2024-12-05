import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";

const SocialAndFamilyDetails = () => {
  const [socialInfo, setSocialInfo] = useState({
    familyMembers: "",
    familyIncome: "",
    primaryOccupation: "",
    secondaryOccupation: "",
  });

  const [existingSocialInfo, setExistingSocialInfo] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch existing social info for the farmer
  useEffect(() => {
    const fetchSocialInfo = async () => {
      try {
        const farmerID = localStorage.getItem("farmerID");
        if (!farmerID) {
          setError("Farmer ID is missing in local storage.");
          return;
        }

        const response = await axios.get(
          `http://localhost:4000/register/get-social-info/${farmerID}`
        );

        if (response.data.socialInformation) {
          setExistingSocialInfo(response.data.socialInformation);
          setSocialInfo(response.data.socialInformation); // Pre-fill form fields
          setError("");
        }
      } catch (err) {
        console.error(err);
        if (err.response?.status === 404) {
          setError("No social information found for this Farmer ID.");
        } else {
          setError("Failed to fetch social info. Please try again.");
        }
        setExistingSocialInfo(null);
      }
    };

    fetchSocialInfo();
  }, []);

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSocialInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const farmerID = localStorage.getItem("farmerID");
      if (!farmerID) {
        setError("Farmer ID is missing in local storage.");
        return;
      }

      const payload = { ...socialInfo, farmerID };
      const response = await axios.post(
        "http://localhost:4000/register/update-social-info",
        payload
      );

      setResponseMessage(response.data.message);
      setError("");
      setExistingSocialInfo(payload); // Update after saving
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Something went wrong");
      setResponseMessage("");
    }
  };

  return (
    <Container>
      <h3>Social and Family Details</h3>

      {/* Show Existing Social Info */}
      {existingSocialInfo ? (
        <div className="mb-4">
          <h5>Existing Social Information:</h5>
          <p>
            <strong>Family Members:</strong> {existingSocialInfo.familyMembers || "Not provided"}
          </p>
          <p>
            <strong>Family Income:</strong> {existingSocialInfo.familyIncome || "Not provided"}
          </p>
          <p>
            <strong>Primary Occupation:</strong> {existingSocialInfo.primaryOccupation || "Not provided"}
          </p>
          <p>
            <strong>Secondary Occupation:</strong> {existingSocialInfo.secondaryOccupation || "Not provided"}
          </p>
        </div>
      ) : (
        error && <Alert variant="danger">{error}</Alert>
      )}

      {/* Form to Update Social Info */}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Family Members</Form.Label>
              <Form.Control
                type="text"
                name="familyMembers"
                value={socialInfo.familyMembers}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Family Income</Form.Label>
              <Form.Control
                type="text"
                name="familyIncome"
                value={socialInfo.familyIncome}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Primary Occupation</Form.Label>
              <Form.Control
                type="text"
                name="primaryOccupation"
                value={socialInfo.primaryOccupation}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Secondary Occupation</Form.Label>
              <Form.Control
                type="text"
                name="secondaryOccupation"
                value={socialInfo.secondaryOccupation}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit" className="mt-3">
          Save Changes
        </Button>
      </Form>

      {responseMessage && <p className="text-success mt-3">{responseMessage}</p>}
      {error && <p className="text-danger mt-3">{error}</p>}
    </Container>
  );
};

export default SocialAndFamilyDetails;
