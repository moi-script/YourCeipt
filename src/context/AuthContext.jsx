// context/AuthContext.jsx
import {useContext, useState, useEffect, useCallback, useMemo, createContext } from 'react';


import { apiFetch, loginFetch } from "@/api/client";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(true);

 const register = useCallback(async (url, options = {}) => {
    const status = await apiFetch(url, options);
    console.log('Register status :: ', status);
    return status;
  }, []);

  const login = useCallback(async (endpoint, options = {}) => {
    console.log('Endpoint ::', endpoint);
    console.log('Options ::', options);

    const loginRes = await loginFetch(endpoint, options);
    console.log('Login status :: ', loginRes);

    return loginRes;

    // if (loginRes.status === 200) {
    //   setUser(loginRes);
    // } else {
    //   setUser(null);
    // }
    // return true;
  }, []);


  
  useEffect(() => {
    console.log("Running the check sessions");
    const checkSession = async () => {
      try {
        // This calls the backend route we just made
        const response = await apiFetch("http://localhost:3000/user/verify");

        if (response.user) {
          setUser(response.user);
        }
      } catch (error) {
        console.log("No valid session found");
        setUser(null);
      } finally {
        // 3. Whether it works or fails, we are done loading
        setTimeout(() => {
          console.log('After 5 seconds');
          setLoading(false);
        }, 500);
      }
    };

    checkSession();
  }, []);
  

const logout = useCallback(() => {
    setUser(null);
  }, []);


  const value = useMemo(() => ({
    user,
    setUser,
    login,
    logout,
    setLoading,
    isLoading,
    register,
    registerLoading,
    setRegisterLoading,
  }), [user, setUser, login, logout, isLoading, register, registerLoading]);



  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the context easily
export const useAuth = () => {
  return useContext(AuthContext);
};
