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

  // fetching user receipt list
  const [userReceipts, setUserReceipts] = useState(null);
  const [isReceiptsLoading, setIsReceiptsLoading] = useState(false);
  const [receiptType, setReceiptType] = useState({
    manual: null,
    smart: null,
  });

  // useEffect(() => {
  //   console.log("Reciepts contents ::", receipts);
  //   console.log("User contents ::", user);
  // }, [user, receipts]);

  const register = useCallback(async (url, options = {}) => {
    const status = await apiFetch(url, options);
    return status;
  }, []);

  const login = useCallback(async (endpoint, options = {}) => {
    const loginRes = await loginFetch(endpoint, options);
    return loginRes;
  }, []);

  const uploadReceipts = useCallback(async (endpoint, options = {}) => {
    const upload = await apiFetch(endpoint, options);
    return upload;
  }, []);

  const getReceiptType = (data) => {
    try {
      const manualList = [];
      const smartList = data.contents.map((res, index) => {
          if (!Array.isArray(res)) {
            // console.log("Object type :: ", res);
            return res;
          }
          manualList.push(res.pop());
          return null;
        }).filter((remain) => typeof remain !== null);

      // console.log("Smart list :: ", smartList);
      // console.log("Manual list :: ", manualList.flat());

      return {
        manualList: manualList.flat(),
        smartList,
      };
    } catch (err) {
      console.log("Unable to process the type of receipt" + err);
    }
  };

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

  useEffect(() => {
    const getUserReceipts = async () => {
      // console.log("Running get user receipts user id ::", user);
      try {
        setIsReceiptsLoading(true);
        const receipts = await fetch("http://localhost:3000/user/receipts", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ userId: user?._id }),
        });
        // console.log("User receipts ::", receipts);

        const data = await receipts.json();

        const receiptTypeInteg = getReceiptType(data);
        // console.log("receipt type ::", receiptTypeInteg);

        setUserReceipts(receiptTypeInteg);
        setIsReceiptsLoading(false);
      } catch (err) {
        console.error("Unable to get receipts");
      }
    };
    getUserReceipts();
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      login,
      logout,
      setLoading,
      isLoading,
      register,
      uploadReceipts,
      receipts,
      setReceipts,
      userReceipts,
      isReceiptsLoading,
      // handleReceiptType,
      setReceiptType,
      receiptType,
      registerLoading,
      setRegisterLoading,
    }),
    [
      user,
      setUser,
      login,
      logout,
      isLoading,
      register,
      registerLoading,
      userReceipts,
      isReceiptsLoading,
      // handleReceiptType,
      receiptType,
      setReceiptType,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the context easily
export const useAuth = () => {
  return useContext(AuthContext);
};
