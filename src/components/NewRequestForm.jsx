import { useState } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { uploadFile, createRequest, sendEmail, getCurrentUser, getUserEmail } from '../utilities/Supabase';
import confetti from "canvas-confetti";

function RequestForm() {
  const [type, setType] = useState("3D Printer");
  const [file, setFile] = useState(null)
  const [notes, setNotes] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    console.log(file);
    try {
      // Get current user
      const user = await getCurrentUser();
      // Upload file
      const response = await uploadFile(file);
      
      const requestData = {
        user_id: user.id, // now using actual user ID
        type,
        file_url: response.path,
        status: "Received",
        notes,
      };
    
      const result = await createRequest(requestData);

      if (result) {
        // ✅ Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        setSuccessMessage("✅ Request submitted successfully!");

        console.log(getUserEmail(user.id))

        await sendEmail({
          to: await getUserEmail(user.id),
          subject: "Request submitted",
          html: "<p>Congratulations, you have successfully submitted your request! You'll more email updates on it's status soon.</p>",
        });

      } else {
        setErrorMessage("❌ Failed to submit request. Please try again.");
      }
    } catch (err) {
      setErrorMessage("❌ Error: " + err.message);
    }
  };

  return (
    <>
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible>
          {errorMessage}
       </Alert>
      )}
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

        <Button variant="danger" type="submit">
          Submit Request
        </Button>
      </Form>
    </>
  );
}

export default RequestForm;