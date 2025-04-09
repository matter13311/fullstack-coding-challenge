import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard.js';
import Login from './components/Login.js';
import './App.css';

const AppContent = () => {
  const { authToken } = useAuth(); // Access authToken from AuthContext

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
        <div>
          <AppContent />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
