import { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from '../utilities/Supabase';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  
    const nameRegex = /^[^\d]*$/;
    const emailRegex = /^[^@\s]+@kyiv\.qsi\.org$/;
  
    if (!nameRegex.test(formData.name)) {
      setError("Name must not contain numbers.");
      return;
    }
  
    if (!emailRegex.test(formData.email)) {
      setError("Email must be a kyiv.qsi.org email address.");
      return;
    }
  
    if (parseInt(formData.age, 10) >= 100) {
      setError("Age must be less than 100.");
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    try {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });
      
        if (error) {
          console.error(error);
          setError("Failed to register. Please try again.");
          return;
        }
      
        const user = data?.user;
        if (!user) {
          setError("User not returned from signup.");
          return;
        }
      
        // Insert into another table (e.g., 'profiles') using the user's ID
        const { error: insertError } = await supabase.from("profiles").insert([
          {
            id: user.id, // Use this as the primary or foreign key
            name: formData.name,
            email_address: formData.email,
            age: formData.age,
            // Add any other fields from formData you want
          },
        ]);
      
        if (insertError) {
          console.error(insertError);
          setError("Failed to create user profile. Please try again.");
          return;
        }
      
        console.log("Form Submitted:", data);
        setSuccess("Registration successful! Redirecting to dashboard...");
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
        
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred.");
      }
  };  

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="mb-4">Registration Form</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAge">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter your age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="0"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm your password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default RegistrationForm;