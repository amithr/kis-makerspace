import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavBar from '../components/NavBar';
import RequestList from '../components/RequestList';
import NewRequestForm from '../components/NewRequestForm';



function Dashboard() {

  return (
    <>
      <Container fluid>
        <Row id="nav-bar" className = "mb-4 mt-3">
          <Col><NavBar /></Col>
        </Row>
        <Row id="workload">
          <Col><RequestList /></Col>
          <Col><NewRequestForm /></Col>
        </Row>
    </Container>
    </>
  )
}

export default Dashboard;