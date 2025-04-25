import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { uploadFile, createRequest } from '../utilities/Supabase';

function RequestForm() {
  const [type, setType] = useState("3D Printer");
  const [file, setFile] = useState(null)
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(file);

    //Upload file
    const response = await uploadFile(file);
    console.log("File uploaded:", response.path);

    const requestData = {
      user_id: 1, // replace with actual user
      type,
      file_url: response.path,
      status:"received",
      notes,
    };

    await createRequest(requestData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Col>
          <Form.Label>Type</Form.Label>
          <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="3D Printer">3D Printer</option>
            <option value="Laser Cutter">Laser Cutter</option>
          </Form.Select>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Upload File</Form.Label>
        <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])}/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Notes</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit Request
      </Button>
    </Form>
  );
}

export default RequestForm;