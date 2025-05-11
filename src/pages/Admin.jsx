import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NewRequestForm from "../components/NewRequestForm";
import NavBar from "../components/NavBar";
import LoginBar from '../components/LoginBar';
import AdminRequestList from "../components/AdminRequestList";


function Admin() {
    return (
      <>
      <Container fluid>
        <Row id="nav-bar" className = "mb-4 mt-3">
          <Col><LoginBar /></Col>
        </Row>
        <Row id="workload">
          <Col><AdminRequestList /></Col>
        </Row>
    </Container>
    </>
    )
}

export default Admin;