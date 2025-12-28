import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Home as UserHome } from "./Home";
import { DialogForm } from "@/Input/DialogForm";
import TransactionsPage from "./Transactions";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { Header } from "./Header";
import {
  Home,
  TrendingUp,
  CreditCard,
  PieChart,
  Brain,
  Settings,
  Leaf
} from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import UserMenu from "./Logout";

export function BudgetDashboard() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [homeDefault, setHomeDefault] = useState("Home");
  
  // ... (Your existing transactions/stats data remains unchanged) ...
  // Keeping the state logic exactly as is for brevity

  const location = useLocation();

  


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

  const navItems = [
    { title: "Home", icon: Home, href: "/user/" },
    { title: "Transactions", icon: CreditCard, href: "/user/transactions" },
    { title: "Budgets", icon: PieChart, href: "/user/budgets" },
    { title: 'AI Models', icon : Brain, href : '/user/models'},
    { title: "Analytics", icon: TrendingUp, href: "/user/analytics" },
    { title: "Settings", icon: Settings, href: "/user/settings" },
  ];

  // const handleBellClick = () => {
  //    toast.info("No new notifications");
  // };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    // 1. MAIN CONTAINER: 
    // Light: Warm bone (#f2f0e9) | Dark: Deep Stone (#0c0a09)
    <div className="flex min-h-screen w-full bg-[#f2f0e9] dark:bg-stone-950 relative overflow-hidden font-sans text-stone-800 dark:text-stone-100 transition-colors duration-300">
      
      {/* Decorative Blobs (Global) 
          Dark mode: Lower opacity and slightly different blending to avoid "muddy" colors
      */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-100 dark:bg-emerald-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[90px] opacity-40 dark:opacity-20 pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-100 dark:bg-orange-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[90px] opacity-40 dark:opacity-20 pointer-events-none z-0"></div>

      {/* ========================================================================
          SIDEBAR
          ======================================================================== */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 bg-white/60 dark:bg-stone-950/60 backdrop-blur-md border-r border-white/50 dark:border-stone-800 flex flex-col overflow-hidden z-20 shadow-sm`}
      >
        <div className="p-4 flex items-center gap-2 mb-2">
            {/* Logo Icon Container */}
            <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-full transition-colors">
                <Leaf className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            </div>
            <h2 className={`font-serif italic text-2xl text-stone-800 dark:text-stone-100 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                Recepta
            </h2>
        </div>

        <UserMenu setHomeDefault={setHomeDefault} />

        <nav className="flex-1 p-4 space-y-1">
          <p className="text-stone-400 dark:text-stone-500 text-[10px] uppercase px-4 mb-3 font-bold tracking-widest">
            Menu
          </p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
                <Button
                key={item.title}
                variant="ghost"
                onClick={() => setHomeDefault(item.title)}
                asChild
                className={`w-full justify-start gap-3 rounded-full mb-1 transition-all duration-300 ${
                    isActive 
                    // Active State: Emerald light bg in Light, Emerald dark glow in Dark
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold shadow-sm" 
                    // Inactive State: Stone text
                    : "text-stone-500 dark:text-stone-400 hover:bg-white/50 dark:hover:bg-stone-800/50 hover:text-stone-700 dark:hover:text-stone-200"
                }`}
                >
                <NavLink to={item.href}>
                    <item.icon className={`w-5 h-5 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-stone-400 dark:text-stone-500"}`} />
                    <span>{item.title}</span>
                </NavLink>
                </Button>
            );
          })}
        </nav>
      </aside>

      {/* ========================================================================
          MAIN CONTENT
          ======================================================================== */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        <Header
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
          handleBellClick={handleBellClick}
          setIsAddDialogOpen={setIsAddDialogOpen}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
            {(homeDefault === 'Home' && location.pathname === '/user/') ? (
            <UserHome
                setIsAddDialogOpen={setIsAddDialogOpen}
                isAddDialogOpen={isAddDialogOpen}
            />
            ) : (
                <Outlet />
            )}
        </div>

        <DialogForm
          setIsAddDialogOpen={setIsAddDialogOpen}
          isAddDialogOpen={isAddDialogOpen}
        />
        {/* Toaster needs dark theme aware styling (Sonner usually handles this automatically based on system or explicit theme prop) */}
        <Toaster position="top-right" richColors />
      </div>
    </div>
  );
}










