import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { ScanLine, PieChart, Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "./AuthModal";

// What the Android app shows at "/" instead of the marketing landing page:
// a short splash while the saved session is checked, then either straight
// into the ledger or a welcome screen with sign up / sign in.

const MIN_SPLASH_MS = 900;

const hasSavedSession = () => {
  try {
    // Logout writes the string "false", so only "true" means signed in.
    return localStorage.getItem("user") === "true";
  } catch {
    return false;
  }
};

export function AppSplash({ message = "Opening your ledger" }) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-[#f7f6f2] dark:bg-stone-950" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-6">
        <span className="grid place-items-center w-20 h-20 rounded-[22px] bg-emerald-800 text-[#f7f6f2] font-display text-5xl leading-none shadow-[0_18px_40px_-14px_rgba(6,95,70,0.6)] motion-safe:animate-in motion-safe:zoom-in-90 motion-safe:fade-in duration-500">
          <span className="translate-y-[2px]">R</span>
        </span>
        <div className="text-center">
          <p className="font-display text-3xl text-stone-900 dark:text-stone-50">Recepta</p>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{message}</p>
        </div>
        <div className="h-1 w-28 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
          <div className="h-full w-1/2 rounded-full bg-emerald-700 dark:bg-emerald-500 animate-[splash-bar_1.1s_ease-in-out_infinite]" />
        </div>
      </div>
      <style>{`@keyframes splash-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }`}</style>
    </div>
  );
}

function Welcome() {
  const [auth, setAuth] = useState({ open: false, tab: "register" });
  const points = [
    { icon: ScanLine, text: "Snap a receipt and it's itemised for you" },
    { icon: Wallet, text: "Every peso counted against your budgets" },
    { icon: PieChart, text: "See where your money actually goes" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#f7f6f2] dark:bg-stone-950 px-6 pt-16 pb-[max(2rem,env(safe-area-inset-bottom))] font-ui">
      <AuthModal isOpen={auth.open} onClose={(open) => setAuth((a) => ({ ...a, open }))} defaultTab={auth.tab} />
      <div className="flex-1 flex flex-col justify-center motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 duration-500">
        <span className="grid place-items-center w-16 h-16 rounded-[18px] bg-emerald-800 text-[#f7f6f2] font-display text-4xl leading-none">
          <span className="translate-y-[2px]">R</span>
        </span>
        <h1 className="mt-8 font-display text-[2.6rem] leading-[1.02] text-stone-900 dark:text-stone-50">
          Photograph the receipt. <span className="italic text-stone-500 dark:text-stone-400">Skip the typing.</span>
        </h1>
        <ul className="mt-8 space-y-4">
          {points.map((p) => (
            <li key={p.text} className="flex items-center gap-3 text-[15px] text-stone-700 dark:text-stone-300">
              <span className="grid place-items-center w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 shrink-0">
                <p.icon className="w-[18px] h-[18px]" />
              </span>
              {p.text}
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-3">
        <button
          onClick={() => setAuth({ open: true, tab: "register" })}
          className="w-full h-14 rounded-2xl bg-emerald-800 dark:bg-emerald-600 text-white text-base font-medium active:scale-[0.98] transition-transform"
        >
          Create a free account
        </button>
        <button
          onClick={() => setAuth({ open: true, tab: "login" })}
          className="w-full h-14 rounded-2xl border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 text-base font-medium active:scale-[0.98] transition-transform"
        >
          I already have an account
        </button>
      </div>
    </div>
  );
}

export default function AppEntry() {
  const { user, isLoading } = useAuth();
  const [savedSession] = useState(hasSavedSession);
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), MIN_SPLASH_MS);
    return () => clearTimeout(t);
  }, []);

  // The session check only runs when a session was saved; without one there's
  // nothing to wait for beyond the splash itself.
  const checking = savedSession && isLoading;
  if (!minTimePassed || checking) return <AppSplash message={savedSession ? "Opening your ledger" : "Getting things ready"} />;
  if (user) return <Navigate to="/user" replace />;
  return <Welcome />;
}
