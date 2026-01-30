import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  PhilippinePeso,
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Trash2,
  Edit,
  Calendar,
  Receipt,
  Sparkles,
  Leaf
} from "lucide-react";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Cell,
  CartesianGrid
} from "recharts";

import { useAuth } from "@/context/AuthContext";
import TransactionDashboardSkeleton from "@/components/loaders/HomeSkeletonLoader";
import { DeleteAlert } from "@/components/DeleteAlert";
import ReceiptDetailModal from "@/components/ReceiptModal";

// --- ASSETS ---
import food from '../assets/food.png';
import transport from '../assets/transportation.png';
import utilities from '../assets/utilities.png';
import shop from '../assets/shopping.png';
import health from '../assets/healthcare.png';
import income from '../assets/income.jpg';
import general from '../assets/other.png';

// --- ROBUST HELPERS ---

const CHART_COLORS = {
  emerald: "#10b981", // success
  orange: "#f97316",  // warning
  red: "#ef4444",     // danger
  stone: "#e7e5e4",   // background budget
  stoneDark: "#44403c" // background budget dark
};
import { BASE_API_URL } from "@/api/getKeys.js";
// const BASE_API_URL  = import.meta.env.VITE_URL_BACKEND || "http://localhost:5173"


const CustomBudgetTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-stone-200 dark:border-stone-700 p-4 rounded-xl shadow-xl">
        <p className="font-serif text-stone-800 dark:text-stone-100 font-bold mb-2">{label}</p>
        
        {/* Spent */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].color }} />
          <span className="text-stone-500 dark:text-stone-400">Spent:</span>
          <span className="text-stone-800 dark:text-stone-200">₱{data.spent.toLocaleString()}</span>
        </div>

        {/* Budget */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          <div className="w-2 h-2 rounded-full bg-stone-300 dark:bg-stone-600" />
          <span className="text-stone-500 dark:text-stone-400">Budget:</span>
          <span className="text-stone-800 dark:text-stone-200">₱{data.budget.toLocaleString()}</span>
        </div>
        
        {/* Utilization */}
        <div className="mt-2 pt-2 border-t border-stone-200 dark:border-stone-700">
           <span className={`${data.usagePercent > 100 ? "text-red-500" : "text-emerald-500"} font-bold text-xs`}>
             {Math.round(data.usagePercent)}% Utilized
           </span>
        </div>
      </div>
    );
  }
  return null;
};

// 1. Safe Category Extractor (Checks Root -> Item Category -> Item Type)
const getTxnCategory = (t) => {
  if (!t) return "General";
  
  // 1. Check Root level
  if (t.category) return t.category;
  
  // 2. Check Items array
  if (t.items && t.items.length > 0) {
      if (t.items[0].category) return t.items[0].category;
      if (t.items[0].type) return t.items[0].type; // Added check for 'type'
  }
  
  return "General";
};

const getImageCategory = (category) => {
  switch(category?.toLowerCase()) {
    case "food" : return food;
    case "groceries": return food; // Added alias
    case "transportation" : return transport;
    case "utilities" : return utilities;
    case "shopping" : return shop;
    case "healthcare" : return health;
    case "income" : return income;
    default : return general;
  }
}

const getCategory = (transaction) => {
   try {
    return getImageCategory(getTxnCategory(transaction));
   } catch(err) {
    return general;
   }
}

const getColorClass = (color, type = "bg") => {
  const colors = {
    emerald: type === "bg" ? "bg-emerald-100 dark:bg-emerald-900/30" : "text-emerald-700 dark:text-emerald-400",
    blue: type === "bg" ? "bg-sky-100 dark:bg-sky-900/30" : "text-sky-700 dark:text-sky-400",
    orange: type === "bg" ? "bg-orange-100 dark:bg-orange-900/30" : "text-orange-700 dark:text-orange-400",
    purple: type === "bg" ? "bg-purple-100 dark:bg-purple-900/30" : "text-purple-700 dark:text-purple-400",
    red: type === "bg" ? "bg-red-100 dark:bg-red-900/30" : "text-red-700 dark:text-red-400",
  };
  return colors[color] || colors.emerald;
};

const CurrencySign = ({currency, total}) => {
  const val = typeof total === 'string' ? parseFloat(total) : total;
  return (
    <span className="inline-flex items-center gap-0.5 font-bold"> 
      {currency === "USD" ? <DollarSign size={12} strokeWidth={3} /> : <PhilippinePeso size={12} strokeWidth={3} />}
      <span>{val ? val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : "0.00"}</span>
    </span>
  )
}

const PebbleCard = ({ children, className = "" }) => (
  <div className={`bg-white/60 dark:bg-stone-900/60 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden transition-all duration-300 ${className}`}>
    {children}
  </div>
);

function getCurrencySymbol(currencyCode) {
  try {
    const formatter = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'narrowSymbol' // 'narrowSymbol' gives '$' instead of 'US$'
    });
    
    return formatter.formatToParts(0).find(part => part.type === 'currency').value;
  } catch (e) {
    console.error(`Invalid currency code: ${currencyCode}`);
    return undefined; // or return currencyCode if you prefer
  }
}

export function Home() {
  const [transactions, setTransactions] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const { 
    user, 
    setRefreshPage, 
    userReceipts, 
    isReceiptsLoading, 
    monthlyExpenses,
    monthlyIncome, 
    setIsAddDialogOpen, 
    totalBalance, 
    previousIncome,
    previousExpense, 
    recentTransaction,
    categorySpent // <--- Using the correct list from AuthContext
  }  = useAuth();

  useEffect(() => {
    setTransactions(recentTransaction)
  }, [recentTransaction])

  const handleDeleteReceipts = async (id) => {
      try {
        await fetch(BASE_API_URL + `/receipt/delete?id=${id}`,{
         method : "DELETE"
        });
        setRefreshPage(true);
      } catch(err){
        console.error('Unable to delete', err);
      } 
  }

  useEffect(() => {
    if(user){
      console.log("Currency code :: ", user);
    }
  }, user)




  // --- 1. DYNAMIC BUDGET CALCULATOR (FIXED FOR YOUR JSON) ---
  const processedBudgets = useMemo(() => {
    // Safety check
    if (!categorySpent || categorySpent.length === 0) return [];

    return categorySpent.map(budget => {
      // 1. Determine the target category name to match against
      const targetCategory = budget.category || "General";

      // 2. Calculate Spent by filtering Receipts
      const calculatedSpent = userReceipts?.reduce((acc, t) => {
        // Safe extraction of receipt category
        const receiptCategory = getTxnCategory(t);
        
        // Match logic (Case Insensitive)
        const isMatch = receiptCategory.toLowerCase() === targetCategory.toLowerCase();
        
        // Ensure it's an expense
        const type = t.metadata?.type || t.type || 'expense';
        const isExpense = type === 'expense';

        if (isMatch && isExpense) {
           // Force convert to number
           const val = parseFloat(t.total || t.subtotal || 0);
           return acc + (isNaN(val) ? 0 : val);
        }
        return acc;
      }, 0) || 0;

      // 3. Use backend 'spent' if available (not null), otherwise use calculated
      const finalSpent = (budget.spent !== null && budget.spent !== undefined) ? budget.spent : calculatedSpent;

      // 4. Calculate Usage
      const budgetLimit = budget.budgetAmount || 0;
      const usage = budgetLimit > 0 ? (finalSpent / budgetLimit) : 0;
      
      // 5. Determine Color Status (Green -> Orange -> Red)
      let statusColor = "bg-emerald-500"; 
      if (usage > 0.8) statusColor = "bg-orange-500"; 
      if (usage > 1.0) statusColor = "bg-red-500"; 

      return {
        name: budget.budgetName || budget.category, // Use the nice name ("Pang araw...") if available
        categoryTag: budget.category,
        spent: finalSpent,
        budget: budgetLimit,
        color: statusColor, // Logic based color for progress bar
        userColor: budget.color, // Your JSON hex color (can be used for text/badges if needed)
        usagePercent: usage * 100
      };
    });
  }, [categorySpent, userReceipts]);


  const savingsMetrics = useMemo(() => {
    if (!categorySpent) return { percent: 0, target: 0, current: 0 };
    // Assuming savings are budget items with a specific flag or category 'Savings'
    // Adjust this filter based on your data if you have a specific 'Savings' type
    const savingsGoals = categorySpent.filter(b => b.category?.toLowerCase() === 'savings');
    
    const totalTarget = savingsGoals.reduce((acc, curr) => acc + (curr.budgetAmount || 0), 0);
    const currentSaved = savingsGoals.reduce((acc, curr) => acc + (curr.spent || 0), 0); // Or calculated spent
    const percent = totalTarget > 0 ? (currentSaved / totalTarget) * 100 : 0;
    
    return { percent: Math.round(percent), target: totalTarget, current: currentSaved };
  }, [categorySpent]);

  // --- 3. CALCULATE BALANCE GROWTH ---
  const balanceGrowth = useMemo(() => {
    const netIncomeThisMonth = (monthlyIncome || 0) - (monthlyExpenses || 0);
    const previousBalanceEstimate = (totalBalance || 0) - netIncomeThisMonth;
    let growthPercent = 0;
    if (previousBalanceEstimate !== 0) {
        growthPercent = ((netIncomeThisMonth) / Math.abs(previousBalanceEstimate)) * 100;
    } else if (netIncomeThisMonth > 0) {
        growthPercent = 100;
    }
    return {
        value: growthPercent.toFixed(1),
        isPositive: netIncomeThisMonth >= 0
    };
  }, [totalBalance, monthlyIncome, monthlyExpenses]);


  // --- 4. STATS ARRAY ---
  const stats = [
    {
      title: "Total Balance",
      value: getCurrencySymbol(user?.currency) + parseFloat(totalBalance?.toFixed(2) || 0).toLocaleString(),
      change: `${balanceGrowth.isPositive ? "+" : ""}${balanceGrowth.value}%`,
      isPositive: balanceGrowth.isPositive,
      icon: Wallet,
      color: "emerald",
    },
    {
      title: "Monthly Income",
      value: getCurrencySymbol(user?.currency) + parseFloat(monthlyIncome?.toFixed(2) || 0).toLocaleString(),
      change: (previousIncome > 0) 
        ? (((parseFloat(monthlyIncome || 0) - previousIncome ) / previousIncome) * 100).toFixed(1) + "%" 
        : "+100%",
      isPositive: true,
      icon: TrendingUp,
      color: "emerald",
    },
    {
      title: "Monthly Expenses",
      value: getCurrencySymbol(user?.currency) + parseFloat(monthlyExpenses?.toFixed(2) || 0).toLocaleString(),
      change: (previousExpense > 0) 
        ? (((parseFloat(monthlyExpenses || 0) - previousExpense ) / previousExpense) * 100).toFixed(1) + "%" 
        : "+100%",
      isPositive: monthlyExpenses < previousExpense,
      icon: TrendingDown,
      color: "orange",
    },
    {
      title: "Savings Goal",
      value: `${savingsMetrics.percent}%`,
      change: `Target: ${ getCurrencySymbol(user?.currency) + (savingsMetrics.target / 1000).toFixed(1)}`, 
      isPositive: savingsMetrics.percent > 0,
      icon: PieChart,
      color: savingsMetrics.percent >= 100 ? "emerald" : "blue",
    },
  ];

  if(isReceiptsLoading) {
    return <TransactionDashboardSkeleton/>
  }

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 space-y-8 min-h-screen bg-[#f2f0e9] dark:bg-stone-950 relative transition-colors duration-300 w-full">
       
       {/* Background Effects */}
       <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-100 dark:bg-emerald-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[90px] opacity-60 dark:opacity-30 pointer-events-none animate-pulse"></div>
       <div className="absolute top-[20%] right-0 w-[400px] h-[400px] bg-orange-100 dark:bg-orange-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[90px] opacity-60 dark:opacity-30 pointer-events-none"></div>

       <div className="relative z-10 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/40 dark:bg-stone-800/40 border border-white/60 dark:border-white/10 backdrop-blur-md mb-3 shadow-sm">
                <Leaf className="h-3 w-3 text-emerald-700 dark:text-emerald-400" />
                <span className="text-[10px] uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">Financial Health</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif italic text-stone-800 dark:text-stone-100 transition-colors">
              Welcome back, {user?.nickname}
            </h1>
            <p className="text-stone-500 dark:text-stone-400 mt-2 font-medium">
              Here's the rhythm of your finances today.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <PebbleCard key={idx} className="hover:bg-white/80 dark:hover:bg-stone-800/60">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">{stat.title}</p>
                    <h3 className="text-2xl font-serif text-stone-800 dark:text-stone-100 mb-2">
                      {stat.value}
                    </h3>
                    <div className="flex items-center gap-1">
                      {stat.isPositive ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          stat.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-orange-600 dark:text-orange-400"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`${getColorClass(stat.color, "bg")} p-3 rounded-2xl shadow-sm`}>
                    <stat.icon className={`w-6 h-6 ${getColorClass(stat.color, "text")}`}/>
                  </div>
                </div>
              </CardContent>
            </PebbleCard>
          ))}
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="transactions" className="space-y-6">
<TabsList className="
    w-full flex items-center justify-between
    bg-white/40 dark:bg-stone-900/40 
    border border-white/50 dark:border-white/10 
    backdrop-blur-md 
    p-1 sm:p-1.5 rounded-full h-auto
">
    {['transactions', 'overview', 'budgets'].map(val => (
        <TabsTrigger 
            key={val}
            value={val} 
            className="
                flex-1 w-full
                rounded-full 
                py-2 sm:py-2.5 
                text-[10px] sm:text-xs font-bold uppercase tracking-wider 
                text-stone-500 dark:text-stone-400 
                data-[state=active]:bg-emerald-700 
                data-[state=active]:text-white 
                data-[state=active]:shadow-md 
                transition-all
                truncate
            "
        >
            {val}
        </TabsTrigger>
    ))}
</TabsList>
          
          {/* 1. TRANSACTIONS TAB */}
          <TabsContent value="transactions" className="space-y-6">
             <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-serif text-stone-800 dark:text-stone-100">Recent Activity</h2>
                <p className="text-sm text-stone-500 dark:text-stone-400">Your financial footprint.</p>
              </div>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="rounded-full bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/10 px-6 h-11"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
            </div>
            
             {(userReceipts?.length === 0 ) ? (
              <PebbleCard className="bg-white/40 dark:bg-stone-900/40">
                <CardContent className="p-12">
                  <div className="text-center text-stone-400 dark:text-stone-500">
                    <div className="bg-white dark:bg-stone-800 p-4 rounded-full inline-flex mb-4 shadow-sm">
                        <Receipt className="w-8 h-8 text-stone-300 dark:text-stone-600" />
                    </div>
                    <p className="font-serif text-lg text-stone-600 dark:text-stone-300">No transactions found</p>
                    <p className="text-sm mt-1">Start by scanning a receipt or adding an expense manually.</p>
                  </div>
                </CardContent>
              </PebbleCard>
            ) : (
           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
               {userReceipts?.length > 0 && userReceipts?.map((transaction) => {
                  const meta = transaction.metadata || {}; 
                  const displayImage = meta.image_source || getCategory(transaction || []);
      
                  return (
                    <div
                      key={transaction._id || transaction.transaction?.transaction_number}
                      className="group relative bg-white/70 dark:bg-stone-800/40 backdrop-blur-sm border border-white dark:border-stone-700 rounded-[2rem] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                    >
                      <div className="p-5 pb-0" onClick={() => setSelectedReceipt(transaction)}>
                        {/* IMAGE SECTION */}
                        <div className="h-32 w-full overflow-hidden relative shrink-0 rounded-[1.5rem]">
                            <img
                              src={meta.image_source || displayImage}
                              alt={displayImage || "Store"}
                              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-stone-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm text-stone-800 dark:text-stone-100">
                               <p> {transaction?.metadata?.currency && <CurrencySign currency={transaction?.metadata?.currency} total={(transaction.total || transaction.subtotal) || 0}/>}</p>
                            </div>
                        </div>
                      </div>

                      {/* CONTENT SECTION */}
                      <div className="p-4 flex flex-col flex-grow justify-between gap-2">
                        <div>
                          <p className="font-serif text-stone-900 dark:text-stone-100 text-lg leading-tight line-clamp-2">
                            {transaction.store || transaction.name || "Unknown Store"}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-stone-400 dark:text-stone-500 mt-1 font-bold">
                            <Calendar className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">
                              {meta.datetime ? new Date(meta.datetime).toLocaleDateString() : transaction.createdAt?.split('T')[0]}
                            </span>
                          </div>
                          {/* TAGS */}
                          <div className="mt-3 flex flex-wrap gap-1">
                            <Badge variant="secondary" className="text-[10px] px-2 py-0.5 h-auto bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 rounded-md">
                              {getTxnCategory(transaction)}
                            </Badge>
                            <Badge
                              className={`text-[10px] px-2 py-0.5 h-auto rounded-md shadow-none ${
                                meta.type === "income"
                                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                  : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                              }`}
                            >
                              {meta.type || "expense"}
                            </Badge>
                          </div>
                        </div>
                        {/* BOTTOM ROW */}
                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-stone-100/50 dark:border-stone-700/50">
                           <div className="bg-emerald-50 dark:bg-emerald-900/20 p-1.5 rounded-full text-emerald-600 dark:text-emerald-400">
                               <Sparkles className="w-3 h-3" />
                           </div>
                           <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                             <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full text-stone-400 dark:text-stone-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                               <Edit className="w-3 h-3" />
                             </Button>
                             <DeleteAlert 
                              onDelete={() => handleDeleteReceipts(transaction._id)}
                              itemName={transaction.store}
                              trigger={
                                 <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full text-stone-400 dark:text-stone-500 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                                     <Trash2 className="w-3 h-3" />
                                 </Button>
                              }
                             />
                           </div>
                        </div>
                        </div>
                      </div>
                  );
               })}
           </div>
           )}
          </TabsContent>

          {/* 2. OVERVIEW TAB - UPDATED */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions Card */}
              <PebbleCard className="bg-white/70 dark:bg-stone-900/70">
                <CardHeader>
                  <CardTitle className="font-serif text-stone-800 dark:text-stone-100">Recent Transactions</CardTitle>
                  <CardDescription className="text-stone-500 dark:text-stone-400">
                    Your latest financial activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions?.slice(0, 5).map((transaction) => (
                      <div
                        key={transaction._id}
                        className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-2xl ${
                              transaction.metadata?.type === "income"
                                ? "bg-emerald-100 dark:bg-emerald-900/30"
                                : "bg-orange-100 dark:bg-orange-900/30"
                            }`}
                          >
                            {transaction.metadata?.type === "income" ? (
                              <ArrowUpRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <ArrowDownRight className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-stone-800 dark:text-stone-100">
                              {transaction.store || transaction.name || "Unknown Store"}
                            </p>
                            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                              {getTxnCategory(transaction)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${transaction.metadata?.type === "income" ? "text-emerald-700 dark:text-emerald-400" : "text-stone-800 dark:text-stone-100"}`}>
                            ${transaction.total || transaction.subtotal}
                          </p>
                          <p className="text-xs text-stone-400 dark:text-stone-500 font-bold uppercase tracking-wider">
                             {new Date(transaction.metadata?.datetime || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </PebbleCard>

              {/* Budget Progress Card - UPDATED WITH JSON ALIGNMENT */}
              <PebbleCard className="bg-white/70 dark:bg-stone-900/70">
                <CardHeader>
                  <CardTitle className="font-serif text-stone-800 dark:text-stone-100">Budget Overview</CardTitle>
                  <CardDescription className="text-stone-500 dark:text-stone-400">
                    Track your spending by category
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {processedBudgets.length > 0 ? (
                    processedBudgets.map((category, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-stone-700 dark:text-stone-300">
                          {category.name}
                        </span>
                        <span className="text-sm text-stone-500 dark:text-stone-400 font-medium">
                          ₱{category.spent.toLocaleString()} <span className="text-stone-300 dark:text-stone-600">/</span> ₱{category.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-3 overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-500 ${category.color}`} 
                            style={{width: `${Math.min(category.usagePercent, 100)}%`}}
                        />
                      </div>
                    </div>
                  ))) : (
                    <p className="text-sm text-stone-500">No budgets set yet.</p>
                  )}
                </CardContent>
              </PebbleCard>
            </div>
          </TabsContent>

          {/* 3. BUDGETS TAB - UPDATED WITH JSON ALIGNMENT */}
        {/* 3. BUDGETS TAB - UPDATED WITH CHART */}
<TabsContent value="budgets" className="space-y-6">
  
  {/* NEW: Budget Analytics Chart */}
  <PebbleCard className="bg-white/80 dark:bg-stone-900/80">
    <CardHeader>
      <CardTitle className="font-serif text-stone-800 dark:text-stone-100">Budget Analytics</CardTitle>
      <CardDescription className="text-stone-500 dark:text-stone-400">
        Visual comparison of limits vs. actuals
      </CardDescription>
    </CardHeader>
    <CardContent className="h-[300px] w-full pt-2">
      {processedBudgets.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={processedBudgets}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            barSize={30}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#a8a29e" opacity={0.2} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#78716c', fontSize: 11, fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#78716c', fontSize: 11 }}
              tickFormatter={(value) => `₱${value/1000}k`} 
            />
            <RechartsTooltip content={<CustomBudgetTooltip />} cursor={{fill: 'transparent'}} />
            
            {/* Bar 1: The Budget Limit (Background Bar) */}
            {/* We stack them on top of each other using the same xAxisId/yAxisId if we want them behind, 
                but for side-by-side comparison, we remove stackId. 
                Here, I'll put the Budget as a ghost bar behind the Spent bar for a "Fill" effect.
            */}
            
            <Bar dataKey="budget" fill={CHART_COLORS.stone} radius={[8, 8, 8, 8]} xAxisId="0" />
            
            {/* Bar 2: The Actual Spend (Foreground Bar) */}
            <Bar dataKey="spent" radius={[8, 8, 8, 8]} xAxisId="0">
              {processedBudgets.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={
                    entry.usagePercent > 100 ? CHART_COLORS.red : 
                    entry.usagePercent > 80 ? CHART_COLORS.orange : 
                    CHART_COLORS.emerald
                  } 
                  fillOpacity={0.9}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
         <div className="h-full flex items-center justify-center text-stone-400 text-sm">
           No data to visualize
         </div>
      )}
    </CardContent>
  </PebbleCard>

  {/* Existing Budget List */}
  <PebbleCard className="bg-white/80 dark:bg-stone-900/80">
    <CardHeader>
      <CardTitle className="font-serif text-stone-800 dark:text-stone-100">Budget Details</CardTitle>
      <CardDescription className="text-stone-500 dark:text-stone-400">
        Line item breakdown
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      {processedBudgets.length > 0 ? (
          processedBudgets.map((category, idx) => (
        <div key={idx} className="p-5 bg-white/50 dark:bg-stone-800/40 rounded-[1.5rem] border border-stone-100 dark:border-stone-700 transition-all hover:bg-white dark:hover:bg-stone-800/60">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-bold text-stone-800 dark:text-stone-100 text-lg">
                {category.name}
              </h4>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                ₱{category.spent.toLocaleString()} spent of ₱{category.budget.toLocaleString()} budget
              </p>
            </div>
            <Badge
              className={`rounded-full px-3 py-1 ${
                category.usagePercent > 90
                  ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                  : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
              }`}
            >
              {Math.round(category.usagePercent)}%
            </Badge>
          </div>
          <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-3 overflow-hidden">
              <div 
                  className={`h-full rounded-full transition-all duration-500 ${category.color}`} 
                  style={{width: `${Math.min(category.usagePercent, 100)}%`}}
              />
          </div>
        </div>
      ))) : (
            <div className="text-center py-10">
              <p className="text-stone-500">No budgets active. Add a category to start tracking.</p>
            </div>
      )}
    </CardContent>
  </PebbleCard>
</TabsContent>

        </Tabs>
       </div>

    
  
      <ReceiptDetailModal 
          isOpen={!!selectedReceipt}
          onClose ={() => setSelectedReceipt(null)}
          data={selectedReceipt}
          />
    </main>
  );
}