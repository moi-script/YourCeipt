import { useCallback, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import UserMenu from "./Logout";
import { useAuth } from "@/context/AuthContext";
import { AdvanceForm } from "@/Input/AdvanceForm";
import { IconOverview, IconLedger, IconBudget, IconReader, IconTrends, LogoMark } from "@/components/icons";

const NAV = [
  { title: "Overview", icon: IconOverview, href: "/user/" },
  { title: "Transactions", icon: IconLedger, href: "/user/transactions" },
  { title: "Budgets", icon: IconBudget, href: "/user/budgets" },
  { title: "Analytics", icon: IconTrends, href: "/user/analytics" },
  { title: "AI models", icon: IconReader, href: "/user/models" },
];

const DESKTOP_QUERY = "(min-width: 1024px)";

// On phones the menu is a drawer over the page; on desktop it's a column that
// can collapse. The old version sized the sidebar from `resize` events, which
// mobile browsers fire whenever the address bar shows or hides, so the menu
// opened and closed by itself while scrolling.
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isDesktop;
}

function NavList({ onNavigate }) {
  const location = useLocation();
  return (
    <nav className="px-3 py-2" aria-label="Main">
      <ul className="space-y-0.5">
        {NAV.map((item) => {
          const active = item.href === "/user/" ? location.pathname === "/user" || location.pathname === "/user/" : location.pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <NavLink
                to={item.href}
                end={item.href === "/user/"}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`group relative flex items-center gap-3 h-10 px-3 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-white text-stone-900 shadow-[0_1px_2px_rgba(28,25,23,0.08)] dark:bg-stone-800 dark:text-stone-50"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800/60"
                }`}
              >
                {active && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-emerald-700 dark:bg-emerald-400" />}
                <item.icon className={`w-[18px] h-[18px] ${active ? "text-emerald-800 dark:text-emerald-400" : ""}`} />
                <span className="font-medium">{item.title}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SidebarContent({ onNavigate }) {
  return (
    <div className="flex flex-col h-full">
      <div className="h-16 px-5 flex items-center gap-2.5 shrink-0">
        <LogoMark />
        <span className="font-medium tracking-tight text-stone-900 dark:text-stone-50">Recepta</span>
      </div>
      <NavList onNavigate={onNavigate} />
      <div className="mt-auto">
        <UserMenu onNavigate={onNavigate} />
      </div>
    </div>
  );
}

export function BudgetDashboard() {
  const { isAddDialogOpen, setIsAddDialogOpen } = useAuth();
  const isDesktop = useIsDesktop();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("recepta.sidebar") === "collapsed";
    } catch {
      return false;
    }
  });
  const location = useLocation();

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // Close the drawer on every navigation, and when switching to desktop.
  useEffect(() => closeDrawer(), [location.pathname, closeDrawer]);
  useEffect(() => {
    if (isDesktop) closeDrawer();
  }, [isDesktop, closeDrawer]);

  // Lock page scroll behind the open drawer; Escape closes it.
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && closeDrawer();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, closeDrawer]);

  const toggleMenu = () => {
    if (isDesktop) {
      setCollapsed((c) => {
        try {
          localStorage.setItem("recepta.sidebar", c ? "open" : "collapsed");
        } catch {
          /* ignore */
        }
        return !c;
      });
    } else {
      setDrawerOpen((o) => !o);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#f7f6f2] dark:bg-stone-950 font-ui text-stone-800 dark:text-stone-100">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:block fixed inset-y-0 left-0 z-30 w-64 border-r border-stone-200 dark:border-stone-800 bg-[#efede6] dark:bg-stone-900/60 transition-transform duration-300 ease-out ${
          collapsed ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed inset-0 z-50 ${drawerOpen ? "" : "pointer-events-none"}`} aria-hidden={!drawerOpen} inert={!drawerOpen}>
        <div
          onClick={closeDrawer}
          className={`absolute inset-0 bg-stone-950/40 transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={`absolute inset-y-0 left-0 w-[82%] max-w-[300px] bg-[#f7f6f2] dark:bg-stone-900 shadow-2xl transition-transform duration-300 ease-out ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent onNavigate={closeDrawer} />
        </aside>
      </div>

      <div className={`transition-[padding] duration-300 ease-out ${collapsed ? "lg:pl-0" : "lg:pl-64"}`}>
        <Header onMenu={toggleMenu} menuOpen={isDesktop ? !collapsed : drawerOpen} onAdd={() => setIsAddDialogOpen(true)} />
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>

      <AdvanceForm setIsAddDialogOpen={setIsAddDialogOpen} isAddDialogOpen={isAddDialogOpen} />
    </div>
  );
}
