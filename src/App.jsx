import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages Import
import Login from './Pages/Login.jsx'; 
import Signup from './Pages/Signup.jsx'; // 👈 1. Ye import add karein
import UploadPage from './Pages/UploadPage.jsx';
import VitalsPage from './Pages/VitalsPage.jsx';
import Timeline from './Pages/Timeline.jsx';
import Navbar from './components/Navbar.jsx'; 

// Auth Guard Logic
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <div className="bg-[#F2F2F7] min-h-screen selection:bg-blue-100">
        
        <Routes>
          {/* Public Pages */}
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/" />} /> {/* 👈 2. Logic update kiya */}

          {/* Protected Pages */}
          <Route path="/" element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          } />
          
          <Route path="/vitals" element={
            <ProtectedRoute>
              <VitalsPage />
            </ProtectedRoute>
          } />

          <Route path="/timeline" element={
            <ProtectedRoute>
              <Timeline />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
        </Routes>

        {token && <Navbar />}
      </div>
    </Router>
  );
}

export default App;