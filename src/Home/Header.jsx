import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Bell,
  Plus,
  X,
  Leaf
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Header({ setSidebarOpen, sidebarOpen, handleBellClick, setIsAddDialogOpen, length }) {
    const { user } = useAuth();
    
    // We need a state to track mounting to avoid hydration mismatch if you were using window checks before
    // But primarily, we will rely on CSS for the layout logic.

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        // Run once on mount to set initial state
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [user, setSidebarOpen]); // Added setSidebarOpen to dependency array

    return (
        <header className="sticky top-0 z-40 bg-[#f2f0e9]/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-white/50 dark:border-stone-800 px-3 sm:px-6 py-3 sm:py-4 transition-all duration-300">
            {/* Using max-w-7xl ensures it doesn't stretch too far on huge screens.
                mx-auto centers it.
            */}
            <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
                
                {/* --- Left Side: Toggle & Logo --- */}
                {/* min-w-0 allows the container to shrink below its content size if needed */}
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="shrink-0 rounded-full hover:bg-white/50 dark:hover:bg-stone-800/50 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                    >
                        {sidebarOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                    
                    {/* Mobile Logo 
                        Using `whitespace-nowrap` prevents the text from wrapping on 360px screens.
                        `shrink-0` ensures the logo icon stays round.
                    */}
                    <div className="sm:hidden flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-serif italic whitespace-nowrap">
                       <Leaf className="w-4 h-4 shrink-0" />
                       <span className="text-lg">Recepta</span>
                    </div>
                </div>

                {/* --- Right Side: Actions --- */}
                <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                    
                    {/* Notification Bell 
                        LOGIC: Replaced window.innerWidth check with CSS classes.
                        `flex`: Always visible by default.
                        `hidden`: Hidden if (sidebarOpen is true AND screen is small).
                        `sm:flex`: Force visible on desktop regardless of sidebar.
                    */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleBellClick}
                        className={`
                            relative rounded-full shrink-0
                            hover:bg-white/50 dark:hover:bg-stone-800/50 
                            text-stone-600 dark:text-stone-400 
                            hover:text-stone-900 dark:hover:text-stone-100 
                            transition-colors
                            ${sidebarOpen ? 'hidden sm:flex' : 'flex'} 
                        `}
                    >
                        <Bell className="w-5 h-5" />
                        {length > 0 && (
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-[#f2f0e9] dark:ring-stone-950 pointer-events-none"></span>
                        )}
                        <span className="sr-only">Notifications</span>
                    </Button>

                    {/* Desktop Add Button */}
                    <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="hidden sm:flex shrink-0 rounded-full bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/10 border border-transparent transition-all duration-300 px-6"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Transaction
                    </Button>

                    {/* Mobile Add Button - Icon Only */}
                    <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        size="icon"
                        className="sm:hidden shrink-0 rounded-full bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/10 border border-transparent transition-all duration-300"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="sr-only">Add Transaction</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}