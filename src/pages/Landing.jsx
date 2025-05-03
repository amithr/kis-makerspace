import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoginBar from '../components/LoginBar';
import RequestList from '../components/RequestList';

function Landing() {

  return (
    <>
      <Container fluid>
        <Row id="nav-bar" className = "mb-4 mt-3">
          <Col><LoginBar /></Col>
        </Row>
        <Row id="workload">
          <Col><RequestList /></Col>
          <Col>Instructions</Col>
        </Row>
    </Container>
    </>
  )
}

export default Landing;