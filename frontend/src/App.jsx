import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Contact from './pages/Contact';
import Myprofile from './pages/Myprofile';
import About from './pages/About';
import Bookappointment from './pages/bookappointment';
import Myappointments from './pages/Myappointments';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import LoginToContinue from './pages/Logintocontinue';
import Dashboard from './pages/dashboard';

import Login from './authPage/Login.jsx';
import Signup from './authPage/Signup.jsx';
import RefreshHandler from './RefreshHandler.jsx';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check token on first mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // PrivateRoute → redirects if not logged in
  const PrivateRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <div>
      <NavBar className="sticky top-0" />

      {/* ✅ Keep RefreshHandler outside Routes */}
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Home/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-profile" element={<Myprofile />} />
        <Route path="/book-appointments" element={<Bookappointment />} />
        <Route path="/redirecting" element={<LoginToContinue />} />
      </Routes>

      <Footer className="sticky bottom-0" />
    </div>
  );
};

export default App;
