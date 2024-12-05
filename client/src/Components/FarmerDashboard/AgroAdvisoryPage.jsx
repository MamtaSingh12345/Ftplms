import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { FaMicrophone } from 'react-icons/fa';
import axios from 'axios';

const AgroAdvisoryPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',  // Added phone number field
    problem: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',  // Added phone number error
    problem: '',
  });

  const [isListening, setIsListening] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const { name, email, phone, problem } = formData;
    let newErrors = {};
  
    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!phone) newErrors.phone = 'Phone number is required';
    if (!problem) newErrors.problem = 'Problem description is required';
  
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is not valid';
    }
  
    if (phone && !/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Phone number is not valid';
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    setErrors({});
    try {
      const response = await axios.post('http://localhost:4000/register/send-advisory', {
        name,
        email,
        phone,   // Add phone to the email body content
        problem
      }); 
      if (response.status === 200) {
        alert('Form submitted and email sent successfully!');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email.');
    }
  };
  

  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFormData((prevData) => ({
        ...prevData,
        problem: prevData.problem + ' ' + transcript,
      }));
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <Container style={{ marginTop: '3rem' }}>
      <Card style={{ padding: '2rem', borderRadius: '0.5rem', backgroundColor: '#f9f9f9', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Card.Title style={{ textAlign: 'center', color: '#007bff', marginBottom: '1.5rem' }}>Agro Advisory Form</Card.Title>
        <Form>
          <Form.Group controlId="formName" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            />
            {errors.name && <div style={{ color: '#dc3545' }} className="invalid-feedback">{errors.name}</div>}
          </Form.Group>

          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            />
            {errors.email && <div style={{ color: '#dc3545' }} className="invalid-feedback">{errors.email}</div>}
          </Form.Group>

          <Form.Group controlId="formPhone" className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
            />
            {errors.phone && <div style={{ color: '#dc3545' }} className="invalid-feedback">{errors.phone}</div>}
          </Form.Group>

          <Form.Group controlId="formProblem" className="mb-3">
            <Form.Label>Describe Your Problem</Form.Label>
            <div style={{ position: 'relative' }}>
              <Form.Control
                as="textarea"
                name="problem"
                value={formData.problem}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your problem here"
                className={`form-control ${errors.problem ? 'is-invalid' : ''}`}
              />
              <FaMicrophone
                onClick={handleMicClick}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '10px',
                  cursor: 'pointer',
                  color: isListening ? '#007bff' : '#6c757d',
                }}
                size={20}
                title="Click to speak"
              />
            </div>
            {errors.problem && <div style={{ color: '#dc3545' }} className="invalid-feedback">{errors.problem}</div>}
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
