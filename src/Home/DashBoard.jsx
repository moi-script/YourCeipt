import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home as UserHome } from "./Home";
import { DialogForm } from "@/Input/DialogForm";
import TransactionsPage from "./Transactions";
import { Toaster } from "sonner";
import { toast as t } from "sonner";
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
import { useAuth } from "@/context/AuthContext";
import { AdvanceForm } from "@/Input/AdvanceForm";
// import { useToast } from "@/components/Toaster.jsx";
import { useToast } from "@/components/Toaster.jsx";

export function BudgetDashboard() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [homeDefault, setHomeDefault] = useState("Home");
  const  toast  = useToast();

  const {isAddDialogOpen, setIsAddDialogOpen, user} = useAuth();
  const [notification, setNotification] = useState(null);

  // useEffect(() => {
  //   console.warn('Initiating the taost', toast);
  //   setTimeout(()=> {
  //     console.warn("After 5 seconds in toast");
  //     toast.success("Transaction Saved", "Your receipt was successfully parsed and logged.");
  //   }, 5000)
  // }, [])


// toast.message('System Update', {
//   description: 'Version 2.0 is live',
//   // Fires when user swipes away or clicks close
//   onDismiss: (t) => {
//     console.log(`Toast ${t.id} was dismissed/read`);
//     // markAsReadInDatabase(notificationId); // 
//   },
//   // Fires if the timer runs out (user didn't interact)
//   onAutoClose: (t) => {
//     console.log(`Toast ${t.id} auto-closed (user might have missed it)`);
//   }
// });

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


const getAllunreadMark = useMemo(() => {
  if(Array.isArray(notification?.notifications)){
    return notification.notifications.filter((notif) => {
      // console.log('Notif :: ', notif)
      if(!notif.isRead) return true;
    });
  }
}, [notification])

const unreadMark = useCallback(async (notifId) => {
  const res = await fetch('http://localhost:3000/notification/read', {
    method : "PUT",
    headers : {
      "Content-type" : 'application/json'
    },
    body : JSON.stringify({notificationId : notifId})
  })

  if(!res.ok) {
    console.error('Unable to mark as read this notification ' + notifId);
  }

}, [notification])

useEffect(() =>{
  // console.log('All notification with unread value :: ', getAllunreadMark);
}, getAllunreadMark);


  useEffect(() => {
    if(user._id) {
      const getNotification = async () => {
        const res = await fetch('http://localhost:3000/notification/get',{
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


  useEffect(() => {
    // console.log('Notification list :: ', notification);

    
  }, [notification])

  // --> mark as read /notification/read

//   export const markAsRead = async (req, res) => {
//   try {
//     const { notificationId } = req.body;
//     await Notification.findByIdAndUpdate(notificationId, { isRead: true });
//     res.status(200).json({ success: true });
//   } catch (err) {
//     res.status(500).json({ message: "Error updating status" });
//   }
// };


  const handleBellClick = () => {
    if (!getAllunreadMark.length) {
      t.info("No new notifications");
      return;
    }
    
  //   t.message('System Update', {
  // description: 'Version 2.0 is live',
  // onDismiss: (t) => {
  //   console.log(`Toast ${t.id} was dismissed/read`);
  //   // markAsReadInDatabase(notificationId); // 
  // },
  // onAutoClose: (t) => {
  //   console.log(`Toast ${t.id} auto-closed (user might have missed it)`);
  // }
  //   });

    getAllunreadMark.forEach((notif, index) => {
      setTimeout(() => {
        if (notif.type === "success") {
          t.success(notif.title, { description: notif.message, 
             onDismiss: async () => {
              await unreadMark(notif._id);
               // markAsReadInDatabase(notificationId); // 
  },
          onAutoClose: (t) => {
          console.log(`Toast ${t.id} auto-closed (user might have missed it)`);
            }
           });
        } else if (notif.type === "warning") {
          t.warning(notif.title, { description: notif.message,
             onDismiss: (t) => {
              console.log(`Toast ${t.id} was dismissed/read`);
               // markAsReadInDatabase(notificationId); // 
              },
             onAutoClose: (t) => {
              console.log(`Toast ${t.id} auto-closed (user might have missed it)`);
            }
           });
        
        
        
        } else if (notif.type === "error") {
          t.error(notif.title, { description: notif.message, 
             onDismiss: (t) => {
              console.log(`Toast ${t.id} was dismissed/read`);
               // markAsReadInDatabase(notificationId); // 
            },
          onAutoClose: (t) => {
          console.log(`Toast ${t.id} auto-closed (user might have missed it)`);
            }
           });
        } else {
          t.info(notif.title, { description: notif.message, 
             onDismiss: (t) => {
              console.log(`Toast ${t.id} was dismissed/read`);
               // markAsReadInDatabase(notificationId); // 
  },
          onAutoClose: (t) => {
          console.log(`Toast ${t.id} auto-closed (user might have missed it)`);
            }

           });
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
    // { title: "Settings", icon: Settings, href: "/user/settings" },
  ];


  const [currentTheme, setCurrentTheme] = useState("light");

  // 2. ADD THIS EFFECT TO WATCH FOR CLASS CHANGES
  useEffect(() => {
    // Function to check if 'dark' class exists on HTML tag
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setCurrentTheme(isDark ? "dark" : "light");
    };

    // Run once on mount
    checkTheme();

    // Create an observer to watch for class changes on <html>
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Cleanup
    return () => observer.disconnect();
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    // 1. MAIN CONTAINER
    <div className="flex min-h-screen w-full bg-[#f2f0e9] dark:bg-stone-950 relative overflow-hidden font-sans text-stone-800 dark:text-stone-100 transition-colors duration-300">
      
      {/* Decorative Blobs */}
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
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold shadow-sm" 
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
          MAIN CONTENT - UPDATED FOR STICKY HEADER
          ======================================================================== */}
      {/* 1. 'overflow-y-auto' and 'h-screen' move the scrollbar to this container.
          2. This allows children with 'sticky' to actually stick.
      */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative overflow-y-auto h-screen">
        
        {/* Sticky Wrapper for Header */}
        <div className="sticky top-0 z-50 bg-white/0 dark:bg-stone-950/0 backdrop-blur-sm transition-all">
            <Header
            setSidebarOpen={setSidebarOpen}
            sidebarOpen={sidebarOpen}
            handleBellClick={handleBellClick}
            setIsAddDialogOpen={setIsAddDialogOpen}
            length={getAllunreadMark?.length}
            />
        </div>

        {/* Content Area - Removed overflow-auto from here */}
        <div className="flex-1">
            {(homeDefault === 'Home' && location.pathname === '/user/') ? (
            <UserHome
             
            />
            ) : (
                <Outlet />
            )}
        </div>

        <AdvanceForm
          setIsAddDialogOpen={setIsAddDialogOpen}
          isAddDialogOpen={isAddDialogOpen}
        />

       <Toaster 
          position="top-right" 
          richColors 
          theme={currentTheme} // <--- Forces 'light' or 'dark' based on your state
          toastOptions={{
            // Keep your Stone styling consistent
            classNames: {
              toast: 'group bg-white dark:bg-stone-900 text-stone-950 dark:text-stone-50 border-stone-200 dark:border-stone-800 shadow-xl',
              description: 'text-stone-500 dark:text-stone-400 font-medium',
              actionButton: 'bg-emerald-600 text-white font-bold',
              cancelButton: 'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400',
              error: 'text-red-600 dark:text-red-400',
              success: 'text-emerald-600 dark:text-emerald-400',
              warning: 'text-orange-600 dark:text-orange-400',
              info: 'text-blue-600 dark:text-blue-400',
            },
          }}
        />
      </div>
    </div>
  );
}