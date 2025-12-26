// context/AuthContext.jsx
import {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  createContext,
} from "react";

import { apiFetch, loginFetch } from "@/api/client";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // user authentication
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(true);
  const [receipts, setReceipts] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  // fetching user receipt list


  const [models, setModels] = useState(null);
  
    // ... (Your existing useEffects remain the same) ...
    useEffect(() => {
      console.error('Fetching ai models ');
      const fetchAi = async () => {
      console.log('Fetching ai --> ');
        try {
          setIsModelLoading(true);
          const res = await fetch("http://localhost:3000/extract/getModels");
          const data = await res.json();
          setModels(data.models);
          setIsModelLoading(false);
        } catch (err) {
          console.error("Unable to fetch ai models");
        }
      };
      fetchAi();
  
    }, []);
 

  // useEffect(() => {
  //   console.log("Reciepts contents ::", receipts);
  //   console.log("User contents ::", user);
  // }, [user, receipts]);

  const register = useCallback(async (url, options = {}) => {
    const status = await apiFetch(url, options);
    return status;
  }, []);

  const login = useCallback(async (endpoint, options = {}) => {
    const loginRes =  await loginFetch(endpoint, options);
    // console.log('Login res --> ',await loginRes.json());
    return await loginRes.json();
  }, []);

  const uploadReceipts = useCallback(async (endpoint, options = {}) => {
    const upload = await apiFetch(endpoint, options);
    return upload;
  }, []);

  
  useEffect(() => {
    console.log("Running the check sessions");
    const checkSession = async () => {
      try {
        // This calls the backend route we just made
        const response = await apiFetch("http://localhost:3000/user/verify", {
          credentials: "include",
        });

        if (response.user) {
          console.log("Response user --> session ", response.user);
          setUser(response.user);
        }
      } catch (error) {
        console.log("No valid session found");
        setUser(null);
      } finally {
        // 3. Whether it works or fails, we are done loading
        setTimeout(() => {
          console.log("After 5 seconds");
          setLoading(false);
        }, 500);
      }
    };
    checkSession();
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      setIsModelLoading,
      isModelLoading,
      models,
      setModels,
      setUser,
      login,
      logout,
      setLoading,
      isLoading,
      register,
      uploadReceipts,
      receipts,
      setReceipts,
      // userReceipts,
      // isReceiptsLoading,
      // handleReceiptType,
      // setReceiptType,
      // receiptType,
      registerLoading,
      setRegisterLoading,
    }),
    [
      user,
      setIsModelLoading,
      isModelLoading,
      models,
      setModels,
      setUser,
      login,
      logout,
      isLoading,
      register,
      registerLoading,
      // userReceipts,
      // isReceiptsLoading,
      // handleReceiptType,
      // receiptType,
      // setReceiptType,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the context easily
export const useAuth = () => {
  return useContext(AuthContext);
};
