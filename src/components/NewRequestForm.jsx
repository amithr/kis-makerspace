import { useState } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { uploadFile, createRequest, sendEmail, getCurrentUser, getUserEmail } from '../utilities/Supabase';
import confetti from "canvas-confetti";

function RequestForm({triggerRequestListUpdate}) {
  const [type, setType] = useState("3D Printer");
  const [file, setFile] = useState(null)
  const [notes, setNotes] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
        setLoading(false);
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
          html: "<p>Congratulations, you have successfully submitted your request! You'll receive more email updates on it's status soon.</p>",
        });

        await sendEmail({
          to: "amith-ravindar@kyiv.qsi.org",
          subject: user.email + " submitted a request.",
          html: "<p>A new request has been submitted by." + user.email + "</p>",
        });

        triggerRequestListUpdate();

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
  
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Label>Type</Form.Label>
              <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="3D Printer">3D Printer</option>
              </Form.Select>
            </Col>
          </Row>
  
          <Form.Group className="mb-3">
            <Form.Label>Upload File (.stl, .obj)</Form.Label>
            <Form.Control 
              type="file" 
              accept=".stl, .obj" 
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Form.Group>
  
          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter notes (color, PLA or ABS, etc.)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Form.Group>
  
          <Button variant="danger" type="submit">
            Submit Request
          </Button>
        </Form>
      )}
    </>
  );
}

export default RequestForm;