import './stylesheets/App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from 'react';
import { supabase } from './utilities/Supabase';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from './pages/Landing';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false)
    });

    // 2. Listen for session changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // 3. Clean up subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div> 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Landing />} />
          <Route 
            path="admin" 
            element={
              session && session.user.email === "amith-ravindar@kyiv.qsi.org"
                ? <Admin />
                : <Navigate to="/login" />
            } 
          />
          <Route 
            path="dashboard" 
            element={session ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="login" 
            element={!session ? <Login /> : <Navigate to="/dashboard" />} 
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;