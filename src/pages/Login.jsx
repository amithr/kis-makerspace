import { useState } from 'react';
import RegistrationForm from '../components/RegistrationForm';
import LoginForm from '../components/LoginForm';
import { supabase } from '../utilities/Supabase';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) console.error('Sign Up error:', error.message);
  }

  return (
    <div>
      <LoginForm />
      <RegistrationForm />
    </div>
  );
}

export default Login;