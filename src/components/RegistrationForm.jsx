import { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from '../utilities/Supabase';
import confetti from "canvas-confetti";

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
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    setError("");
    setSuccess("");
  
    const nameRegex = /^[^\d]*$/;
    const emailRegex = /^[^@\s]+@kyiv\.qsi\.org$/;
  
    if (!nameRegex.test(formData.name)) {
      setError("Name must not contain numbers.");
      return;
    }
  
    // if (!emailRegex.test(formData.email)) {
    //   setError("Email must be a kyiv.qsi.org email address.");
    //   return;
    // }
  
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

        // If user is added successfully, but profile is not, user will still remain inactive
        if (insertError) {
          console.error(insertError);
          setLoading(false);
          setError("Failed to create user profile. Please try again.");
          return;
        } else {
          setLoading(false);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
          setSuccess("Registration successful!");
          navigate('/dashboard')
        }
        
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred.");
      } finally {
        // Send the user straight to the dashboard after registering.
      }
  };  

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col className="px-3">
          <h2 className="mb-4">Registration Form</h2>
  
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
  
          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
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
  
              <Button variant="danger" type="submit">
                Submit
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default RegistrationForm;