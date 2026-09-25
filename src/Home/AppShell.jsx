import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Camera, ChevronRight, LogOut, Moon, Shield, Sun, User, Cpu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AdvanceForm } from "@/Input/AdvanceForm";
import { NotificationBell } from "@/components/NotificationPanel";
import { IconOverview, IconLedger, IconBudget, IconTrends, LogoMark } from "@/components/icons";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutConfirm } from "./Logout";
import { isDarkTheme, setTheme } from "@/lib/theme";
import { BASE_API_URL } from "@/api/getKeys";

// The Android app's frame: a title bar with the profile on top, and a tab bar
// at the bottom with "Add receipt" raised in the middle. The web sidebar and
// its hamburger menu are for desktop browsers, not a phone app.

const TABS_LEFT = [
  { title: "Home", icon: IconOverview, href: "/user/" },
  { title: "Activity", icon: IconLedger, href: "/user/transactions" },
];
const TABS_RIGHT = [
  { title: "Budgets", icon: IconBudget, href: "/user/budgets" },
  { title: "Insights", icon: IconTrends, href: "/user/analytics" },
];

const TITLES = {
  "/user/transactions": "Transactions",
  "/user/budgets": "Budgets",
  "/user/analytics": "Analytics",
  "/user/models": "AI models",
  "/user/profile": "Profile",
  "/user/privacy": "Privacy & security",
};

const isHome = (path) => path === "/user" || path === "/user/";


function Tab({ item }) {
  const location = useLocation();
  const active = item.href === "/user/" ? isHome(location.pathname) : location.pathname.startsWith(item.href);
  return (
    <NavLink
      to={item.href}
      end={item.href === "/user/"}
      aria-current={active ? "page" : undefined}
      className="flex-1 flex flex-col items-center justify-center gap-1 h-full text-[11px] font-medium"
    >
      <span className={`grid place-items-center h-7 w-12 rounded-full transition-colors ${active ? "bg-emerald-100 dark:bg-emerald-900/50" : ""}`}>
        <item.icon className={`w-[20px] h-[20px] ${active ? "text-emerald-800 dark:text-emerald-300" : "text-stone-500 dark:text-stone-400"}`} />
      </span>
      <span className={active ? "text-stone-900 dark:text-stone-50" : "text-stone-500 dark:text-stone-400"}>{item.title}</span>
    </NavLink>
  );
}

function ProfileSheet({ open, onOpenChange }) {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(isDarkTheme());
  const [confirmLogout, setConfirmLogout] = useState(false);

  const go = (href) => {
    onOpenChange(false);
    navigate(href);
  };

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    setTheme(next);
    updateUser({ theme: next ? "dark" : "light" });
    fetch(BASE_API_URL + "/user/theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferences: next ? "dark" : "light", userId: user?._id }),
    }).catch(() => {});
  };

  const rows = [
    { icon: User, label: "Profile & settings", href: "/user/profile" },
    { icon: Cpu, label: "AI models", href: "/user/models" },
    { icon: Shield, label: "Privacy & security", href: "/user/privacy" },
  ];

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-3xl bg-[#f7f6f2] dark:bg-stone-950 border-stone-200 dark:border-stone-800 px-4 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-stone-300 dark:bg-stone-700" />
          <div className="flex items-center gap-3 px-2 pb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.image_profile} />
              <AvatarFallback className="bg-emerald-800 text-white">{(user?.nickname || user?.fullname || "?").slice(0, 1).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <SheetTitle className="text-base font-medium text-stone-900 dark:text-stone-50 truncate">{user?.fullname}</SheetTitle>
              <SheetDescription className="text-sm text-stone-500 truncate">{user?.email}</SheetDescription>
            </div>
          </div>
          <div className="rounded-2xl bg-white dark:bg-stone-900 divide-y divide-stone-100 dark:divide-stone-800 overflow-hidden">
            {rows.map((r) => (
              <button key={r.href} onClick={() => go(r.href)} className="w-full flex items-center gap-3 px-4 h-14 text-left active:bg-stone-50 dark:active:bg-stone-800">
                <r.icon className="w-5 h-5 text-stone-500" />
                <span className="flex-1 text-[15px] text-stone-800 dark:text-stone-100">{r.label}</span>
                <ChevronRight className="w-4 h-4 text-stone-300" />
              </button>
            ))}
            <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 h-14 text-left active:bg-stone-50 dark:active:bg-stone-800">
              {dark ? <Sun className="w-5 h-5 text-stone-500" /> : <Moon className="w-5 h-5 text-stone-500" />}
              <span className="flex-1 text-[15px] text-stone-800 dark:text-stone-100">{dark ? "Light theme" : "Dark theme"}</span>
            </button>
          </div>
          <button
            onClick={() => {
              onOpenChange(false);
              setConfirmLogout(true);
            }}
            className="mt-3 w-full flex items-center justify-center gap-2 h-12 rounded-2xl bg-white dark:bg-stone-900 text-orange-600 dark:text-orange-400 text-[15px] font-medium active:bg-orange-50"
          >
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </SheetContent>
      </Sheet>
      <LogoutConfirm open={confirmLogout} onOpenChange={setConfirmLogout} />
    </>
  );
}

export function AppShell() {
  const { user, isAddDialogOpen, setIsAddDialogOpen } = useAuth();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [launchCamera, setLaunchCamera] = useState(false);
  const home = isHome(location.pathname);
  const name = user?.nickname || user?.fullname?.split(" ")[0];

  const addReceipt = () => {
    setLaunchCamera(true);
    setIsAddDialogOpen(true);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#f7f6f2] dark:bg-stone-950 font-ui text-stone-800 dark:text-stone-100">
      <header className="sticky top-0 z-40 bg-[#f7f6f2]/95 dark:bg-stone-950/95 backdrop-blur-sm">
        <div className="h-16 px-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            {home ? (
              // The Home page already greets the user by name, so the bar shows the brand.
              <span className="flex items-center gap-2">
                <LogoMark className="w-8 h-8 text-lg" />
                <span className="font-display text-2xl text-stone-900 dark:text-stone-50">Recepta</span>
              </span>
            ) : (
              <h1 className="text-xl font-display text-stone-900 dark:text-stone-50 truncate">{TITLES[location.pathname.replace(/\/$/, "")] || "Recepta"}</h1>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <NotificationBell userId={user?._id} />
            <button onClick={() => setProfileOpen(true)} aria-label="Profile and settings" className="ml-1 rounded-full ring-2 ring-white dark:ring-stone-800">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.image_profile} />
                <AvatarFallback className="bg-emerald-800 text-white text-sm font-medium">{(name || "?").slice(0, 1).toUpperCase()}</AvatarFallback>
              </Avatar>
            </button>
          </div>
        </div>
      </header>

      {/* Room for the tab bar so the last card isn't hidden behind it. */}
      <main className="min-w-0 pb-28">
        <Outlet />
      </main>

      <nav
        aria-label="Main"
        className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm border-t border-stone-200 dark:border-stone-800 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="relative h-16 flex items-stretch">
          {TABS_LEFT.map((t) => (
            <Tab key={t.href} item={t} />
          ))}
          <div className="flex-1 flex flex-col items-center justify-end pb-1.5">
            <button
              onClick={addReceipt}
              aria-label="Add receipt"
              className="absolute -top-6 left-1/2 -translate-x-1/2 grid place-items-center w-16 h-16 rounded-full bg-emerald-700 dark:bg-emerald-600 text-white shadow-[0_10px_24px_-6px_rgba(6,95,70,0.55)] ring-[6px] ring-[#f7f6f2] dark:ring-stone-950 active:scale-95 transition-transform"
            >
              <Camera className="w-7 h-7" />
            </button>
            <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300">Add receipt</span>
          </div>
          {TABS_RIGHT.map((t) => (
            <Tab key={t.href} item={t} />
          ))}
        </div>
      </nav>

      <ProfileSheet open={profileOpen} onOpenChange={setProfileOpen} />
      <AdvanceForm
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        launchCamera={launchCamera}
        onCameraLaunched={() => setLaunchCamera(false)}
      />
    </div>
  );
}
