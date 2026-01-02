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

const getTotalBalanceBudget = (budgetList) => {
  return budgetList?.reduce((total, value) => {
    return total + value.budgetAmount;
  }, 0);
};

const getTotalSpent = (transactions) => {
  let totalSpent = 0;

  transactions.forEach((item) => {
    totalSpent += parseFloat(item.total);
  });

  console.log("TOtal spent result ::", totalSpent);
  return totalSpent;
};

const getMonthlyIncome = (transaction) => {
  return transaction
    .filter((transact) => {
      // transact.metadata.type === "Income"
      const type = transact.metadata.type;
      const date = new Date(transact.metadata.datetime);
      const year = date.getFullYear();
      const month = date.getMonth();
      const yearNow = new Date();

      if (
        type === "Income" &&
        year === yearNow.getFullYear() &&
        month === yearNow.getMonth()
      ) {
        return transact;
      }
    })
    .reduce((sum, spent) => {
      return sum + parseFloat(spent.total);
    }, 0);
};

const getPreviousMonthlyExpensesOrIncome = (transaction, receiptType) => {
  return transaction // track year and month
    .filter((transact) => {
      const type = transact.metadata.type;
      const date = new Date(transact.metadata.datetime);
      const year = date.getFullYear();
      const month = date.getMonth();
      const dateNow = new Date();
      const getPreviousDate = () => {
        if (dateNow.getMonth() - 1 < 0) {
          let prevDateObject = [
            dateNow.getFullYear() - 1,
            dateNow.getMonth() - 1 + 13,
            dateNow.getDay(),
          ].join("-");
          return new Date(prevDateObject);
        }
        return new Date([
          dateNow.getFullYear(),
          dateNow.getMonth() - 1,
          dateNow.getDay(),
        ]);
      };

      const previousDate = getPreviousDate();

      if (
        type === receiptType &&
        year === previousDate.getFullYear() &&
        month === previousDate.getMonth()
      ) {
        return transact;
      }
    })
    .reduce((sum, spent) => {
      return sum + parseFloat(spent.total);
    }, 0);
};

const getMonthlyExpenses = (transaction) => {
  return transaction // track year and month
    .filter((transact) => {
      const type = transact.metadata.type;
      const date = new Date(transact.metadata.datetime);
      const year = date.getFullYear();
      const month = date.getMonth();
      const yearNow = new Date();

      if (
        type === "Expense" &&
        year === yearNow.getFullYear() &&
        month === yearNow.getMonth()
      ) {
        return transact;
      }
    })
    .reduce((sum, spent) => {
      // console.log('Store for month ::', spent.store)
      return sum + parseFloat(spent.total);
    }, 0);
};

const getTotalExpenses = (transaction) => {
  return transaction
    .filter((transact) => transact.metadata.type === "Expense")
    .reduce((sum, spent) => {
      return (sum += parseFloat(spent.total));
    }, 0);
};

const getTotalIncome = (transaction) => {
  return transaction
    .filter((transact) => transact.metadata.type === "Income")
    .reduce((sum, spent) => {
      return (sum += parseFloat(spent.total));
    }, 0);
};

const getSavings = (monthlyIncome, monthlyExpenses) => {
  return monthlyIncome - monthlyExpenses;
};

export const AuthProvider = ({ children }) => {
  // user authentication
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(true);
  const [receipts, setReceipts] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [refreshPage, setRefreshPage] = useState(false);
  const [budgetList, setBudgetList] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [userReceipts, setUserReceipts] = useState(null);
  const [isReceiptsLoading, setIsReceiptsLoading] = useState(false);

  const [totalBudget, setTotalBudget] = useState(null);
  const [totalSpent, setTotalSpent] = useState(null);
  const [totalBalance, setTotalBalance] = useState(null);
  const [monthlyIncome, setMonthlyIncome] = useState(null);
  const [monthlyExpenses, setMonthlyExpenses] = useState(null);
  const [savings, setSavings] = useState(null);
  const [previousIncome, setPreviousIncome] = useState(null);
  const [previousExpense, setPreviousExpense] = useState(null);

  // fetching user receipt list

  const [models, setModels] = useState(null);

  // ... (Your existing useEffects remain the same) ...
  useEffect(() => {
    // console.log('Fetching ai models ');
    const fetchAi = async () => {
      // console.log('Fetching ai --> ');
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
    if (monthlyIncome) {
      console.log("Month expense ::", monthlyExpenses);
    }
    if (monthlyIncome) {
      console.log("Month income ::", monthlyIncome);
    }
    setSavings(getSavings(monthlyIncome, monthlyExpenses));
  }, [monthlyIncome, monthlyExpenses]);

  useEffect(() => {
    if (savings) {
      console.log("Savings ::", savings);
    }
  }, [savings]);

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

  useEffect(() => {
    if (totalBudget && totalSpent) {
      setTotalBalance(totalBudget - totalSpent);
    }
  }, [totalSpent]);

  const register = useCallback(async (url, options = {}) => {
    const status = await apiFetch(url, options);
    return status;
  }, []);

  const login = useCallback(async (endpoint, options = {}) => {
    const loginRes = await loginFetch(endpoint, options);
    // console.log('Login res --> ',await loginRes.json());
    return await loginRes.json();
  }, []);

  const uploadReceipts = useCallback(async (endpoint, options = {}) => {
    const upload = await apiFetch(endpoint, options);
    return upload;
  }, []);

  useEffect(() => {
    const handleGetBudgetItem = async () => {
      try {
        const res = await fetch("http://localhost:3000/get/budget", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ userId: user?._id }),
        });

        const data = await res.json();
        console.log("Budget list after fetch ::", data);
        setBudgetList(data.budgetList);
        setTotalBudget(getTotalBalanceBudget(data.budgetList));
      } catch (err) {
        console.error("Unable to get budget list:: ", err);
      }
    };

    handleGetBudgetItem();
  }, [user]);

  useEffect(() => {
    const sanitizeReceiptsFetchHelper = (transactions) => {
      return transactions.filter(
        (receipt) => !(Array.isArray(receipt) && receipt.length === 0)
      );
    };

    const getUserReceipts = async () => {
      try {
        setIsReceiptsLoading(true);
        const receipts = await fetch("http://localhost:3000/user/receipts", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ userId: user?._id }),
        });
        const data = await receipts.json();
        const sanitizedReceipts = sanitizeReceiptsFetchHelper(data.contents);
        // console.log("Receipt data's -> ", sanitizeReceiptsFetchHelper(data.contents))

        // set state after fetching receipts list
        setUserReceipts(sanitizedReceipts);
        setTotalSpent(getTotalExpenses(sanitizedReceipts));
        setMonthlyExpenses(getMonthlyExpenses(sanitizedReceipts));
        setMonthlyIncome(getMonthlyIncome(sanitizedReceipts));
        try {
          setPreviousExpense(
            getPreviousMonthlyExpensesOrIncome(sanitizedReceipts, "Expense")
          );
          setPreviousIncome(
            getPreviousMonthlyExpensesOrIncome(sanitizedReceipts, "Income")
          );
        } catch (err) {
          console.error("Unable to set previous", err);
        }

        setIsReceiptsLoading(false);
      } catch (err) {
        console.error("Unable to get receipts");
      }
    };
    if (user?._id) getUserReceipts();
    setRefreshPage(false);
  }, [user, refreshPage]);

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
        const response = await apiFetch("http://localhost:3000/user/verify", {
          credentials: "include",
        });

        if (response.user) {
          setUser(response.user);
        }
      } catch (error) {
        console.log("No valid session found");
        setUser(null);
      } finally {
        console.log("After 5 seconds");
        setLoading(false);
      }
    };
    checkSession();
  }, [refreshPage]);

  const value = useMemo(
    () => ({
      user,
      refreshPage,
      userReceipts,
      totalBudget,
      previousIncome,
      previousExpense,
      totalSpent,
      savings,
      monthlyExpenses,
      monthlyIncome,
      totalBalance,
      isReceiptsLoading,
      setRefreshPage,
      budgetList,
      isAddDialogOpen,
      setIsAddDialogOpen,
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
      registerLoading,
      setRegisterLoading,
    }),
    [
      user,
      userReceipts,
      isReceiptsLoading,
      refreshPage,
      monthlyExpenses,
      previousIncome,
      previousExpense,
      savings,
      monthlyIncome,
      setRefreshPage,
      budgetList,
      isAddDialogOpen,
      setIsAddDialogOpen,
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
