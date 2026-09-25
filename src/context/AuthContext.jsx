// context/AuthContext.jsx
import {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  createContext,
  useRef,
} from "react";
// import { useNavigate } from "react-router-dom";
import { apiFetch, loginFetch } from "@/api/client";
import { calculateMonthlyTrendClientSide, getCategorySummaries, processBudgetInsights, transformBudgetsToInsights } from "@/api/analyticsAction";
import { CATEGORY_CONFIG, CATEGORY_MAP } from "@/lib/categories";
import { useToast } from "@/components/Toaster";
import { uploadNotification } from "@/api/uploadNotification";
import { setTheme } from "@/lib/theme";
import { loadRates, makeMoney, readCachedRates } from "@/lib/money";
const AuthContext = createContext(null);
import { BASE_API_URL, getAiDefaultModel } from "@/api/getKeys.js"; 

// const BASE_API_URL  = import.meta.env.VITE_URL_BACKEND || "http://localhost:5173"

let globalState = 0;

// Monthly totals. Type is compared case-insensitively ("expense" from the
// manual form, "Expense" from the AI), and totals are parsed as numbers.
const txAmount = (t) => {
  const n = parseFloat(String(t?.total ?? t?.subtotal ?? 0).replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(n) ? n : 0;
};
const txType = (t) => (String(t?.metadata?.type || "").toLowerCase() === "income" ? "income" : "expense");
const sumForMonth = (transactions, type, monthsAgo = 0) => {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  return (transactions || []).reduce((sum, t) => {
    const d = new Date(t?.metadata?.datetime);
    if (Number.isNaN(d.getTime()) || txType(t) !== type) return sum;
    if (d.getFullYear() !== target.getFullYear() || d.getMonth() !== target.getMonth()) return sum;
    return sum + txAmount(t);
  }, 0);
};
const getMonthlyIncome = (transactions) => sumForMonth(transactions, "income");
const getMonthlyExpenses = (transactions) => sumForMonth(transactions, "expense");
const getPreviousMonthlyExpensesOrIncome = (transactions, receiptType) =>
  sumForMonth(transactions, String(receiptType).toLowerCase() === "income" ? "income" : "expense", 1);

const getTotalBalanceBudget = (budgetList) => {
  return budgetList?.reduce((total, value) => {
    return total + value.budgetAmount;
  }, 0);
};




const getTotalExpenses = (transactions) =>
  (transactions || []).filter((t) => txType(t) === "expense").reduce((sum, t) => sum + txAmount(t), 0);

const getTotalIncome = (transactions) =>
  (transactions || []).filter((t) => txType(t) === "income").reduce((sum, t) => sum + txAmount(t), 0);

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

  // console.log("Sorted from three days ago up to now ", simplifiedList);
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

// Budgets are monthly: count this month's expense items per category.
// Category names differ between the manual form ("Food", "Transport") and
// the AI ("Groceries", "Transportation"), so fold the aliases together.
const CATEGORY_ALIAS = { food: "groceries", grocery: "groceries", transport: "transportation", health: "healthcare", general: "other" };
const normCategory = (c) => {
  const k = String(c || "other").toLowerCase().trim();
  return CATEGORY_ALIAS[k] || k;
};

const calculateBudgetSpending = (budgetList, transactions) => {
  if (!budgetList || !transactions) return [];
  const now = new Date();
  const spendingMap = {};

  for (const receipt of transactions) {
    if (!receipt?.items || txType(receipt) !== "expense") continue;
    const d = new Date(receipt.metadata?.datetime);
    if (Number.isNaN(d.getTime()) || d.getFullYear() !== now.getFullYear() || d.getMonth() !== now.getMonth()) continue;

    for (const item of receipt.items) {
      const cost = (parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 1);
      const key = normCategory(item.category);
      spendingMap[key] = (spendingMap[key] || 0) + cost;
    }
  }

  return budgetList.map((budget) => {
    const totalSpent = spendingMap[normCategory(budget.category)] || 0;
    return { ...budget, spent: totalSpent, remaining: budget.budgetAmount - totalSpent };
  });
};

const getTotals = (transactions, type, period, offset = 0) => {
  return transactions
    // Case-insensitive: the manual form saves "expense", the AI saves "Expense".
    .filter(t => txType(t) === type.toLowerCase() && isInTimeframe(t.metadata?.datetime, period, offset))
    .reduce((sum, t) => sum + txAmount(t), 0);
};

const getMetrics = (transactions, period = 'month') => {
  const income = getTotals(transactions, 'Income', period);
  const expenses = getTotals(transactions, 'Expense', period);

  // console.log('Income metrics ::', income, 'type ::', typeof income);
  // console.log('Expense metrics ::', expenses, 'type ::', typeof expenses);

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
   const [notification, setNotification] = useState(null);

   
  const toast = useToast();
  


   useEffect(() => {
    if(transformInsights) {
      // console.log('Transform insights from auth context :: ', transformInsights);
    }
   }, [transformInsights])
    

  const [isUserLogin, setIsUserLogin] = useState(() => {

    const item = localStorage.getItem('user');
    if(item) {
      return true; // needed to update the user
    } 
    return null;
  })





  // fetching user receipt list
  const [models, setModels] = useState(null);

  // Only signed-in users need the model list; the landing page used to
  // fetch it for every visitor.
  useEffect(() => {
    if (!user?._id) return;
    const fetchAi = async () => {
      try {
        setIsModelLoading(true);
        const res = await fetch(BASE_API_URL + "/extract/getModels");
        const data = await res.json();
        setModels(data.models);
      } catch (err) {
        console.error("Unable to fetch ai models");
      } finally {
        setIsModelLoading(false);
      }
    };
    fetchAi();
  }, [user?._id]);




  useEffect(() => {
    if(userReceipts){
      setSpendingTrend(calculateMonthlyTrendClientSide(userReceipts, new Date().getFullYear()))
    }
  }, [userReceipts])


  useEffect(() => {
    if (!user?._id) return;

  const fetchActiveModel = async () => {
    
    try {
      const res = await fetch(BASE_API_URL + `/extract/getUserModel?userId=${user._id}`);
      const data = await res.json();
      // "auto" lets the server pick the fastest working model.
      setActiveModelName(data.success && data.model_name ? data.model_name : getAiDefaultModel());
    } catch (err) {
      console.error("Error No active model status");
      setActiveModelName(getAiDefaultModel());
    }
  };

  fetchActiveModel();
}, [user]);

  useEffect(() => {
    if(monthlyExpenses && monthlyIncome){
    setSavings(getSavings(monthlyIncome, monthlyExpenses));

    }
  }, [monthlyIncome, monthlyExpenses]);


  // Apply the saved theme once it arrives (no crossfade on page load).
  useEffect(() => {
    if (!user?.theme) return;
    setTheme(user.theme === "dark", { animate: false });
  }, [user?.theme]);

  // Display currency: amounts are stored in pesos and converted for display.
  const [fxRates, setFxRates] = useState(() => readCachedRates());
  useEffect(() => {
    if (!user?._id) return;
    loadRates().then(setFxRates);
  }, [user?._id]);
  const money = useMemo(() => makeMoney((user?.currency || "PHP").toUpperCase(), fxRates), [user?.currency, fxRates]);

  // Update the signed-in user locally after a settings change, so every
  // page reflects it without a reload.
  const updateUser = useCallback((patch) => setUser((prev) => (prev ? { ...prev, ...patch } : prev)), []);

  useEffect(() => {
    if (totalBudget && totalSpent) {
      // console.log('total budget ::', totalBudget, ' type --> ', typeof totalBudget);
      // console.log('total spent ::', totalSpent, ' type --> ', typeof totalSpent);

      setTotalBalance(totalBudget - totalSpent);
    }
  }, [totalSpent]);

  // After login/register, re-run the session check so `user` comes from
  // /user/verify (with its _id) and the loading state clears. Without this a
  // first-time visitor sat on the loader until they reloaded the page.
  const markSignedIn = useCallback(() => {
    try { localStorage.setItem('user', true); } catch { /* storage blocked */ }
    setLoading(true);
    setIsUserLogin(true);
    setRefreshPage(true);
  }, []);

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
        const res = await fetch(BASE_API_URL + "/get/budget", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ userId: user?._id }),
        });

        const data = await res.json();
        // console.warn("Budget list after fetch ::", data);
        setBudgetList(data.budgetList);
        setTotalBudget(getTotalBalanceBudget(data.budgetList));
        // console.warn("Budget total with balance  ::", getTotalBalanceBudget(data.budgetList));

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
        const receipts = await fetch(BASE_API_URL + "/user/receipts", {
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

         

          // console.log("Metrics this week :: ", getMetrics(sanitizedReceipts, 'quarter'));
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


  useEffect(() => {
    if(setUserReceipts && budgetList){
          // console.log("Budget list for first render ::", budgetList)
          const budgetSpendedResult = calculateBudgetSpending(budgetList, userReceipts); 

          // console.log('The budget spended result :: ', budgetSpendedResult);
          setCategorySpent(budgetSpendedResult); // integrate the calculateBudgetSpending
          // setTransformInsights(budgetSpendedResult);

          // console.log("Initializing ::", transformBudgetsToInsights(budgetSpendedResult, CATEGORY_MAP))
          setTransformInsights(transformBudgetsToInsights(budgetSpendedResult, CATEGORY_MAP));
          setCategoryInsights(processBudgetInsights(budgetSpendedResult, CATEGORY_CONFIG));
          setCagorySummaries(getCategorySummaries(budgetSpendedResult));
    }
  }, [userReceipts, budgetList])


  useEffect(() => {
   
    const notificationAwareness = async (categorySpent) => {
      await budgetNotification(categorySpent);
    }

     if(categorySpent){
      notificationAwareness(categorySpent);
    }


    // console.log("Category spent value :: ", categorySpent);
  }, [categorySpent])


   useEffect(() => {
    if(user?._id) {
      const getNotification = async () => {
        const res = await fetch(BASE_API_URL + '/notification/get',{
          method : "POST",
          headers : {
            "Content-type" : "application/json"
          }, 
          body : JSON.stringify({userId : user._id})
        })

        const { unreadCount, notifications } = await res.json();

        setNotification({unreadCount, notifications});
      }
      getNotification();
    }
  }, [user])



  // One alert per budget, per kind, per month. The title carries the kind so
  // "near limit" and "over limit" don't block each other.
  const monthKey = () => new Date().toISOString().slice(0, 7);
  const alertTitle = (budgetName, kind) =>
    kind === "over" ? `${budgetName} is over budget` : `${budgetName} is close to its limit`;
  const isNotificationExist = (title) =>
    notification?.notifications.some(
      (n) => n.title === title && String(n.createdAt || "").slice(0, 7) === monthKey()
    );

  const sentNotificationsRef = useRef(new Set());

  // Honors the two switches in Settings. Both default to on.
  const budgetNotification = useCallback(async (categorySpent) => {
    if (!notification || !notification.notifications || !user?._id) return;
    const wantOver = user.overSpending !== false;
    const wantNear = user.nearLimit !== false;

    for (const budget of categorySpent || []) {
      const limit = Number(budget.budgetAmount) || 0;
      if (!limit) continue;
      const ratio = (Number(budget.spent) || 0) / limit;
      const kind = ratio > 1 && wantOver ? "over" : ratio >= 0.85 && ratio <= 1 && wantNear ? "near" : null;
      if (!kind) continue;

      const title = alertTitle(budget.budgetName, kind);
      const key = `${title}:${monthKey()}`;
      if (sentNotificationsRef.current.has(key) || isNotificationExist(title)) continue;
      sentNotificationsRef.current.add(key);

      const used = Math.round(ratio * 100);
      try {
        await uploadNotification({
          userId: user._id,
          title,
          message:
            kind === "over"
              ? `You've spent ${money.format(budget.spent)} of your ${money.format(limit)} ${budget.budgetName} budget (${used}%).`
              : `${used}% of your ${budget.budgetName} budget is used. ${money.format(limit - budget.spent)} left this month.`,
          type: kind === "over" ? "error" : "warning",
        });
        if (kind === "over") toast.error(title, `${used}% of the budget used.`);
        else toast.warning?.(title, `${used}% of the budget used.`);
      } catch (error) {
        sentNotificationsRef.current.delete(key);
        console.error("Failed to upload notification", error);
      }
    }
  }, [notification, user, money]);

useEffect(() => {
    // Only run if we have calculated spending AND we have fetched existing notifications
    if (categorySpent && notification) {
       budgetNotification(categorySpent);
    }
  }, [categorySpent, notification]); // We need to run this when notification loads too


  // Session Verification


  useEffect(() => {
    if(!isUserLogin) return;
    const checkSession = async () => {
      try {
        const response = await apiFetch(BASE_API_URL + "/user/verify", { // BASE_API_URL 
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
      setActiveModelName,
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
      markSignedIn,
      money,
      updateUser,
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
      setActiveModelName,
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
      markSignedIn,
      money,
      updateUser,
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
