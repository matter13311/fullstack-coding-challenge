import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);

  useEffect(() => {
    // when authToken changes, update localStorage
    if (authToken) {
      console.log("setting authToken", authToken);
      localStorage.setItem('authToken', authToken);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [authToken]);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      console.log("logging in and fetching token...");
      const data = await response.json();
      setAuthToken(data.token); 
      localStorage.setItem('authToken', data.token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };


  //for the purpose of this challenge, this logout function will simply remove the authToken from clients localStorage.
  //it will not make a call to the backend to invalidate the token.
  //in a real world application, we would create a logout endpoint in the backend, which will invalidate the token.
  const logout = () => setAuthToken(null); 

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
