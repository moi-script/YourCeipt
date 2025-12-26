import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Toaster } from "sonner";
// import { toast } from "sonner";

import {
  //   DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  //   CreditCard,
  PieChart,
  //   Settings,
  Bell,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Menu,
  X,
  Trash2,
  Edit,
  Calendar,
  Receipt,
} from "lucide-react";

import { DialogForm } from "@/Input/DialogForm";
import { useAuth } from "@/context/AuthContext";
import TransactionDashboardSkeleton from "@/components/loaders/HomeSkeletonLoader";

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
    color: "blue",
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
    color: "purple",
  },
];

const budgetCategories = [
  { name: "Food & Dining", spent: 450, budget: 600, color: "bg-emerald-500" },
  { name: "Transportation", spent: 180, budget: 300, color: "bg-blue-500" },
  { name: "Entertainment", spent: 95, budget: 150, color: "bg-purple-500" },
  { name: "Shopping", spent: 320, budget: 400, color: "bg-orange-500" },
];

const getColorClass = (color, type = "bg") => {
  const colors = {
    emerald: type === "bg" ? "bg-emerald-100" : "text-emerald-600",
    blue: type === "bg" ? "bg-blue-100" : "text-blue-600",
    orange: type === "bg" ? "bg-orange-100" : "text-orange-600",
    purple: type === "bg" ? "bg-purple-100" : "text-purple-600",
  };
  return colors[color] || "";
};

export function Home({
  sidebarOpen,
  setSidebarOpen,
  handleBellClick,
  isAddDialogOpen,
  setIsAddDialogOpen
}) {

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      name: "Grocery Store",
      amount: 125.5,
      category: "Food",
      date: "2024-12-01",
      type: "expense",
      notes: "Weekly groceries",
    },
    {
      id: 2,
      name: "Salary Deposit",
      amount: 4200,
      category: "Income",
      date: "2024-12-01",
      type: "income",
      notes: "Monthly salary",
    },
    {
      id: 3,
      name: "Netflix",
      amount: 15.99,
      category: "Entertainment",
      date: "2024-11-30",
      type: "expense",
      notes: "Subscription",
    },
    {
      id: 4,
      name: "Electric Bill",
      amount: 89.0,
      category: "Utilities",
      date: "2024-11-29",
      type: "expense",
      notes: "November bill",
    },
    {
      id: 5,
      name: "Freelance Project",
      amount: 850.0,
      category: "Income",
      date: "2024-11-28",
      type: "income",
      notes: "Web design",
    },
    {
      id: 6,
      name: "Gas Station",
      amount: 62.15,
      category: "Transportation",
      date: "2024-12-02",
      type: "expense",
      notes: "Fuel refill",
    },
    {
      id: 7,
      name: "Coffee Shop",
      amount: 8.75,
      category: "Food",
      date: "2024-12-03",
      type: "expense",
      notes: "Morning coffee",
    },
    {
      id: 8,
      name: "Internet Bill",
      amount: 59.99,
      category: "Utilities",
      date: "2024-12-04",
      type: "expense",
      notes: "Monthly internet",
    },
    {
      id: 9,
      name: "Pharmacy Purchase",
      amount: 27.4,
      category: "Healthcare",
      date: "2024-12-05",
      type: "expense",
      notes: "Medicine",
    },
    {
      id: 10,
      name: "Online Store Refund",
      amount: 45.0,
      category: "Income",
      date: "2024-12-06",
      type: "income",
      notes: "Item return refund",
    },
  ]);

  const [userReceipts, setUserReceipts] = useState(null);
  const [isReceiptsLoading, setIsReceiptsLoading] = useState(false);
 
  const { user }  = useAuth();


  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactions.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteTransaction = (id) => {
    if (window.confirm("Delete this transaction?")) {
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

    const getReceiptType = (data) => {
      try {
        const manualList = [];
        const smartList = data.contents.map((res, index) => {
            if (!Array.isArray(res)) {
              // console.log("Object type :: ", res);
              return res;
            }
            manualList.push(res);
            return null;
          }).filter((remain) => remain !== null);
  
        // console.log("Smart list :: ", smartList);
        // console.log("Manual list :: ", manualList.flat());
  
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
        console.log("Running get user receipts user id ::", user);
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
    }, [user._id]);
  

  useEffect(() => {
    console.log('Is receipt loading ::', isReceiptsLoading);
    console.log('Receipt type :: ', userReceipts);
    // setSmartList(userReceipts?.smartList);
    // setManualList(userReceipts?.manualList);

  }, [userReceipts]) 

  if(isReceiptsLoading) {
    return <TransactionDashboardSkeleton/>
  }

  return (
    <>
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user.nickname}
          </h1>
          <p className="text-slate-500 mt-1">
            Here's what's happening with your money today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <Card key={idx} className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {stat.value}
                    </h3>
                    <div className="flex items-center gap-1">
                      {stat.isPositive ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm ${
                          stat.isPositive ? "text-emerald-500" : "text-red-500"
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
                    )} p-3 rounded-xl`}
                  >
                    <stat.icon
                      className={`w-6 h-6 ${getColorClass(stat.color, "text")}`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
          </TabsList>

          {/* ================================================================
                OVERVIEW TAB
                ================================================================ */}

          {/* ================================================================
                TRANSACTIONS TAB
                ================================================================ */}
          <TabsContent value="transactions" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  All Transactions
                </h2>
                <p className="text-sm text-slate-500">
                  Manage your financial activities
                </p>
              </div>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
            </div>

            {/* Transaction Cards */}
            {filteredTransactions.length === 0 ? (
              <Card className="border-slate-200">
                <CardContent className="p-12">
                  <div className="text-center text-slate-500">
                    <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No transactions found</p>
                    <p className="text-sm mt-1">
                      Try adjusting your search or add a new transaction
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
               {userReceipts?.smartList &&
                 userReceipts?.smartList.map((transaction) => {
      // Helper: Access metadata safely
      const meta = transaction.metadata || {};

      // Helper: Determine Image
      const displayImage =
        meta.image ||
        "https://logos-world.net/wp-content/uploads/2021/08/7-Eleven-Logo.jpg";
      
      return (
        <Card
          key={
            transaction._id || transaction.transaction?.transaction_number
          }
          className="group border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
        >
          <CardContent className="p-0 flex flex-col h-full">
            {/* IMAGE SECTION - CHANGED: h-32 instead of aspect-square */}
            <div className="h-32 w-full overflow-hidden relative shrink-0">
              <img
                src={displayImage}
                alt={transaction.store || "Store"}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* FLOATING AMOUNT */}
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-sm font-bold shadow-sm">
                ${transaction.total || 0}
              </div>
            </div>

            {/* CONTENT SECTION - CHANGED: Removed fixed h-[140px] so it grows with text */}
            <div className="relative p-3 flex flex-col flex-grow justify-between gap-3">
              <div>
                {/* STORE NAME - CHANGED: line-clamp-2 so long names wrap instead of cutting off */}
                <p className="font-semibold text-slate-900 text-sm sm:text-base line-clamp-2 leading-tight">
                  {transaction.store || "Unknown Store"}
                </p>

                {/* DATE */}
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">
                    {meta.datetime
                      ? new Date(meta.datetime).toLocaleDateString()
                      : "No Date"}
                  </span>
                </div>

                {/* TAGS */}
                <div className="mt-2 flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-[10px] px-1 h-5">
                    {meta.category || "General"}
                  </Badge>

                  <Badge
                    className={`text-[10px] px-1 h-5 ${
                      meta.type === "income"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {meta.type || "expense"}
                  </Badge>
                </div>

                {/* NOTES */}
                {meta.notes && (
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 break-words">
                    {meta.notes}
                  </p>
                )}
              </div>

              {/* BOTTOM ROW: TYPE & ACTIONS */}
              <div className="flex items-center justify-between mt-auto pt-2">
                <div
                  className={`text-xs font-semibold ${
                    meta.type === "income"
                      ? "text-emerald-600"
                      : "text-slate-800"
                  }`}
                >
                  {meta.type === "income" ? "Income" : "Expense"}
                </div>

                {/* ACTION BUTTONS (Always visible on mobile, hover on desktop) */}
                <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-slate-500 hover:text-blue-600"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-slate-500 hover:text-red-600"
                    onClick={() => deleteTransaction(transaction._id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
                 })}

                 {userReceipts?.manualList &&
               userReceipts.manualList.map((transaction, index) => {
      // 1. Image: ManualScheme doesn't have an image, so we use a static fallback
      const displayImage =
                "https://logos-world.net/wp-content/uploads/2021/08/7-Eleven-Logo.jpg";

      // 2. Amount: Schema defines 'ammount' (typo in schema) as String.
      // We parse it to float to fix decimal points.
      const amountValue = parseFloat(transaction.ammount || 0);

      // 3. Type: Check strictly against your schema field
      const isIncome = transaction.transaction_type?.toLowerCase() === "income";

      return (
        <Card
          key={index}
          className="group border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
        >
          <CardContent className="p-0 flex flex-col h-full">
            {/* IMAGE SECTION (Fixed h-32) */}
            <div className="h-32 w-full overflow-hidden relative shrink-0">
              <img
                src={displayImage}
                alt={transaction.description || "Transaction"}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* FLOATING AMOUNT */}
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-sm font-bold shadow-sm">
                ${amountValue.toFixed(2)}
              </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="relative p-3 flex flex-col flex-grow justify-between gap-3">
              <div>
                {/* DESCRIPTION (Used as Title) */}
                <p className="font-semibold text-slate-900 text-sm sm:text-base line-clamp-2 leading-tight">
                  {transaction.description || "No Description"}
                </p>

                {/* DATE */}
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">
                    {/* Schema 'date' is a String, render directly or format if needed */}
                    {transaction.date || new Date(transaction.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* TAGS */}
                <div className="mt-2 flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-[10px] px-1 h-5">
                    {transaction.category || "General"}
                  </Badge>

                  <Badge
                    className={`text-[10px] px-1 h-5 ${
                      isIncome
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {transaction.transaction_type || "Expense"}
                  </Badge>
                </div>

                {/* NOTES */}
                {transaction.notes && (
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 break-words">
                    {transaction.notes}
                  </p>
                )}
              </div>

              {/* BOTTOM ROW: TYPE & ACTIONS */}
              <div className="flex items-center justify-between mt-auto pt-2">
                <div
                  className={`text-xs font-semibold ${
                    isIncome ? "text-emerald-600" : "text-slate-800"
                  }`}
                >
                  {isIncome ? "Income" : "Expense"}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-slate-500 hover:text-blue-600"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-slate-500 hover:text-red-600"
                    onClick={() => deleteTransaction(transaction._id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
               })}

            </div>

            
            )}
          </TabsContent>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Recent Transactions Card */}
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Your latest financial activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              transaction.type === "income"
                                ? "bg-emerald-100"
                                : "bg-orange-100"
                            }`}
                          >
                            {transaction.type === "income" ? (
                              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4 text-orange-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {transaction.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {transaction.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-semibold ${
                              transaction.type === "income"
                                ? "text-emerald-600"
                                : "text-slate-900"
                            }`}
                          >
                            ${transaction.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {transaction.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Budget Progress Card */}
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Budget Overview</CardTitle>
                  <CardDescription>
                    Track your spending by category
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {budgetCategories.map((category, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-900">
                          {category.name}
                        </span>
                        <span className="text-sm text-slate-500">
                          ${category.spent} / ${category.budget}
                        </span>
                      </div>
                      <Progress
                        value={(category.spent / category.budget) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ================================================================
                BUDGETS TAB
                ================================================================ */}
          <TabsContent value="budgets">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Budget Management</CardTitle>
                <CardDescription>
                  Set and track your spending limits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {budgetCategories.map((category, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {category.name}
                        </h4>
                        <p className="text-sm text-slate-500">
                          ${category.spent} spent of ${category.budget} budget
                        </p>
                      </div>
                      <Badge
                        variant={
                          category.spent > category.budget * 0.9
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {Math.round((category.spent / category.budget) * 100)}%
                      </Badge>
                    </div>
                    <Progress
                      value={(category.spent / category.budget) * 100}
                      className="h-3"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
