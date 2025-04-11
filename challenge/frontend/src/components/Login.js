import React, { useState } from 'react';
import { useAuth } from '../AuthContext.js'; 
import Spinner from './Spinner.js';
import './Login.css'; 
const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); 

    // frontend validation for empty username or password
    if (!username || !password) {
      setError('Both username and password are required.');
      setLoading(false); // Hide spinner
      return;
    }

    const result = await login(username, password); 

    if (!result.success) {
      setLoading(false); 
      if (result.message.password) {
        setError(result.message.password[0]); // show backend password error
      } else {
        setError('Invalid username or password.'); // error for incorrect credentials
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <a href="/" className="nyc-council-logo">
        <img
          alt="NYC Council Seal"
          src="https://council.nyc.gov/wp-content/themes/wp-nycc/assets/images/nyc-seal-blue.png"
        />
        <div className="nyc-council-text">New York City Council</div>
      </a>
      <form onSubmit={handleLogin} className="login-form">
        <h2 className="login-title">Login</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="login-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="login-input"
        />
        {loading && ( 
          <div className="login-spinner">
            <Spinner />
          </div>
        )}
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="login-error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
