// context/AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { apiFetch } from '@/api/client';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(false);


  const register = async (url, options ={}) => {
    const status = await apiFetch(url, options);
    return status;
  }


  const login = (userData) => {
    setUser(userData);
    // In a real app, you might also store a token in localStorage here
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setLoading, isLoading, register  }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the context easily
export const useAuth = () => {
  return useContext(AuthContext);
};