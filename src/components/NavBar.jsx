import '../stylesheets/LoginBar.css';
import Stack from 'react-bootstrap/Stack';
import { handleLogout } from '../utilities/Supabase';
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


function NavBar() {
  const navigate = useNavigate();
  function goToLandingPage() {
    navigate("/");
  }
  return (
    <Stack direction="horizontal" gap={3}>
        <h1>KIS Makerspace</h1>
        <div className="ms-auto d-flex gap-2">
          <Button variant="success" onClick={goToLandingPage}>Home</Button>
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </div>
    </Stack>
  )
}

export default NavBar;