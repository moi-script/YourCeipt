import { useState } from "react";
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
  setIsAddDialogOpen,
  isAddDialogOpen
  
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


  return (
    <>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, John! 👋
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
                {filteredTransactions.map((transaction) => (
                  <Card
                    key={transaction.id}
                    className="group border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <CardContent className="p-0">
                      {/* IMAGE */}
                      <div className="aspect-square w-full overflow-hidden relative">
                        <img
                          src={
                            transaction.image ||
                            "https://logos-world.net/wp-content/uploads/2021/08/7-Eleven-Logo.jpg"
                          }
                          alt={transaction.name}
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* FLOATING AMOUNT */}
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-sm font-bold">
                          ${transaction.amount.toFixed(2)}
                        </div>
                      </div>

                      {/* CONTENT */}
                      <div className="relative p-4 flex flex-col justify-between h-[140px]">
                        <div>
                          <p className="font-semibold text-slate-900 truncate">
                            {transaction.name}
                          </p>

                          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>{transaction.date}</span>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-1">
                            <Badge variant="secondary" className="text-[10px]">
                              {transaction.category}
                            </Badge>

                            <Badge
                              className={`text-[10px] ${
                                transaction.type === "income"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {transaction.type}
                            </Badge>
                          </div>

                          {transaction.notes && (
                            <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                              {transaction.notes}
                            </p>
                          )}
                        </div>

                        {/* TYPE LABEL */}
                        <div
                          className={`text-xs font-semibold ${
                            transaction.type === "income"
                              ? "text-emerald-600"
                              : "text-slate-800"
                          }`}
                        >
                          {transaction.type === "income" ? "Income" : "Expense"}
                        </div>

                        {/* ✅ HOVER ACTIONS – FIXED */}
                        <div
                          className="absolute bottom-3 right-3 flex gap-2
      opacity-0 pointer-events-none
      group-hover:opacity-100 group-hover:pointer-events-auto
      transition-all z-20"
                        >
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>

                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            onClick={() => deleteTransaction(transaction.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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

      {/* <DialogForm 
        transactions={transactions}
        setTransactions={setTransactions}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isAddDialogOpen={isAddDialogOpen}
      /> */}

    </>
  );
}
