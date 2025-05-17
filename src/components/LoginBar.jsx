import '../stylesheets/LoginBar.css';
import { Button } from "react-bootstrap";
import Stack from 'react-bootstrap/Stack';
import { useNavigate } from "react-router-dom";
import {supabase, handleLogout, getCurrentUser} from '../utilities/Supabase';
import { useEffect, useState } from 'react';


function LoginBar() {
  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCurrentUser() {
      const user = await getCurrentUser();
      setUser(user);
    }
    loadCurrentUser();
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

  const goHome = () => {
    navigate("/");
  };

  const logout = async () => {
    await handleLogout();
    window.location.href = "/";
  }

  return (
    <Stack direction="horizontal" gap={3} className="flex-column flex-md-row align-items-start">
      <a href="/" className="text-decoration-none"><h1 className="text-danger">KIS Makerspace  <i className="bi bi-gear"></i></h1></a>
      <div className="ms-md-auto d-flex flex-column flex-md-row gap-2">
      <p> </p>
        {user ? (
          <>
            <Button variant="danger" onClick={goHome}>Home</Button>
            <Button variant="danger" onClick={goToDashboard}>Submit a Request</Button>
            <Button variant="danger" onClick={logout}>Logout</Button>
          </>
        ) : (
          <>
            <Button variant="danger" onClick={goToLogin}>Login/Register</Button>
            <Button variant="danger" onClick={goHome}>Home</Button>
          </>
        )}
      </div>
    </Stack>
  );
}

export default LoginBar;