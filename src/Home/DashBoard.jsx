import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Home as UserHome } from "./Home";
import { DialogForm } from "@/Input/DialogForm";
import TransactionsPage from "./Transactions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Toaster } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Header } from "./Header";

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
  Camera,
  Upload,
  FileText,
  Trash2,
  Edit,
  Calendar,
  Receipt,
} from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";




export function BudgetDashboard() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [inputMode, setInputMode] = useState("manual");
  const [quickText, setQuickText] = useState("");
  const [homeDefault, setHomeDefault] = useState("Home");
  // const [userId, setUserId] = useState();


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

  const [formData, setFormData] = useState({
    type: "expense",
    name: "",
    amount: "",
    category: "",
    date: "",
    notes: "",
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
    "Other",
  ];

  const navItems = [
    { title: "Home", icon: Home, href: "/user/" },
    { title: "Transactions", icon: CreditCard, href: "/user/transactions" },
    { title: "Budgets", icon: PieChart, href: "/user/budgets" },
    { title: "Analytics", icon: TrendingUp, href: "/user/analytics" },
    { title: "Settings", icon: Settings, href: "/user/settings" },
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
      type:
        quickText.toLowerCase().includes("received") ||
        quickText.toLowerCase().includes("income")
          ? "income"
          : "expense",
      notes: quickText,
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
        date: new Date().toISOString().split("T")[0],
        notes: "Extracted via OCR",
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
      date: formData.date || new Date().toISOString().split("T")[0],
      type: formData.type,
      notes: formData.notes,
    };

    setTransactions([newTransaction, ...transactions]);

    // Reset form
    setFormData({
      type: "expense",
      name: "",
      amount: "",
      category: "",
      date: "",
      notes: "",
    });
    setQuickText("");
    setIsAddDialogOpen(false);
  };

  const deleteTransaction = (id) => {
    if (window.confirm("Delete this transaction?")) {
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  const filteredTransactions = transactions.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const notificationList = [
    {
      title: "Salary Credited",
      message: "₱4,200 has been added to your balance.",
      type: "success",
    },
    {
      title: "Budget Warning",
      message: "You are close to exceeding your Food budget.",
      type: "warning",
    },
    {
      title: "Subscription Charged",
      message: "Netflix charged ₱15.99",
      type: "info",
    },
  ];

  const handleBellClick = () => {
    if (!notificationList.length) {
      toast.info("No new notifications");
      return;
    }

    notificationList.forEach((notif, index) => {
      setTimeout(() => {
        if (notif.type === "success") {
          toast.success(notif.title, { description: notif.message });
        } else if (notif.type === "warning") {
          toast.warning(notif.title, { description: notif.message });
        } else if (notif.type === "error") {
          toast.error(notif.title, { description: notif.message });
        } else {
          toast.info(notif.title, { description: notif.message });
        }
      }, index * 300); // staggered animation
    });
  };

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
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 bg-white border-r border-slate-200 flex flex-col overflow-hidden`}
      >
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
          <p className="text-slate-500 text-xs uppercase px-3 mb-2 font-semibold">
            Menu
          </p>
          {navItems.map((item) => (
            <Button
              key={item.title}
              variant="ghost"
              onClick={() => setHomeDefault(item.title)}
              asChild
              className="w-full justify-start gap-3 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <NavLink to={item.href}>
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </NavLink>
            </Button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-emerald-100 text-emerald-600">
                JD
              </AvatarFallback>
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

        <Header
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
          handleBellClick={handleBellClick}
          setIsAddDialogOpen={setIsAddDialogOpen}
        />

          {(homeDefault === 'Home')  && (
             <UserHome
              setIsAddDialogOpen={setIsAddDialogOpen}
              isAddDialogOpen={isAddDialogOpen}
            />
          ) }

        <Outlet />
        <DialogForm
          setIsAddDialogOpen={setIsAddDialogOpen}
          isAddDialogOpen={isAddDialogOpen}
        />
        <Toaster position="top-right" richColors />
  
      </div>
    </div>
  );
}
