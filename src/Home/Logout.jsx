"use client";

import { useEffect, useState } from "react";
import { LogOut, User, Shield, ChevronRight } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
const BASE_API_URL  = import.meta.env.VITE_URL_BACKEND || "http://localhost:5173"



export default function UserMenu({setHomeDefault}) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, setRefreshPage } = useAuth() || { user: null };
  const navigate = useNavigate();


  useEffect(() => {
    // console.log("User data for logout ---> ", user);
  }, [user]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await fetch(BASE_API_URL+"/user/logout", {
        method: "POST",
        credentials : 'include',
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }
    } catch (err) {
      console.error("Unable to logout");
    } finally {
      setShowLogoutDialog(false);
      setIsLoggingOut(false);
      console.log("User logged out");
      localStorage.setItem('user', false);
      navigate("/", { replace: true });
      // setRefreshPage(true);

    }
  };

  if (!user) {
    return (
      <div className="p-4 border-t border-white/50 dark:border-stone-800">
        <div className="animate-pulse flex items-center gap-3">
          <div className="rounded-full bg-stone-200 dark:bg-stone-800 h-10 w-10"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-24"></div>
            <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Container: Light gradient vs Dark gradient */}
      <div className="p-4 border-t border-white/50 dark:border-stone-800 bg-gradient-to-b from-transparent to-white/30 dark:to-stone-900/30 backdrop-blur-sm transition-colors">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full hover:bg-white/60 dark:hover:bg-stone-800/60 p-3 rounded-[1.5rem] transition-all duration-300 outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-left shadow-sm hover:shadow-md border border-transparent hover:border-white/50 dark:hover:border-stone-700 group">
              <div className="relative">
                <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-stone-700 shadow-sm">
                  <AvatarImage src={user?.image_profile} />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-semibold">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-stone-800 rounded-full"></div>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-serif font-bold text-stone-800 dark:text-stone-100 truncate group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                  {user?.fullname}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                  {user?.email}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-stone-400 dark:text-stone-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-64 border border-white/50 dark:border-stone-800 shadow-xl rounded-[1.5rem] bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-2"
            align="start"
            side="top"
            sideOffset={8}
          >
            <DropdownMenuLabel className="font-normal px-4 py-3">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-serif font-bold leading-none text-stone-900 dark:text-stone-100">
                  {user?.fullname}
                </p>
                <p className="text-xs leading-none text-stone-500 dark:text-stone-400">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-stone-100 dark:bg-stone-800" />
            
            <DropdownMenuGroup className="p-1">
                <NavLink to="/user/profile" onClick={() => setHomeDefault('Profile')}>
                    <DropdownMenuItem className="cursor-pointer py-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 focus:bg-stone-50 dark:focus:bg-stone-800 transition-colors">
                        <User className="mr-3 h-4 w-4 text-stone-500 dark:text-stone-400" />
                        <span className="flex-1 text-stone-700 dark:text-stone-200 font-medium">Profile</span>
                        <ChevronRight className="h-3.5 w-3.5 text-stone-300 dark:text-stone-600" />
                    </DropdownMenuItem>
                </NavLink>

                <NavLink to="/user/privacy" onClick={() => setHomeDefault('Profile')}>
                    <DropdownMenuItem className="cursor-pointer py-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 focus:bg-stone-50 dark:focus:bg-stone-800 transition-colors">
                        <Shield className="mr-3 h-4 w-4 text-stone-500 dark:text-stone-400" />
                        <span className="flex-1 text-stone-700 dark:text-stone-200 font-medium">Privacy & Security</span>
                        <ChevronRight className="h-3.5 w-3.5 text-stone-300 dark:text-stone-600" />
                    </DropdownMenuItem>
                </NavLink>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator className="bg-stone-100 dark:bg-stone-800" />

            <div className="p-1">
              <DropdownMenuItem
                className="cursor-pointer py-2.5 rounded-xl text-orange-600 dark:text-orange-400 focus:text-orange-700 dark:focus:text-orange-300 focus:bg-orange-50 dark:focus:bg-orange-900/20 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                onSelect={() => setShowLogoutDialog(true)}
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span className="font-medium">Log out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="max-w-md rounded-[2.5rem] bg-[#fcfcfc] dark:bg-stone-950 border border-white dark:border-stone-800 shadow-2xl p-8">
          <AlertDialogHeader>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 shadow-sm">
              <LogOut className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <AlertDialogTitle className="text-center text-xl font-serif text-stone-800 dark:text-stone-100">
              Log out of your account?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-stone-500 dark:text-stone-400">
              You'll need to sign in again to access your account and continue
              where you left off.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="grid grid-cols-2 gap-3 sm:gap-3 sm:space-x-0 mt-6">
            <AlertDialogCancel
              className="w-full mt-0 font-bold rounded-full border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-700 dark:hover:text-stone-200 h-12 bg-transparent"
              disabled={isLoggingOut}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 focus:ring-orange-600 font-bold rounded-full h-12 shadow-lg shadow-orange-200 dark:shadow-none text-white"
            >
              {isLoggingOut ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging out...
                </span>
              ) : (
                "Yes, log out"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}