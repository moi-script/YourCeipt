import { useEffect } from "react"; 
import { Button } from "@/components/ui/button";
import {
  Menu,
  Bell,
  Plus,
  X,
  Leaf
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import NotificationBell from "@/components/NotificationBell";




export function Header({setSidebarOpen, sidebarOpen, handleBellClick, setIsAddDialogOpen, length}) {
    const { user } = useAuth();
    
    // Listen for screen resize
    useEffect(() => {
        const handleResize = () => {
        const width = window.innerWidth;
            if (width < 640) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);

    }, [user]); 

    return (
        // 1. BACKGROUND: 
        // Light: Warm bone white with blur (#f2f0e9)
        // Dark: Dark Stone with blur (stone-950)
        <header className="sticky top-0 z-40 bg-[#f2f0e9]/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-white/50 dark:border-stone-800 px-3 sm:px-6 py-3 sm:py-4 transition-all duration-300">
            <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto w-full">
                
                {/* Left side - Menu and Logo/Search */}
                <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        // Updated Hover and Text colors for Dark Mode
                        className="shrink-0 rounded-full hover:bg-white/50 dark:hover:bg-stone-800/50 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                    >
                        {sidebarOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                    </Button>
                    
                    {/* Mobile Logo: Darker Emerald for Light mode, Lighter Emerald for Dark mode */}
                    <div className="sm:hidden flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-serif italic">
                       <Leaf className="w-4 h-4" />
                       <span className="text-lg">Recepta</span>
                    </div>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                   {(window.innerWidth < 640 && !sidebarOpen || window.innerWidth > 640) &&  <Button
                        variant="ghost"
                        size="icon"
                        className="relative rounded-full hover:bg-white/50 dark:hover:bg-stone-800/50 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                        onClick={handleBellClick}
                    >
                        <Bell className="w-5 h-5" />
                        {/* <NotificationBell/> */}
                     
                        {length > 0 && <span className="absolute top-2 right-2.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-[#f2f0e9] dark:ring-stone-950"></span>}
                    </Button>
}
                    {/* Desktop button - Emerald Theme 
                        Slightly lighter emerald in dark mode (600) for better visibility
                    */}
                    <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="hidden sm:flex rounded-full bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/10 border border-transparent transition-all duration-300 px-6"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Transaction
                    </Button>

                    {/* Mobile button - icon only */}
                    <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        size="icon"
                        className="sm:hidden rounded-full bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/10 border border-transparent transition-all duration-300"
                    >
                        <Plus className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}