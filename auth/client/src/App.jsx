// App.jsx
import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import React, { useEffect, useState } from 'react';
import RefreshHandler from './RefreshHandler.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check token on first mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // PrivateRoute → redirects if not logged in
  const PrivateRoute = () => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    // Redirect to external dashboard (5174)
    window.location.href = "http://localhost:5174/Dashboard";
    return null;
  };

  return (
    <>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<PrivateRoute />} />
      </Routes>
    </>
  );
}

export default App;
