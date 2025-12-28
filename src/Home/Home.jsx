import { useEffect, useState } from "react";
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

import { useAuth } from "@/context/AuthContext";
import TransactionDashboardSkeleton from "@/components/loaders/HomeSkeletonLoader";
import { DeleteAlert } from "@/components/DeleteAlert";

// --- ORGANIC DATA & HELPERS ---

const stats = [
  {
    title: "Total Balance",
    value: "$24,580.00",
    change: "+12.5%",
    isPositive: true,
    icon: Wallet,
    color: "emerald",
  },
  {
    title: "Monthly Income",
    value: "$8,420.00",
    change: "+8.2%",
    isPositive: true,
    icon: TrendingUp,
    color: "emerald",
  },
  {
    title: "Monthly Expenses",
    value: "$5,230.00",
    change: "-3.1%",
    isPositive: true,
    icon: TrendingDown,
    color: "orange",
  },
  {
    title: "Savings Goal",
    value: "68%",
    change: "Target: $10k",
    isPositive: true,
    icon: PieChart,
    color: "blue",
  },
];

const budgetCategories = [
  { name: "Food & Dining", spent: 450, budget: 600, color: "bg-emerald-500" },
  { name: "Transportation", spent: 180, budget: 300, color: "bg-sky-500" },
  { name: "Entertainment", spent: 95, budget: 150, color: "bg-purple-500" },
  { name: "Shopping", spent: 320, budget: 400, color: "bg-orange-500" },
];

const getColorClass = (color, type = "bg") => {
  const colors = {
    // Adjusted text colors for better dark mode visibility (lighter shade 300/400 for dark mode)
    emerald: type === "bg" ? "bg-emerald-100 dark:bg-emerald-900/30" : "text-emerald-700 dark:text-emerald-400",
    blue: type === "bg" ? "bg-sky-100 dark:bg-sky-900/30" : "text-sky-700 dark:text-sky-400",
    orange: type === "bg" ? "bg-orange-100 dark:bg-orange-900/30" : "text-orange-700 dark:text-orange-400",
    purple: type === "bg" ? "bg-purple-100 dark:bg-purple-900/30" : "text-purple-700 dark:text-purple-400",
  };
  return colors[color] || "";
};

const CurrencySign = ({currency, total}) => {
  return (
    <span className="inline-flex items-center gap-0.5 font-bold"> 
      {currency === "USD" ? <DollarSign size={12} strokeWidth={3} /> : <PhilippinePeso size={12} strokeWidth={3} />}
      <span>{typeof total === 'number' ? total.toLocaleString() : total}</span>
    </span>
  )
}

// --- CUSTOM COMPONENT: ORGANIC CARD ---
// Added dark mode classes for glassmorphism
const PebbleCard = ({ children, className = "" }) => (
  <div className={`bg-white/60 dark:bg-stone-900/60 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden transition-all duration-300 ${className}`}>
    {children}
  </div>
);

export function Home({
  sidebarOpen,
  setSidebarOpen,
  handleBellClick,
  isAddDialogOpen,
  setIsAddDialogOpen
}) {

  const [transactions, setTransactions] = useState([
    { id: 1, name: "Grocery Store", amount: 125.5, category: "Food", date: "2024-12-01", type: "expense", notes: "Weekly groceries" },
    { id: 2, name: "Salary Deposit", amount: 4200, category: "Income", date: "2024-12-01", type: "income", notes: "Monthly salary" },
    { id: 3, name: "Netflix", amount: 15.99, category: "Entertainment", date: "2024-11-30", type: "expense", notes: "Subscription" },
    { id: 4, name: "Electric Bill", amount: 89.0, category: "Utilities", date: "2024-11-29", type: "expense", notes: "November bill" },
    { id: 5, name: "Freelance Project", amount: 850.0, category: "Income", date: "2024-11-28", type: "income", notes: "Web design" },
  ]);

  const [userReceipts, setUserReceipts] = useState(null);
  const [isReceiptsLoading, setIsReceiptsLoading] = useState(false);
  const { user, refreshPage, setRefreshPage }  = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // ... (Your existing getReceiptType and useEffect logic remains unchanged) ...
  // For brevity, assuming helper functions exist here as in your snippet
  const getReceiptType = (data) => {
      try {
        const manualList = [];
        const smartList = data.contents.map((res, index) => {
            if (!Array.isArray(res)) {
              return res;
            }
            manualList.push(res);
            return null;
          }).filter((remain) => remain !== null);
  
        return {
          manualList: manualList.flat(),
          smartList,
        };
      } catch (err) {
        console.log("Unable to process the type of receipt" + err);
        return {manualList : [], smartList : []}
      }
    };
  
    useEffect(() => {
      const getUserReceipts = async () => {
        try {
          setIsReceiptsLoading(true);
          const receipts = await fetch("http://localhost:3000/user/receipts", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ userId: user?._id }),
          });
          const data = await receipts.json();
          const receiptTypeInteg = getReceiptType(data);
          setUserReceipts(receiptTypeInteg);
          setIsReceiptsLoading(false);
        } catch (err) {
          console.error("Unable to get receipts");
        }
      };
      if(user?._id) getUserReceipts();
      setRefreshPage(false);
    }, [user?._id, refreshPage]);

    const handleDeleteReceipts = async (id, type) => {
      try {
        await fetch(`http://localhost:3000/receipt/delete?id=${id}&type=${type}`,{
         method : "DELETE"
        });
        setRefreshPage(true);
      } catch(err){
        console.error('Unable to delete', err);
      } 
    }

  if(isReceiptsLoading) {
    return <TransactionDashboardSkeleton/>
  }

  return (
    // MAIN BACKGROUND
    // Light: Warm bone (#f2f0e9) | Dark: Deep Stone (#0c0a09)
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 min-h-screen bg-[#f2f0e9] dark:bg-stone-950 relative transition-colors duration-300">
       
       {/* Decorative Background Blobs - Lower opacity for dark mode */}
       <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-100 dark:bg-emerald-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[90px] opacity-60 dark:opacity-30 pointer-events-none animate-pulse"></div>
       <div className="absolute top-[20%] right-0 w-[400px] h-[400px] bg-orange-100 dark:bg-orange-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[90px] opacity-60 dark:opacity-30 pointer-events-none"></div>

       <div className="relative z-10 space-y-8">
        {/* Welcome Section */}
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
                  <div
                    className={`${getColorClass(
                      stat.color,
                      "bg"
                    )} p-3 rounded-2xl shadow-sm`}
                  >
                    <stat.icon
                      className={`w-6 h-6 ${getColorClass(stat.color, "text")}`}
                    />
                  </div>
                </div>
              </CardContent>
            </PebbleCard>
          ))}
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="bg-white/40 dark:bg-stone-900/40 border border-white/50 dark:border-white/10 backdrop-blur-md p-1.5 rounded-full inline-flex h-auto">
            {['transactions', 'overview', 'budgets'].map(val => (
                <TabsTrigger 
                    key={val}
                    value={val} 
                    className="rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 data-[state=active]:bg-emerald-700 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                >
                    {val}
                </TabsTrigger>
            ))}
          </TabsList>

          {/* ================= TRANSACTIONS TAB ================= */}
          <TabsContent value="transactions" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-serif text-stone-800 dark:text-stone-100">
                  Recent Activity
                </h2>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Your financial footprint.
                </p>
              </div>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="rounded-full bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/10 px-6 h-11"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
            </div>

            {/* Transaction Cards */}
            {(userReceipts?.smartList.length === 0 && userReceipts?.manualList.length === 0 ) ? (
              <PebbleCard className="bg-white/40 dark:bg-stone-900/40">
                <CardContent className="p-12">
                  <div className="text-center text-stone-400 dark:text-stone-500">
                    <div className="bg-white dark:bg-stone-800 p-4 rounded-full inline-flex mb-4 shadow-sm">
                        <Receipt className="w-8 h-8 text-stone-300 dark:text-stone-600" />
                    </div>
                    <p className="font-serif text-lg text-stone-600 dark:text-stone-300">No transactions found</p>
                    <p className="text-sm mt-1">
                      Start by scanning a receipt or adding an expense manually.
                    </p>
                  </div>
                </CardContent>
              </PebbleCard>
            ) : (
           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
               {/* SMART LIST (SCANNED) */}
               {userReceipts?.smartList &&
                 userReceipts?.smartList.map((transaction) => {
      const meta = transaction.metadata || {};
      const displayImage = meta.image || "https://logos-world.net/wp-content/uploads/2021/08/7-Eleven-Logo.jpg";
      
      return (
        <div
          key={transaction._id || transaction.transaction?.transaction_number}
          // Dark mode: bg-stone-800/40, border-stone-700
          className="group relative bg-white/70 dark:bg-stone-800/40 backdrop-blur-sm border border-white dark:border-stone-700 rounded-[2rem] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
        >
          <div className="p-2 pb-0">
              {/* IMAGE SECTION */}
              <div className="h-32 w-full overflow-hidden relative shrink-0 rounded-[1.5rem]">
                <img
                  src={meta.image_source || displayImage}
                  alt={displayImage || "Store"}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* FLOATING AMOUNT */}
                <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-stone-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm text-stone-800 dark:text-stone-100">
                   <p> {transaction?.metadata?.currency && <CurrencySign currency={transaction?.metadata?.currency} total={(transaction.total || transaction.subtotal) || 0}/>}</p>
                </div>
              </div>
          </div>

          {/* CONTENT SECTION */}
          <div className="p-4 flex flex-col flex-grow justify-between gap-2">
            <div>
              <p className="font-serif text-stone-900 dark:text-stone-100 text-lg leading-tight line-clamp-2">
                {transaction.store || "Unknown Store"}
              </p>

              <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-stone-400 dark:text-stone-500 mt-1 font-bold">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">
                  {meta.datetime ? new Date(meta.datetime).toLocaleDateString() : transaction.createdAt.split('T')[0]}
                </span>
              </div>

              {/* TAGS */}
              <div className="mt-3 flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-[10px] px-2 py-0.5 h-auto bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 rounded-md">
                  {meta.category || "General"}
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
               {/* Smart Icon Indicator */}
               <div className="bg-emerald-50 dark:bg-emerald-900/20 p-1.5 rounded-full text-emerald-600 dark:text-emerald-400">
                   <Sparkles className="w-3 h-3" />
               </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-full text-stone-400 dark:text-stone-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  <Edit className="w-3 h-3" />
                </Button>

                 <DeleteAlert 
                 onDelete={() => handleDeleteReceipts(transaction._id, "smart")}
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

               {/* MANUAL LIST */}
               {userReceipts?.manualList &&
               userReceipts.manualList.map((transaction, index) => {
      const amountValue = parseFloat(transaction.amount || 0);
      const isIncome = transaction.transaction_type?.toLowerCase() === "income";

      return (
        <div
          key={index}
          className="group relative bg-white/70 dark:bg-stone-800/40 backdrop-blur-sm border border-white dark:border-stone-700 rounded-[2rem] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
        >
          <div className="p-2 pb-0">
             {/* IMAGE PLACEHOLDER FOR MANUAL */}
             <div className="h-32 w-full overflow-hidden relative shrink-0 rounded-[1.5rem] bg-stone-100 dark:bg-stone-900 flex items-center justify-center">
                <div className="text-stone-300 dark:text-stone-700">
                    <Receipt className="w-12 h-12" />
                </div>
                <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-stone-800/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm text-stone-800 dark:text-stone-100">
                    <p> {transaction?.currency && <CurrencySign currency={transaction?.currency} total={amountValue || 0}/>}</p>
                </div>
             </div>
          </div>

          <div className="p-4 flex flex-col flex-grow justify-between gap-2">
            <div>
              <p className="font-serif text-stone-900 dark:text-stone-100 text-lg leading-tight line-clamp-2">
                {transaction.description || "Manual Entry"}
              </p>

              <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-stone-400 dark:text-stone-500 mt-1 font-bold">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">
                  {transaction.date || new Date(transaction.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-[10px] px-2 py-0.5 h-auto bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 rounded-md">
                  {transaction.category || "General"}
                </Badge>

                <Badge
                  className={`text-[10px] px-2 py-0.5 h-auto rounded-md shadow-none ${
                    isIncome
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                      : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                  }`}
                >
                  {transaction.transaction_type || "Expense"}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-2 border-t border-stone-100/50 dark:border-stone-700/50">
               <div className="bg-stone-100 dark:bg-stone-800 p-1.5 rounded-full text-stone-500 dark:text-stone-400">
                   <Edit className="w-3 h-3" />
               </div>

              <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-full text-stone-400 dark:text-stone-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  <Edit className="w-3 h-3" />
                </Button>

                 <DeleteAlert 
                 onDelete={() => handleDeleteReceipts(transaction._id, "manual")} 
                 itemName={transaction.description}
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

          {/* ================= OVERVIEW TAB ================= */}
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
                    {transactions.slice(0, 5).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-2xl ${
                              transaction.type === "income"
                                ? "bg-emerald-100 dark:bg-emerald-900/30"
                                : "bg-orange-100 dark:bg-orange-900/30"
                            }`}
                          >
                            {transaction.type === "income" ? (
                              <ArrowUpRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <ArrowDownRight className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-stone-800 dark:text-stone-100">
                              {transaction.name}
                            </p>
                            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                              {transaction.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold ${
                              transaction.type === "income"
                                ? "text-emerald-700 dark:text-emerald-400"
                                : "text-stone-800 dark:text-stone-100"
                            }`}
                          >
                            ${transaction.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-stone-400 dark:text-stone-500 font-bold uppercase tracking-wider">
                            {transaction.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </PebbleCard>

              {/* Budget Progress Card */}
              <PebbleCard className="bg-white/70 dark:bg-stone-900/70">
                <CardHeader>
                  <CardTitle className="font-serif text-stone-800 dark:text-stone-100">Budget Overview</CardTitle>
                  <CardDescription className="text-stone-500 dark:text-stone-400">
                    Track your spending by category
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {budgetCategories.map((category, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-stone-700 dark:text-stone-300">
                          {category.name}
                        </span>
                        <span className="text-sm text-stone-500 dark:text-stone-400 font-medium">
                          ${category.spent} <span className="text-stone-300 dark:text-stone-600">/</span> ${category.budget}
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-3 overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-500 ${category.color.replace('bg-', 'bg-')}`} 
                            style={{width: `${(category.spent / category.budget) * 100}%`}}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </PebbleCard>
            </div>
          </TabsContent>

          {/* ================= BUDGETS TAB ================= */}
          <TabsContent value="budgets">
            <PebbleCard className="bg-white/80 dark:bg-stone-900/80">
              <CardHeader>
                <CardTitle className="font-serif text-stone-800 dark:text-stone-100">Budget Management</CardTitle>
                <CardDescription className="text-stone-500 dark:text-stone-400">
                  Set and track your spending limits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {budgetCategories.map((category, idx) => (
                  <div key={idx} className="p-5 bg-white/50 dark:bg-stone-800/40 rounded-[1.5rem] border border-stone-100 dark:border-stone-700">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-stone-800 dark:text-stone-100 text-lg">
                          {category.name}
                        </h4>
                        <p className="text-sm text-stone-500 dark:text-stone-400">
                          ${category.spent} spent of ${category.budget} budget
                        </p>
                      </div>
                      <Badge
                        className={`rounded-full px-3 py-1 ${
                          category.spent > category.budget * 0.9
                            ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                            : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        }`}
                      >
                        {Math.round((category.spent / category.budget) * 100)}%
                      </Badge>
                    </div>
                    <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-3 overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-500 ${category.color}`} 
                            style={{width: `${(category.spent / category.budget) * 100}%`}}
                        />
                    </div>
                  </div>
                ))}
              </CardContent>
            </PebbleCard>
          </TabsContent>
        </Tabs>
       </div>
    </main>
  );
}