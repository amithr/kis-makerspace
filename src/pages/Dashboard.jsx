import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Stack } from 'react-bootstrap';
import RequestList from '../components/RequestList';
import NewRequestForm from '../components/NewRequestForm';
import { getCurrentUser } from '../utilities/Supabase';
import { useState, useEffect } from 'react';
import LoginBar from '../components/LoginBar';



function Dashboard() {
  const [userId, setUserId] = useState("");
  // Used to update request list when new request is submitted via registration form
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  useEffect(() => {
    async function getCurrentUserId() {
      const user = await getCurrentUser();
      setUserId(user.id);
    }
    getCurrentUserId();
  }, []);

  const handleFormSubmit = () => {
    // Toggle to trigger sibling update
    setTriggerUpdate(prev => !prev);
  };

  return (
    <>
      <Container fluid>
        <Row id="nav-bar" className = "mb-4 mt-3">
          <Col className="mx-3"><LoginBar /></Col>
        </Row>
        <Row id="workload">
          <Col xs={12} md={6} lg={6} className="mb-3 px-3">
            <Stack direction="vertical" gap={3}>
              <h3>Your Requests</h3>
              <RequestList updateTrigger={triggerUpdate} criteria={{ userId: userId, shouldBeFiltered: true}}/>
            </Stack>
          </Col>
          <Col xs={12} md={6} lg={6} className="mb-3 px-3">
            <Stack direction="vertical" gap={3}>
              <h3>Submit a Request</h3>
              <NewRequestForm triggerRequestListUpdate={handleFormSubmit} />
            </Stack>      
          </Col>
        </Row>
    </Container>
    </>
  )
}

export default Dashboard;