import '../stylesheets/LoginBar.css';
import { Button } from "react-bootstrap";
import Stack from 'react-bootstrap/Stack';
import { useNavigate } from "react-router-dom";
import {supabase, handleLogout, getCurrentUser} from '../utilities/Supabase';
import { useEffect, useState } from 'react';


function LoginBar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    const user = getCurrentUser();
    setUser(user);
  }, []);

  const goToLogin = () => {
    navigate("/login");
  };

  const goToRegistration = () => {
    navigate("/login");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <Stack direction="horizontal" gap={3}>
      <div className="p-2">KIS Makerspace</div>
      <div className="ms-auto d-flex gap-2">
        {user ? (
          <>
            <Button variant="success" onClick={goToDashboard}>Dashboard</Button>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Button variant="primary" onClick={goToLogin}>Login</Button>
            <Button variant="primary" onClick={goToRegistration}>Register</Button>
          </>
        )}
      </div>
    </Stack>
  );
}

export default LoginBar;