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
        <Row id="nav-bar" className = "mb-4 mt-3">
          <Col><LoginBar /></Col>
        </Row>
        <Row id="workload">
          <Col><RequestList criteria={{ status: "finished" }}/></Col>
          <Col>
            <Stack direction="vertical" gap={2}>
              <p>1. Register using your KIS email address.</p>
              <p>2. Submit a request. This involves selecting whether you would like something 3D printer or engraved using the laser cutter and uploading the relevant file.</p>
              <p>3. Receive an email letting you know that your order is ready and pick it up from Mr. Amith!</p>
            </Stack>
          </Col>
        </Row>
    </Container>
    </>
  )
}

export default Landing;