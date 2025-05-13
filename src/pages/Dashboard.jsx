import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavBar from '../components/NavBar';
import { Stack } from 'react-bootstrap';
import RequestList from '../components/RequestList';
import NewRequestForm from '../components/NewRequestForm';
import { getCurrentUser } from '../utilities/Supabase';
import { useState, useEffect } from 'react';
import LoginBar from '../components/LoginBar';



function Dashboard() {
  const [userId, setUserId] = useState("");
  useEffect(() => {
    async function getCurrentUserId() {
      const user = await getCurrentUser();
      setUserId(user.id);
    }
    getCurrentUserId();
  }, []);

  return (
    <>
      <Container fluid>
        <Row id="nav-bar" className = "mb-4 mt-3">
          <Col className="mx-3"><LoginBar /></Col>
        </Row>
        <Row id="workload">
          <Col xs={12} md={6} lg={6} className="mb-3 px-3">
            <Stack direction="vertical" gap={3}>
              <h3>Current Requests</h3>
              <RequestList criteria={{ userId: userId, shouldBeFiltered: true}}/>
            </Stack>
          </Col>
          <Col xs={12} md={6} lg={6} className="mb-3 px-3">
            <Stack direction="vertical" gap={3}>
              <h3>Submit a Request</h3>
              <NewRequestForm />
            </Stack>      
          </Col>
        </Row>
    </Container>
    </>
  )
}

export default Dashboard;