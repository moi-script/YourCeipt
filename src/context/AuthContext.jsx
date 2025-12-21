// context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiFetch } from '@/api/client';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(true);


  const register = async (url, options = {}) => {
    const status = await apiFetch(url, options);
    return status;
  }

  useEffect(() => {
    const checkSession = async () => {
            try {
                // This calls the backend route we just made
                const response = await apiFetch('http://localhost:3000/user/verify'); 

                if (response.user) {
                    setUser(response.user);
                }
            } catch (error) {
                console.log("No valid session found");
                setUser(null);
            } finally {
                // 3. Whether it works or fails, we are done loading
                setLoading(false);
            }
        };

        checkSession();
  }, []);


  const login = (userData) => {
    setUser(userData);
    // In a real app, you might also store a token in localStorage here
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setLoading, isLoading, register, registerLoading, setRegisterLoading  }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the context easily
export const useAuth = () => {
  return useContext(AuthContext);
};