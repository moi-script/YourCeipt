import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  Home,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  PieChart,
  Settings,
  Bell,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Menu,
  X,
  Camera,
  Upload,
  FileText,
  Trash2,
  Edit,
  Calendar,
  Receipt,
} from "lucide-react";

export default function BudgetDashboard() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [inputMode, setInputMode] = useState("manual");
  const [quickText, setQuickText] = useState("");

  const [transactions, setTransactions] = useState([
    { id: 1, name: "Grocery Store", amount: 125.5, category: "Food", date: "2024-12-01", type: "expense", notes: "Weekly groceries" },
    { id: 2, name: "Salary Deposit", amount: 4200, category: "Income", date: "2024-12-01", type: "income", notes: "Monthly salary" },
    { id: 3, name: "Netflix", amount: 15.99, category: "Entertainment", date: "2024-11-30", type: "expense", notes: "Subscription" },
    { id: 4, name: "Electric Bill", amount: 89.0, category: "Utilities", date: "2024-11-29", type: "expense", notes: "November bill" },
    { id: 5, name: "Freelance Project", amount: 850.0, category: "Income", date: "2024-11-28", type: "income", notes: "Web design" },
    { id: 6, name: "Gas Station", amount: 62.15, category: "Transportation", date: "2024-12-02", type: "expense", notes: "Fuel refill" },
  { id: 7, name: "Coffee Shop", amount: 8.75, category: "Food", date: "2024-12-03", type: "expense", notes: "Morning coffee" },
  { id: 8, name: "Internet Bill", amount: 59.99, category: "Utilities", date: "2024-12-04", type: "expense", notes: "Monthly internet" },
  { id: 9, name: "Pharmacy Purchase", amount: 27.40, category: "Healthcare", date: "2024-12-05", type: "expense", notes: "Medicine" },
  { id: 10, name: "Online Store Refund", amount: 45.00, category: "Income", date: "2024-12-06", type: "income", notes: "Item return refund" },

  ]);

  const [formData, setFormData] = useState({
    type: "expense",
    name: "",
    amount: "",
    category: "",
    date: "",
    notes: ""
  });

  // ============================================================================
  // CONSTANTS & DATA
  // ============================================================================

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

  const categories = [
    "Food", 
    "Transportation", 
    "Entertainment", 
    "Shopping", 
    "Utilities", 
    "Income", 
    "Healthcare", 
    "Other"
  ];

  const navItems = [
    { title: "Dashboard", icon: Home, href: "#" },
    { title: "Transactions", icon: CreditCard, href: "#" },
    { title: "Budgets", icon: PieChart, href: "#" },
    { title: "Analytics", icon: TrendingUp, href: "#" },
    { title: "Settings", icon: Settings, href: "#" },
  ];

  // ============================================================================
  // HANDLERS & FUNCTIONS
  // ============================================================================

  const handleQuickParse = () => {
    const amountMatch = quickText.match(/\$?(\d+(\.\d+)?)/);
    const amount = amountMatch ? amountMatch[1] : "";
    
    setFormData({
      ...formData,
      name: quickText.split(/\d/)[0].trim() || "Transaction",
      amount: amount,
      type: quickText.toLowerCase().includes("received") || quickText.toLowerCase().includes("income") 
        ? "income" 
        : "expense",
      notes: quickText
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate OCR processing
    setTimeout(() => {
      setFormData({
        type: "expense",
        name: "Receipt from Store",
        amount: "56.25",
        category: "Food",
        date: new Date().toISOString().split('T')[0],
        notes: "Extracted via OCR"
      });
    }, 1000);
  };

  const addTransaction = () => {
    if (!formData.name || !formData.amount) return;

    const newTransaction = {
      id: Date.now(),
      name: formData.name,
      amount: Number(formData.amount),
      category: formData.category || "Other",
      date: formData.date || new Date().toISOString().split('T')[0],
      type: formData.type,
      notes: formData.notes
    };

    setTransactions([newTransaction, ...transactions]);
    
    // Reset form
    setFormData({
      type: "expense",
      name: "",
      amount: "",
      category: "",
      date: "",
      notes: ""
    });
    setQuickText("");
    setIsAddDialogOpen(false);
  };

  const deleteTransaction = (id) => {
    if (window.confirm("Delete this transaction?")) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const filteredTransactions = transactions.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const getColorClass = (color, type = "bg") => {
    const colors = {
      emerald: type === "bg" ? "bg-emerald-100" : "text-emerald-600",
      blue: type === "bg" ? "bg-blue-100" : "text-blue-600",
      orange: type === "bg" ? "bg-orange-100" : "text-orange-600",
      purple: type === "bg" ? "bg-purple-100" : "text-purple-600",
    };
    return colors[color] || "";
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      
      {/* ========================================================================
          SIDEBAR
          ======================================================================== */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-white border-r border-slate-200 flex flex-col overflow-hidden`}>
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-2 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">BudgetMaster</h2>
              <p className="text-xs text-slate-500">Financial Freedom</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <p className="text-slate-500 text-xs uppercase px-3 mb-2 font-semibold">Menu</p>
          {navItems.map((item) => (
            <Button
              key={item.title}
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-emerald-100 text-emerald-600">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">John Doe</p>
              <p className="text-xs text-slate-500">john@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================================
          MAIN CONTENT
          ======================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80 bg-slate-50 border-slate-200"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome back, John! 👋</h1>
            <p className="text-slate-500 mt-1">Here's what's happening with your money today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <Card key={idx} className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{stat.value}</h3>
                      <div className="flex items-center gap-1">
                        {stat.isPositive ? (
                          <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${stat.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className={`${getColorClass(stat.color, "bg")} p-3 rounded-xl`}>
                      <stat.icon className={`w-6 h-6 ${getColorClass(stat.color, "text")}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="bg-white border border-slate-200">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="budgets">Budgets</TabsTrigger>
            </TabsList>

            {/* ================================================================
                OVERVIEW TAB
                ================================================================ */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                {/* Recent Transactions Card */}
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your latest financial activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transactions.slice(0, 5).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              transaction.type === 'income' ? 'bg-emerald-100' : 'bg-orange-100'
                            }`}>
                              {transaction.type === 'income' ? (
                                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <ArrowDownRight className="w-4 h-4 text-orange-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{transaction.name}</p>
                              <p className="text-xs text-slate-500">{transaction.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                            }`}>
                              ${transaction.amount.toFixed(2)}
                            </p>
                            <p className="text-xs text-slate-500">{transaction.date}</p>
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
                    <CardDescription>Track your spending by category</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {budgetCategories.map((category, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-900">{category.name}</span>
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
                TRANSACTIONS TAB
                ================================================================ */}
            <TabsContent value="transactions" className="space-y-6">
              
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">All Transactions</h2>
                  <p className="text-sm text-slate-500">Manage your financial activities</p>
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
                      <p className="text-sm mt-1">Try adjusting your search or add a new transaction</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTransactions.map((transaction) => (
                    <Card key={transaction.id} className="border-slate-200 hover:shadow-lg transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          
                          {/* Left Section */}
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`p-3 rounded-lg ${
                              transaction.type === "income" 
                                ? "bg-emerald-100" 
                                : "bg-orange-100"
                            }`}>
                              {transaction.type === "income" ? (
                                <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <ArrowDownRight className="w-5 h-5 text-orange-600" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <p className="font-semibold text-slate-900">{transaction.name}</p>
                                <Badge variant="secondary" className="text-xs">
                                  {transaction.category}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                                <Calendar className="w-3 h-3" />
                                <span>{transaction.date}</span>
                              </div>
                              {transaction.notes && (
                                <p className="text-xs text-slate-600 line-clamp-1">
                                  {transaction.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Right Section */}
                          <div className="flex flex-col items-end gap-2">
                            <p className={`text-xl font-bold ${
                              transaction.type === "income" 
                                ? "text-emerald-600" 
                                : "text-slate-900"
                            }`}>
                              ${transaction.amount.toFixed(2)}
                            </p>
                            <div className="flex gap-1">
                              <Button size="icon" variant="outline" className="h-8 w-8">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="outline"
                                className="h-8 w-8 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                onClick={() => deleteTransaction(transaction.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* ================================================================
                BUDGETS TAB
                ================================================================ */}
            <TabsContent value="budgets">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Budget Management</CardTitle>
                  <CardDescription>Set and track your spending limits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {budgetCategories.map((category, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-slate-900">{category.name}</h4>
                          <p className="text-sm text-slate-500">
                            ${category.spent} spent of ${category.budget} budget
                          </p>
                        </div>
                        <Badge 
                          variant={category.spent > category.budget * 0.9 ? "destructive" : "secondary"}
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
      </div>

      {/* ========================================================================
          ADD TRANSACTION DIALOG
          ======================================================================== */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>
              Choose how you'd like to add your transaction
            </DialogDescription>
          </DialogHeader>

          {/* Input Method Selector */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Button
              variant={inputMode === "manual" ? "default" : "outline"}
              className="flex-col h-auto py-4"
              onClick={() => setInputMode("manual")}
            >
              <FileText className="w-6 h-6 mb-2" />
              <span className="text-xs">Manual Entry</span>
            </Button>
            <Button
              variant={inputMode === "receipt" ? "default" : "outline"}
              className="flex-col h-auto py-4"
              onClick={() => setInputMode("receipt")}
            >
              <Camera className="w-6 h-6 mb-2" />
              <span className="text-xs">Scan Receipt</span>
            </Button>
            <Button
              variant={inputMode === "quick" ? "default" : "outline"}
              className="flex-col h-auto py-4"
              onClick={() => setInputMode("quick")}
            >
              <Upload className="w-6 h-6 mb-2" />
              <span className="text-xs">Quick Text</span>
            </Button>
          </div>

          {/* Manual Entry Form */}
          {inputMode === "manual" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Transaction Type</Label>
                  <Select 
                    value={formData.type}
                    onValueChange={(value) => setFormData({...formData, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="e.g., Grocery shopping, Salary..."
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={formData.category}
                    onValueChange={(value) => setFormData({...formData, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                  placeholder="Add any additional details..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Receipt Upload */}
          {inputMode === "receipt" && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors">
                <Camera className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Upload Receipt Image
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  We'll extract transaction details automatically
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                 onChange={handleImageUpload}
                />
                <label htmlFor="image-upload">
                  <Button type="button" variant="outline">
                    Upload Image
                  </Button>
                </label>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">
                  After upload, extracted values will auto-fill the form.
                </p>
              </div>
            </div>
          )}

          {/* QUICK TEXT INPUT */}
          {inputMode === "quick" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Quick Entry</Label>
                <Textarea
                  placeholder='Example: "Paid $45 for groceries at Walmart"'
                  value={quickText}
                  onChange={(e) => setQuickText(e.target.value)}
                  rows={4}
                />
              </div>

              <Button
                variant="secondary"
                onClick={handleQuickParse}
              >
                Parse Text
              </Button>

              {formData.amount && (
                <Card className="border-slate-200">
                  <CardContent className="p-4 space-y-2 text-sm">
                    <p><strong>Detected Name:</strong> {formData.name}</p>
                    <p><strong>Detected Amount:</strong> ${formData.amount}</p>
                    <p><strong>Detected Type:</strong> {formData.type}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* DIALOG ACTIONS */}
          <div className="flex justify-end gap-3 pt-6">
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-emerald-600 to-teal-600"
              onClick={addTransaction}
            >
              Save Transaction
            </Button>
          </div>

        </DialogContent>
      </Dialog>
    </div>
  );
}
