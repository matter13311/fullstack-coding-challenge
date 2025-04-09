import React, { useState } from 'react';
import { useAuth } from '../AuthContext.js'; 

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); 

    // simple frontend validation
    if (!username || !password) {
      setError('Both username and password are required.');
      return;
    }

    const result = await login(username, password); // call the login function from AuthContext

    if (!result.success) {
      if (result.message.password) {
        setError(result.message.password[0]); // show backend password error
      } else {
        setError('Invalid username or password.'); //error for incorrect credentials
      }
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="text" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        placeholder="Username" 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password" 
      />
      <button type="submit">Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>} 
    </form>
  );
};

export default Login;
