import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';

const AgroAdvisoryPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    problem: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    problem: '',
  });

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

  const invalidFeedbackStyle = {
    color: '#dc3545',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    const { name, email, problem } = formData;
    let newErrors = {};

    // Validation
    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!problem) newErrors.problem = 'Problem description is required';

    // Simple email validation
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is not valid';
    }

    // Set errors and stop submission if validation fails
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors and submit data
    setErrors({});
    alert('Form submitted successfully!');
  };

  return (
    <Container style={containerStyle}>
      <Card style={cardStyle}>
        <Card.Title style={titleStyle}>Agro Advisory Form</Card.Title>
        <Form>
          <Form.Group controlId="formName" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              style={formControlStyle}
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            />
            {errors.name && <div style={invalidFeedbackStyle} className="invalid-feedback">{errors.name}</div>}
          </Form.Group>

          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={formControlStyle}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            />
            {errors.email && <div style={invalidFeedbackStyle} className="invalid-feedback">{errors.email}</div>}
          </Form.Group>

          <Form.Group controlId="formProblem" className="mb-3">
            <Form.Label>Describe Your Problem</Form.Label>
            <Form.Control
              as="textarea"
              name="problem"
              value={formData.problem}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your problem here"
              style={formControlStyle}
              className={`form-control ${errors.problem ? 'is-invalid' : ''}`}
            />
            {errors.problem && <div style={invalidFeedbackStyle} className="invalid-feedback">{errors.problem}</div>}
          </Form.Group>

          <div className="text-center">
            <Button variant="primary" type="button" onClick={handleSubmit}>Send</Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default AgroAdvisoryPage;
