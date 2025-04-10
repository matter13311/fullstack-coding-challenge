import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard.js';
import Login from './components/Login.js';
import './App.css';

const AppContent = () => {
  const { authToken, loading } = useAuth(); // Access authToken from AuthContext

  console.log("app.js authToken: ", authToken);
  return (
    <Routes>
      <Route path="/" element={authToken ? <Dashboard /> : <Login />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
          <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
