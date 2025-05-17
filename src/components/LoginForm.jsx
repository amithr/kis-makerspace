import { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from '../utilities/Supabase';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    // Simple validation (in real life, check against server)
    if (!formData.email || !formData.password) {
      setError("Both email and password are required.");
      return;
    }



    try {

        // First fetch the profile to deal with the condition where the user may have been successfully created, but the profile was not (for whatever reason)
        // I couldn't find a better way to deal with this, because there was no way to interrupt the signInWithPassword method.
        const { data: profile, profileError } = await supabase
          .from("profiles")
          .select("email_address")
          .eq("email_address", formData.email)
          .maybeSingle();

        if (profileError || !profile) {
          setError("Failed to fetch profile - contact Mr. Amith.");
          return;
        }

        // If there's no issue with the profile, then go ahead and sign in.

        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      
        if (error) {
          console.error("Login error:", error.message);
          setError("Login unsuccessful. Please check your email and password.");
        } else {
          setSuccess("Login successful! Redirecting to dashboard...");
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred. Please try again later.");
      }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col className="px-3">
          <h2 className="mb-4">Login Form</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="loginFormEmail">
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

            <Form.Group className="mb-3" controlId="loginFormPassword">
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

            <Button variant="danger" type="submit">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginForm;