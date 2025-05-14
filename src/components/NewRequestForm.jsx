import { useState, useRef, useEffect } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { uploadFile, createRequest, sendEmail, getCurrentUser, getUserEmail, supabase } from '../utilities/Supabase';
import confetti from "canvas-confetti";

function RequestForm() {
  const [type, setType] = useState("3D Printer");
  const [file, setFile] = useState(null)
  const [notes, setNotes] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const turnstileRef = useRef(null);

  useEffect(() => {
    if (window.turnstile && turnstileRef.current) {
      window.turnstile.render(turnstileRef.current, {
        sitekey: "0x4AAAAAABdKnGaLIp7yGO9t", // 🔁 Replace this
        callback: function (token) {
          setCaptchaToken(token);
        },
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
  
    if (!captchaToken) {
      setErrorMessage("Please complete the CAPTCHA.");
      return;
    }
  
    console.log(file);
  
    try {
      // Get current user session and info
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error("Unable to retrieve user session.");
      }
  
      const user = session.user;
  
      // Upload file
      const response = await uploadFile(file);
  
      const requestData = {
        user_id: user.id,
        type,
        file_url: response.path,
        status: "Received",
        notes,
      };
  
      const result = await createRequest(requestData);
  
      // ✅ Step 1: Verify CAPTCHA with Authorization header
      const captchaRes = await fetch("https://ikzwpgecawpusbzznpob.supabase.co/functions/v1/CAPTCHA", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`, // <- ✅ Required header
        },
        body: JSON.stringify({ token: captchaToken }),
      });
  
      const verified = await captchaRes.json();
      if (!verified.success) {
        setErrorMessage("CAPTCHA verification failed.");
        return;
      }
  
      if (result) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
  
        setSuccessMessage("✅ Request submitted successfully!");
  
        const userEmail = await getUserEmail(user.id);
  
        await sendEmail({
          to: userEmail,
          subject: "Request submitted",
          html: "<p>Congratulations, you have successfully submitted your request! You'll receive more email updates on its status soon.</p>",
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

        <div className="mb-3" ref={turnstileRef}></div>

        <Button variant="danger" type="submit">
          Submit Request
        </Button>
      </Form>
    </>
  );
}

export default RequestForm;