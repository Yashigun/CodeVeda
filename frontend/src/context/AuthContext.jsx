// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(false); // Default to logged out

  const login = () => {
    setToken(true);
  };

  const logout = () => {
    setToken(false);
  };

  const value = {
    token,
    setToken,
    login,
    logout,
    isLoggedIn: token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};