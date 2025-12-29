// context/AuthContext.jsx
import {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  createContext,
} from "react";

// import { useNavigate } from "react-router-dom";
import { apiFetch, loginFetch } from "@/api/client";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // user authentication
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(true);
  const [receipts, setReceipts] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [refreshPage, setRefreshPage] = useState(false);
  const [budgetList, setBudgetList] = useState(null);

  // fetching user receipt list


  const [models, setModels] = useState(null);
  
    // ... (Your existing useEffects remain the same) ...
    useEffect(() => {
      console.log('Fetching ai models ');
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


     useEffect(() => {
        const root = window.document.documentElement;
        // Check the boolean state 'isDarkMode', not the string "dark"
        if (user?.theme === "dark") {
          root.classList.add("dark");
          root.style.colorScheme = "dark"; 
        } else {
          root.classList.remove("dark");
          root.style.colorScheme = "light";
        }
      }, [user]);
    

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
      const handleGetBudgetItem = async () =>{
          try {
              const res = await fetch('http://localhost:3000/get/budget', {
                method : "POST",
                headers : {
                  'Content-type' : 'application/json'
                },
                body : JSON.stringify({userId : user?._id})
              });

              const data = await res.json();
              console.log('Budget list after fetch ::', data);
              setBudgetList(data.budgetList);
          } catch(err) {
              console.error("Unable to get budget list:: ", err);
          }
      }

      handleGetBudgetItem();
  }, [user?._id])

  // const logout = useCallback( async(setIsLoggingOut, setShowLogoutDialog) => {
  //   try {
  //     setIsLoggingOut(true);
  //     const response = await fetch("http://localhost:3000/user/logout", {
  //       method: "POST",
  //       credentials : 'include',
  //       headers: { "Content-Type": "application/json" },
  //     });

  //     if (!response.ok) {
  //       throw new Error("Logout failed");
  //     }
  //   } catch (err) {
  //     console.error("Unable to logout");
  //   } finally {
  //     setShowLogoutDialog(false);
  //     setIsLoggingOut(false);
  //     console.log("User logged out");
  //     navigate("/", { replace: true });
  //   }

  // }, []);

  
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
        console.log('User list ;:', response.user);
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
  }, [refreshPage]);

  const value = useMemo(
    () => ({
      user,
      refreshPage,
      setRefreshPage,
      budgetList,
      setIsModelLoading,
      isModelLoading,
      models,
      setModels,
      setUser,
      login,
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
      refreshPage,
      setRefreshPage,
      budgetList,
      setIsModelLoading,
      isModelLoading,
      models,
      setModels,
      setUser,
      login,
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
