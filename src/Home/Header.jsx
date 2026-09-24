import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { NotificationBell } from "@/components/NotificationPanel";
import { IconMenu, IconTheme, LogoMark } from "@/components/icons";
import { isDarkTheme, setTheme } from "@/lib/theme";
import { BASE_API_URL } from "@/api/getKeys";

export function Header({ onMenu, menuOpen, onAdd }) {
  const { user, updateUser } = useAuth();

  const toggleTheme = () => {
    const dark = !isDarkTheme();
    setTheme(dark);
    updateUser({ theme: dark ? "dark" : "light" });
    fetch(BASE_API_URL + "/user/theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferences: dark ? "dark" : "light", userId: user?._id }),
    }).catch(() => {});
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#f7f6f2]/95 dark:bg-stone-950/95 border-b border-stone-200/80 dark:border-stone-800/80">
      <div className="h-full max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="grid place-items-center w-10 h-10 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <IconMenu className="w-5 h-5" />
          </button>
          <span className="lg:hidden flex items-center gap-2 min-w-0">
            <LogoMark className="w-6 h-6 text-sm" />
            <span className="font-medium tracking-tight truncate">Recepta</span>
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Switch light or dark theme"
            className="grid place-items-center w-10 h-10 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <IconTheme className="w-5 h-5 transition-transform duration-500 dark:rotate-180" />
          </button>
          <NotificationBell userId={user?._id} />
          <button
            onClick={onAdd}
            className="ml-1 inline-flex items-center gap-2 h-10 px-3 sm:px-4 rounded-full bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-sm font-medium active:translate-y-px transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add transaction</span>
            <span className="sr-only sm:hidden">Add transaction</span>
          </button>
        </div>
      </div>
    </header>
  );
}
