import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoginBar from '../components/LoginBar';
import RequestList from '../components/RequestList';
import Stack from 'react-bootstrap/Stack';

function Landing() {
  return (
    <>
      <Container fluid>
        <Row className = "mb-4 mt-3">
          <Col className="mx-3"><LoginBar /></Col>
        </Row>
        <Row className = "mb-4 mt-3">
          <Stack direction="horizontal" gap={3} className="mx-3">
            <a href="/" className="text-danger text-decoration-none"><h6>3D Printing</h6></a>
            <a href="/" className="text-danger text-decoration-none"><h6>Laser Engraving</h6></a>
          </Stack>
        </Row>
        <Row id="workload">
          <Col className="mx-3">
            <Stack direction="vertical" gap={2}>
              <h3>Current Requests</h3>
              <RequestList criteria={{ status: "finished" }}/>
            </Stack>
          </Col>
          <Col className="mx-3">
            <Stack direction="vertical" gap={2}>
              <h3>How to Get Started</h3>
              <i className="bi bi-person-plus text-danger fs-1"></i>
              <p className="fs-5">Register using your KIS email address.</p>
              <i className="bi bi-box-arrow-up text-danger fs-1"></i>
              <p className="fs-5">Submit a request. This involves selecting whether you would like something 3D printed or engraved using the laser cutter and uploading the relevant file.</p>
              <i className="bi bi-envelope text-danger fs-1"></i>
              <p className="fs-5">Receive an email letting you know that your order is ready and pick it up from Mr. Amith!</p>
            </Stack>
          </Col>
        </Row>
    </Container>
    </>
  )
}

export default Landing;