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
  const [hasProfile, setHasProfile] = useState(true)

  useEffect(() => {

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false)

      // If the user is logged in, make sure that there is a session attached with their account
      // The profile table contains additional user data and this helps prevent all sorts of weird errors that might otherwise occur.
      if(session) {
        checkProfile(session);
      }
    });

    // 2. Listen for session changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // 3. Clean up subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  const checkProfile = async (session) => {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", session.user.id) // Use the user ID, not email
      .maybeSingle();

    if (error || !profile) {
      console.warn("No profile found — signing out...");
      setHasProfile(false);
      await supabase.auth.signOut(); // 👈 Force logout
      return;
    } 
    setHasProfile(true); 
  }

  if (loading) return <div>Loading...</div> 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Landing />} />
          <Route 
            path="admin" 
            element={
              session && session.user.email === "amith-ravindar@kyiv.qsi.org" && hasProfile
                ? <Admin />
                : <Navigate to="/login" />
            } 
          />
          <Route 
            path="dashboard" 
            element={session && hasProfile ? <Dashboard /> : <Navigate to="/login" />} 
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