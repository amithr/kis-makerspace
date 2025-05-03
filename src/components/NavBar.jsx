import '../stylesheets/LoginBar.css';
import Stack from 'react-bootstrap/Stack';
import { handleLogout } from '../utilities/Supabase';
import { Button } from "react-bootstrap";


function NavBar() {
  return (
    <Stack direction="horizontal" gap={3}>
        <div className="p-2">KIS Makerspace</div>
        <div className="ms-auto d-flex gap-2">
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </div>
    </Stack>
  )
}

export default NavBar;