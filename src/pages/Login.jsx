import { useState } from 'react';
import RegistrationForm from '../components/RegistrationForm';
import LoginForm from '../components/LoginForm';
import LoginBar from '../components/LoginBar';
import { supabase } from '../utilities/Supabase';
import { Container, Row, Col, Stack } from 'react-bootstrap';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) console.error('Sign Up error:', error.message);
  }

  return (
    <>
      <Container fluid>
        <Row id="nav-bar" className = "mb-4 mt-3">
            <Col className="mx-3"><LoginBar /></Col>
        </Row>
        <Row id="workload">
          <Col className="mx-3">
            <Stack direction="vertical" gap={2}>
              <LoginForm />
            </Stack>
          </Col>
          <Col className="mx-3">
            <Stack direction="vertical" gap={2}>
              <RegistrationForm />
            </Stack>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Login;