import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavBar from '../components/NavBar';
import RequestList from '../components/RequestList';
import NewRequestForm from '../components/NewRequestForm';
import { useEffect, useState } from 'react';



function Dashboard() {

  return (
    <>
      <Container fluid>
        <Row id="nav-bar">
          <Col><NavBar /></Col>
        </Row>
        <Row id="workload">
          <Col></Col>
          <Col><NewRequestForm /></Col>
        </Row>
    </Container>
    </>
  )
}

export default Dashboard;