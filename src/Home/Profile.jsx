import React, { useEffect, useRef, useState } from 'react';
import { 
  User, Mail, CreditCard, Bell, Shield, Download, 
  Moon, LogOut, Sparkles,
  Loader2
} from 'lucide-react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from '@/context/AuthContext';
import ProfilePicPage from '@/Input/ProfilePic';
import { useNavigate } from 'react-router-dom';
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
export default function ProfilePage() {
  const { user, setRefreshPage } = useAuth();
  
  // STATE: specific states for UI control
  const [currency, setCurrency] = useState("php");
  const [isDarkMode, setIsDarkMode] = useState(false); // Changed to clear boolean
  const [overSpending, setOverSpending] = useState(false);
  const [nearLimit, setNearLimit] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [fullname, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [isChangingName, setIsChangingName] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  // 1. INITIAL SYNC
  useEffect(() => {
    if (user?.currency) setCurrency(user.currency);
    
    // Check if user has "dark" saved, OR if no setting, check system preference
    if (user?.theme) {
      setIsDarkMode(user.theme === 'dark');
    }
    
    if (user?.overSpending) setOverSpending(user.overSpending);
    if (user?.nearLimit) setNearLimit(user.nearLimit);
    if(user?.fullname) setFullName(user?.fullname);
    if(user?.nickname) setNickname(user?.nickname);

  }, [user]);

  // 2. THEME ENGINE (Logic Fix)
  useEffect(() => {
    const root = window.document.documentElement;
    // Check the boolean state 'isDarkMode', not the string "dark"
    if (isDarkMode) {
      root.classList.add("dark");
      root.style.colorScheme = "dark"; 
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  }, [isDarkMode]);



  const updatePreferences = async (checked) => {
    // 1. Update UI Instantly
    setIsDarkMode(checked);

    // 2. Send String to Backend
    try {
      await fetch('http://localhost:3000/user/theme', {
        method : "POST",
        headers : { 'Content-type' : 'application/json' },
        body : JSON.stringify({
            preferences : checked ? "dark" : "default", 
            userId : user._id
        })
      });
    } catch(err) {
      console.error('Unable to change preferences');
      // Optional: Revert state if error
      setIsDarkMode(!checked);
    }
  }

  const updateCurrency = async (currency) => {
    setCurrency(currency);
    try {
        const res = await fetch('http://localhost:3000/user/currency', {
            method : "POST",
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify({currency : currency.toUpperCase(), userId : user._id})
        });
    } catch(err) {
        console.error('Unable to change preferencess')
    }
  }

  const updateOverSpending = async (overSpending) => {
    setOverSpending(overSpending);
    try {
        const res = await fetch('http://localhost:3000/user/overSpending', {
            method : "POST",
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify({overSpending : overSpending, userId : user._id})
        });

    } catch(err) {
        console.error('Unable to change preferencess')
    }
  }

   const updateNearLimit = async (nearLimit) => {
    setNearLimit(nearLimit);
    try {
        const res = await fetch('http://localhost:3000/user/nearLimit', {
            method : "POST",
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify({nearLimit : nearLimit, userId : user._id})
        });

    } catch(err) {
        console.error('Unable to change preferencess')
    }
  }

  const updateNames = async () => {
    console.log('Updating names');
    setIsChangingName(true);
    const fullnameResponse = await fetch('http://localhost:3000/user/fullname', {
        headers : {
            'Content-type' : 'application/json'
        },
        method : "POST",
        body : JSON.stringify({fullname : fullname, userId : user._id})
    })
     const nicknameResponse = await fetch('http://localhost:3000/user/nickname', {
        headers : {
            'Content-type' : 'application/json'
        },
        method : "POST",
        body : JSON.stringify({nickname : nickname, userId : user._id})
    })
    setIsChangingName(false);
  }

   const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await fetch("http://localhost:3000/user/logout", {
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
      navigate("/main", { replace: true });
      // setRefreshPage(true);

    }
  };


  return (
    <>
      {user && (
        <div className="min-h-screen bg-[#f2f0e9] dark:bg-stone-950 relative overflow-hidden font-sans text-stone-800 dark:text-stone-100 pb-12 transition-colors duration-300">
          
          {/* Decorative Background Blobs - Adjusted opacity for Dark Mode */}
          <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-[#d1fae5] dark:bg-emerald-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[90px] opacity-60 dark:opacity-40 animate-pulse"></div>
          <div className="absolute bottom-[0%] left-[-10%] w-[500px] h-[500px] bg-[#ffedd5] dark:bg-orange-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[90px] opacity-70 dark:opacity-40"></div>

          <div className="p-6 max-w-4xl mx-auto space-y-8 relative z-10 pt-16">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 backdrop-blur-md mb-3">
                   <Sparkles className="h-3 w-3 text-orange-700 dark:text-orange-300" />
                   <span className="text-[10px] uppercase tracking-widest text-orange-700 dark:text-orange-300 font-bold">Personal Hub</span>
                </div>
                <h1 className="text-5xl font-serif italic text-[#2c2c2c] dark:text-stone-50">Profile</h1>
                <p className="text-stone-600 dark:text-stone-400 mt-2 font-medium">Shape your digital presence and preferences.</p>
              </div>
            </div>

            {/* Main Profile Card - Identity */}
            <Card className="border-white/50 dark:border-stone-800 bg-white/60 dark:bg-stone-900/60 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden transition-colors">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-serif text-emerald-900 dark:text-emerald-400">Identity</CardTitle>
                <CardDescription className="text-stone-500 dark:text-stone-400">Your visual representation.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 p-8 pt-2">
                
            
                <ProfilePicPage/>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-stone-300 dark:via-stone-700 to-transparent opacity-50"></div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="fullName" className="text-stone-600 dark:text-stone-400 ml-4">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 h-4 w-4 text-stone-400" />
                      {/* Note: Added dark styles for Input */}
                      <Input 
                        id="fullName" 
                        defaultValue={user?.fullname}
                        onChange={(fullname) => setFullName(fullname.target.value)} 
                        className="pl-10 rounded-full bg-white/80 dark:bg-stone-800/80 border-transparent shadow-sm h-12 focus-visible:ring-emerald-300/50 text-stone-800 dark:text-stone-100" 
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="nickname" className="text-stone-600 dark:text-stone-400 ml-4">Display Name</Label>
                    <Input 
                      id="nickname" 
                      defaultValue={user?.nickname}
                      onChange={(nickname) => setNickname(nickname.target.value)}
                      className="rounded-full bg-white/80 dark:bg-stone-800/80 border-transparent shadow-sm h-12 px-6 focus-visible:ring-emerald-300/50 text-stone-800 dark:text-stone-100"
                    />
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="email" className="text-stone-600 dark:text-stone-400 ml-4">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 h-4 w-4 text-stone-400" />
                      <Input 
                        id="email" 
                        defaultValue="nugalmoises62@gmail.com" 
                        className="pl-10 rounded-full bg-[#fcfcfc] dark:bg-stone-900 border-transparent shadow-inner h-12 text-stone-500 dark:text-stone-500" 
                        disabled 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-white/40 dark:bg-black/20 p-6 flex justify-end">
                <Button
                onClick={updateNames}
                disabled={isChangingName} 
                className="rounded-full bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-8 h-12 shadow-[0_4px_14px_rgb(4_120_87_/_30%)] transition-all duration-300"
                >
                  {isChangingName ? <Loader2/> : "Save Changes"}

                </Button>
              </CardFooter>
            </Card>

            {/* Preferences & Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Preferences (Emerald Theme) */}
              <Card className="border-none bg-emerald-50/50 dark:bg-emerald-950/20 shadow-none rounded-[2.5rem]">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl font-serif text-emerald-900 dark:text-emerald-400">
                    <div className="p-2 bg-white dark:bg-emerald-900 rounded-full shadow-sm text-emerald-700 dark:text-emerald-300">
                        <CreditCard className="h-5 w-5" />
                    </div>
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-8 pt-2">
                  
                  <div className="space-y-3">
                    <Label className="text-stone-600 dark:text-stone-400 ml-2">Currency</Label>
                    <Select value={currency.toLowerCase()} onValueChange={updateCurrency}>
                      <SelectTrigger className="rounded-full bg-white dark:bg-stone-800 border-none shadow-sm h-12 px-4 focus:ring-emerald-300/50 text-stone-800 dark:text-stone-100">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md text-stone-800 dark:text-stone-100">
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="php">PHP (₱)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-white/60 dark:bg-stone-900/40 p-4 rounded-[1.5rem] flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base text-stone-800 dark:text-stone-100 flex items-center gap-2">
                        <Moon className="h-4 w-4" /> Night Mode
                      </Label>
                    </div>
                    {/* Fixed Logic: Checked uses boolean isDarkMode, onCheckedChange sends boolean */}
                    <Switch 
                        className="data-[state=checked]:bg-emerald-600" 
                        checked={isDarkMode} 
                        onCheckedChange={updatePreferences} 
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Notifications (Orange Theme) */}
              <Card className="border-none bg-white dark:bg-stone-900 shadow-[0_4px_20px_rgb(0,0,0,0.02)] rounded-[2.5rem]">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl font-serif text-stone-800 dark:text-stone-100">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-700 dark:text-orange-400">
                        <Bell className="h-5 w-5" />
                    </div>
                    Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-8 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-stone-800 dark:text-stone-100">Overspending</Label>
                      <p className="text-xs text-stone-500 dark:text-stone-400">Notify when budget exceeded.</p>
                    </div>
                    <Switch className="data-[state=checked]:bg-orange-600" checked={overSpending} onCheckedChange={updateOverSpending} />
                  </div>
                  
                  <div className="h-px w-full bg-stone-100 dark:bg-stone-800"></div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-stone-800 dark:text-stone-100">Near Limit</Label>
                      <p className="text-xs text-stone-500 dark:text-stone-400">Notify at 90% usage.</p>
                    </div>
                    <Switch className="data-[state=checked]:bg-orange-600" checked={nearLimit} onCheckedChange={updateNearLimit} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data Management (Caution = Orange Theme) */}
            <Card className="border border-orange-200/60 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-950/20 shadow-none rounded-[2.5rem]">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-serif text-orange-900 dark:text-orange-400">
                   <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-700 dark:text-orange-400 shadow-sm">
                     <Shield className="h-5 w-5" />
                   </div>
                   Data Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-8 pt-2">
                <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-stone-900/40 rounded-[1.5rem] border border-white/80 dark:border-white/5">
                  <div className="space-y-1">
                    <p className="font-medium text-orange-950 dark:text-orange-100">Export Data</p>
                    <p className="text-xs text-orange-800/70 dark:text-orange-200/50">Download CSV.</p>
                  </div>
                  <Button variant="outline" className="gap-2 rounded-full border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/20 bg-transparent font-medium">
                    <Download className="h-4 w-4" /> Save
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-[1.5rem] hover:bg-orange-100/50 dark:hover:bg-orange-900/20 transition-colors group">
                  <div className="space-y-1">
                    <p className="font-medium text-orange-800 dark:text-orange-200">End Session</p>
                    <p className="text-xs text-orange-700/70 dark:text-orange-300/50">Sign out of this device.</p>
                  </div>
                  <Button  onClick={() => setShowLogoutDialog(true)} variant="ghost" size="sm" className="gap-2 text-orange-700 dark:text-orange-400 group-hover:text-orange-800 dark:group-hover:text-orange-300 group-hover:bg-orange-200/20">
                    <LogOut className="h-4 w-4" /> Log Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            
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
          </div>
        </div>
      )}
    </>
  );
}




