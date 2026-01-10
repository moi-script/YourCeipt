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
import { calculateMonthlyTrendClientSide, getCategorySummaries, processBudgetInsights, transformBudgetsToInsights } from "@/api/analyticsAction";
import { CATEGORY_CONFIG, CATEGORY_MAP } from "@/Home/Analyts";
const AuthContext = createContext(null);

const getTotalBalanceBudget = (budgetList) => {
  return budgetList?.reduce((total, value) => {
    return total + value.budgetAmount;
  }, 0);
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
      return sum + parseFloat(spent.total)?.toFixed(2);
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

const getSavings = (monthlyIncome = 0, monthlyExpenses = 0) => {
  
  return monthlyIncome - monthlyExpenses;
};

const getRecentTransaction = (transactions) => {
  const now = new Date();
  const threeDays = 1 * 24 * 60 * 60 * 1000;

  const threeDaysAgo = new Date(now.getTime() - threeDays);

  const filteredTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.metadata.datetime);
    return txDate >= threeDaysAgo && txDate <= now;
  });
  const sortedTransactions = filteredTransactions.sort(
    (a, b) => new Date(b.metadata.datetime) - new Date(a.metadata.datetime)
  );

  const simplifiedList = sortedTransactions?.map((tx, index) => ({
    id: index + 1,
    name: tx.store ?? tx.transaction.store_number ?? "Unknown",
    amount: tx.total ?? 0,
    category: tx.items?.[0]?.category ?? "Other",
    date: tx.metadata?.datetime.split("T")[0] ?? null,
    type: tx.metadata?.type?.toLowerCase() === "income" ? "income" : "expense",
    notes: tx.metadata?.notes ?? "",
  }));

  console.log("Sorted from three days ago up to now ", simplifiedList);
  return simplifiedList;
};

const convertToInitialTransactions = (receipts = []) => {
  return receipts.map((tx) => {
    const subtotal =
      tx.subtotal ??
      (tx.items ?? []).reduce(
        (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
        0
      );

    const taxRate = tx.tax_rate ?? 0;
    const taxAmount = tx.tax_amount ?? subtotal * taxRate;
    const total = tx.total ?? subtotal + taxAmount;

    return {
      id: tx._id,
      store: tx.store ?? "Unknown Store",
      slogan: tx.slogan ?? null,
      contact: tx.contact ?? null,
      manager: tx.manager ?? null,

      address: {
        street: tx.address?.street ?? null,
        city: tx.address?.city ?? null,
        state: tx.address?.state ?? null,
        zip: tx.address?.zip ?? null,
      },

      transaction: {
        store_number: tx.transaction?.store_number ?? null,
        operator_number: tx.transaction?.operator_number ?? null,
        terminal_number: tx.transaction?.terminal_number ?? null,
        transaction_number: tx.transaction?.transaction_number ?? null,
      },

      items: (tx.items ?? []).map((item) => ({
        description: item.description ?? null,
        upc: item.upc ?? null,
        type: item.type ?? null,
        price: item.price ?? 0,
        quantity: item.quantity ?? 1,
      })),

      subtotal: parseFloat(subtotal),
      tax_rate: taxRate,
      tax_amount: parseFloat(taxAmount),
      total: parseFloat(total),

      payment_method: tx.payment_method ?? null,
      amount_paid: tx.amount_paid ?? total,

      type: total >= 0 ? "expense" : "income",

      metadata: {
        currency: tx.metadata?.currency ?? "PHP",
        datetime: tx.metadata?.datetime ?? null,
        notes: tx.metadata?.notes ?? "",
        source_type: tx.metadata?.source_type ?? null,
      },
    };
  });
};

const calculateBudgetSpending = (budgetList, transactions) => {
  if (!budgetList || !transactions) return [];

  // Step 1: Create a map to store total spending per category
  // Example: { "groceries": 150.00, "utilities": 40.50 }
  const spendingMap = {};

  transactions.forEach((receipt) => {
    // skip invalid receipts
    if (!receipt.items) return; 

    receipt.items.forEach((item) => {
      // Normalize category to lowercase to ensure matches (e.g., "Food" == "food")
      const category = item.category?.toLowerCase().trim() ?? "other";
      const price = parseFloat(item.price) || 0;
      const quantity = parseFloat(item.quantity) || 1;
      const totalItemCost = price * quantity;

      if (spendingMap[category]) {
        spendingMap[category] += totalItemCost;
      } else {
        spendingMap[category] = totalItemCost;
      }
    });
  });

  console.log('Spending map -> ', spendingMap);

  return budgetList.map((budget) => {
    const budgetCategory = budget.category.toLowerCase().trim();
    const totalSpent = spendingMap[budgetCategory] || 0; 
    
    return {
      ...budget, // Keep existing budget properties (color, name, etc.)
      spent: totalSpent, // Update the spent amount
      remaining: budget.budgetAmount - totalSpent 
    };
  });
};

const getTotals = (transactions, type, period, offset = 0) => {
  return transactions
    .filter(t => t.metadata.type === type && isInTimeframe(t.metadata.datetime, period, offset))
    .reduce((sum, t) => sum + parseFloat(t.total || 0), 0);
};

const getMetrics = (transactions, period = 'month') => {
  const income = getTotals(transactions, 'Income', period);
  const expenses = getTotals(transactions, 'Expense', period);

  console.log('Income metrics ::', income, 'type ::', typeof income);
  console.log('Expense metrics ::', expenses, 'type ::', typeof expenses);

  // 1. Net Savings
  const netSavings = income - expenses;
  
  // 2. Savings Rate (Percentage of income saved)
  const savingsRate = income > 0 ? (netSavings / income) * 100 : 0;

  // 3. Income Stability (Coefficient of Variation)
  // We look at the last 4 periods to see how much income fluctuates
  const history = [0, -1, -2, -3].map(offset => getTotals(transactions, 'Income', period, offset));
  const avgIncome = history.reduce((a, b) => a + b, 0) / history.length;
  const variance = history.reduce((a, b) => a + Math.pow(b - avgIncome, 2), 0) / history.length;
  const stabilityScore = avgIncome > 0 ? (1 - (Math.sqrt(variance) / avgIncome)) * 100 : 0;

  return {
    period,
    income,
    expenses,
    netSavings: netSavings.toFixed(2),
    savingsRate: savingsRate.toFixed(2) + '%',
    stabilityScore: Math.max(0, stabilityScore).toFixed(2) + '%' // 100% is perfectly stable
  };
};

const isInTimeframe = (dateString, period = 'month', offset = 0) => {
  const transDate = new Date(dateString);
  const now = new Date();
  
  // Adjust "now" based on the offset (e.g., offset -1 for "previous" period)
  if (period === 'week') now.setDate(now.getDate() + (offset * 7));
  if (period === 'month') now.setMonth(now.getMonth() + offset);
  if (period === 'quarter') now.setMonth(now.getMonth() + (offset * 3));
  if (period === 'year') now.setFullYear(now.getFullYear() + offset);

  const isSameYear = transDate.getFullYear() === now.getFullYear();

  switch (period) {
    case 'week':
      // Basic week-of-year check
      const getWeek = (d) => {
        const start = new Date(d.getFullYear(), 0, 1);
        return Math.ceil((((d - start) / 86400000) + start.getDay() + 1) / 7);
      };
      return isSameYear && getWeek(transDate) === getWeek(now);
    case 'month':
      return isSameYear && transDate.getMonth() === now.getMonth();
    case 'quarter':
      const getQuarter = (d) => Math.floor(d.getMonth() / 3);
      return isSameYear && getQuarter(transDate) === getQuarter(now);
    case 'year':
      return isSameYear;
    default:
      return false;
  }
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
  const [totalIncome, setTotalIncome] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [savings, setSavings] = useState(0);
  const [previousIncome, setPreviousIncome] = useState(null);
  const [previousExpense, setPreviousExpense] = useState(null);
  const [recentTransaction, setRecentTransaction] = useState(null);
  const [transactionFlow, setTransactionFlow] = useState(null);
  const [categorySpent, setCategorySpent] = useState(null);
  const [activeModelName, setActiveModelName] = useState("");
  const [metricsAnalytic, setMetricsAnalytic] = useState({
    info : null,
  });
  const [spendingTrend, setSpendingTrend] = useState(null);


   const [transformInsights, setTransformInsights] = useState(null);
   const [categoryInsights, setCategoryInsights] = useState(null);
    // const [merchantInsights, setMerchantInsights] = useState(null);
   const [categorySummaries, setCagorySummaries] = useState({});
    
  

     useEffect(() => {
        if(categorySpent) {
          console.log('setting the category insights :: ', categorySpent);  // checking the transform insights for fist login not being null 
          setTransformInsights(transformBudgetsToInsights(categorySpent, CATEGORY_MAP));
          setCategoryInsights(processBudgetInsights(categorySpent, CATEGORY_CONFIG));
          setCagorySummaries(getCategorySummaries(categorySpent));
        }
    
      }, [categorySpent]) // category spent just render, then setting a new state after will delay the data display
    





  const [isUserLogin, setIsUserLogin] = useState(() => {
    const item = localStorage.getItem('user');
    if(item) {
      return true;
    } 
    return null;
  })





  // fetching user receipt list

  const [models, setModels] = useState(null);

// ... (Your existing useEffects remain the same) ...
  useEffect(() => {
    // console.log('Fetching ai models ');
    // if(!user?._id) return;
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
  }, [isUserLogin]);




  useEffect(() => {
    if(userReceipts){
      setSpendingTrend(calculateMonthlyTrendClientSide(userReceipts, new Date().getFullYear()))
    }
  }, [userReceipts])


  useEffect(() => {
    if (!user?._id) return;

  const fetchActiveModel = async () => {
    
    try {
      const res = await fetch(`http://localhost:3000/extract/getUserModel?userId=${user._id}`);
      const data = await res.json();
      if (data.success) {
        setActiveModelName(data.model_name);
      }

      if(!res.ok) {
        setActiveModelName("kwaipilot/kat-coder-pro:free");
      }
    } catch (err) {
      console.error("Error No active model status");
    }
  };

  fetchActiveModel();
}, [user]);

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
    if (categorySpent) {
      console.log("categorySpent ::", categorySpent);
    }
  }, [categorySpent]);

  useEffect(() => {
    if (!user) return;
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
      // console.log('total budget ::', totalBudget, ' type --> ', typeof totalBudget);
      // console.log('total spent ::', totalSpent, ' type --> ', typeof totalSpent);

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
    if(!user?._id) return;
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
    if(!user?._id) return;

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
        setTotalIncome(getTotalIncome(sanitizedReceipts));

        setMonthlyExpenses(getMonthlyExpenses(sanitizedReceipts));
        setMonthlyIncome(getMonthlyIncome(sanitizedReceipts));
        setRecentTransaction(getRecentTransaction(sanitizedReceipts));
        try {
          setPreviousExpense(
            getPreviousMonthlyExpensesOrIncome(sanitizedReceipts, "Expense")
          );
          setPreviousIncome(
            getPreviousMonthlyExpensesOrIncome(sanitizedReceipts, "Income")
          );
          setTransactionFlow(convertToInitialTransactions(sanitizedReceipts));
          setCategorySpent(calculateBudgetSpending(budgetList, sanitizedReceipts)); // integrate the calculateBudgetSpending
          console.log("Metrics this week :: ", getMetrics(sanitizedReceipts, 'quarter'));
          setMetricsAnalytic({info : sanitizedReceipts});
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





  // Session Verification


  useEffect(() => {
    console.log("Activiated the verify session ");
    if(!isUserLogin) return;
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
  }, [isUserLogin, refreshPage]);







  const value = useMemo(
    () => ({
      user,
      refreshPage,
      userReceipts,
      metricsAnalytic,
      getMetrics,

      transformInsights,
      categoryInsights,
      categorySummaries,

      activeModelName,
      spendingTrend,
      totalBudget,
      categorySpent,
      transactionFlow,
      previousIncome,
      previousExpense,
      recentTransaction,
      totalSpent,
      totalIncome,
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
      metricsAnalytic,
      spendingTrend,
      
      transformInsights,
      categoryInsights,
      categorySummaries,

      
      activeModelName,
      refreshPage,
      monthlyExpenses,
      getMetrics,
      totalIncome,
      categorySpent,
      transactionFlow,
      previousIncome,
      recentTransaction,
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
