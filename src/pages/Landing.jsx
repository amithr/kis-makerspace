import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoginBar from '../components/LoginBar';
import RequestList from '../components/RequestList';
import Stack from 'react-bootstrap/Stack';
import '../stylesheets/Landing.css';

function Landing() {
  return (
    <>
      <Container fluid>
        <Row className = "mb-4 mt-3">
          <Col className="mx-3"><LoginBar /></Col>
        </Row>
        <Row id="workload">
          <Col xs={12} md={5} lg={6} className="mb-3 px-4 d-flex flex-column align-items-center">
            <Stack direction="vertical" gap={2}>
              <h3>How to Get Started</h3>
              <i className="bi bi-person-plus text-danger fs-1"></i>
              <p className="fs-5">Register using your KIS email address by clicking on the "Login/Register" button.</p>
              <i className="bi bi-box-arrow-up text-danger fs-1"></i>
              <p className="fs-5">Submit a 3D printing request by clicking on the "Submit a Request" button. You can easily create a 3D model in <a href="http://www.tinkercad.com">Tinkercad</a> and then export the ".stl" file.</p>
              <i className="bi bi-envelope text-danger fs-1"></i>
              <p className="fs-5">Check the homepage to see when your request is "Ready for Pickup."</p>
            </Stack>
          </Col>
          <Col xs={12} md={6} lg={6} className="mb-3 px-3 d-flex flex-column align-items-center">
            <Stack direction="vertical" gap={2}>
              <h3>Current Requests</h3>
              <RequestList criteria={{ status: "finished" }}/>
            </Stack>
          </Col>
        </Row>
    </Container>
    </>
  )
}

export default Landing;