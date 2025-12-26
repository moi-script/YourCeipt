"use client";

import { useEffect, useState } from "react";
import { LogOut, User, Settings, Shield, ChevronRight } from "lucide-react";

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
import { useLocation, useNavigate } from "react-router-dom";

export default function UserMenu() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user } = useAuth() || { user: null };
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User data for logout ---> ", user);
  }, [user]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Simulate logout process
      // await new Promise(resolve => setTimeout(resolve, 800))
      const response = await fetch("http://localhost:3000/user/logout", {
        method: "POST",
        credentials : 'include',
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Add your actual logout logic here (e.g., signOut())

      // navigate('/');
    } catch (err) {
      console.error("Unable to logout");
    } finally {
      setShowLogoutDialog(false);

      setIsLoggingOut(false);
      console.log("User logged out");
      navigate("/", { replace: true });
    }
  };

  if (!user) {
    return (
      <div className="p-4 border-t border-slate-200">
        <div className="animate-pulse flex items-center gap-3">
          <div className="rounded-full bg-slate-200 h-10 w-10"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-24"></div>
            <div className="h-3 bg-slate-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 border-t border-slate-200 bg-gradient-to-b from-transparent  to-slate-50/50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* Added focus-visible:ring-0 and focus-visible:ring-offset-0 to remove the click outline */}
            <button className="flex items-center gap-3 w-full hover:bg-white p-3 rounded-xl transition-all duration-200 outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-left shadow-sm hover:shadow-md border border-transparent hover:border-slate-200 group">
              <div className="relative">
                <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-semibold">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                  {/* {user?.user?.fullname && user?.user?.fullname} */}
                  {user?.fullname && user?.fullname}

                </p>
                <p className="text-xs text-slate-500 truncate">
                  {/* {user?.user?.email && user?.user?.email} */}
                  {user?.email && user?.email}

                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </button>
          </DropdownMenuTrigger>

          {/* Added border-none to remove the border from the popup box itself */}
          <DropdownMenuContent
            className="w-64 border-none shadow-xl"
            align="start"
            side="top"
            sideOffset={8}
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none text-slate-900">
                  {user?.fullname && user.fullname}
                </p>
                <p className="text-xs leading-none text-slate-500">
                  {user?.email && user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer py-2.5">
                <User className="mr-3 h-4 w-4 text-slate-500" />
                <span className="flex-1">Profile</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer py-2.5">
                <Shield className="mr-3 h-4 w-4 text-slate-500" />
                <span className="flex-1">Privacy & Security</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50"
              onSelect={() => setShowLogoutDialog(true)}
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span className="font-medium">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <LogOut className="h-6 w-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-center text-xl">
              Log out of your account?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              You'll need to sign in again to access your account and continue
              where you left off.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* CHANGE 1: Ginawang grid-cols-2 para pantay na 50/50 ang width nila */}
          <AlertDialogFooter className="grid grid-cols-2 gap-2 sm:gap-2 sm:space-x-0">
            {/* CHANGE 2: Nilipat ko ang Cancel sa una para nasa KALIWA (Left) */}
            <AlertDialogCancel
              className="w-full mt-0 font-semibold"
              disabled={isLoggingOut}
            >
              Cancel
            </AlertDialogCancel>

            {/* CHANGE 3: Ang Action (Logout) ay nasa pangalawa para nasa KANAN (Right) */}
            <AlertDialogAction
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full bg-red-600 hover:bg-red-700 focus:ring-red-600 font-semibold"
            >
              {isLoggingOut ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
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
