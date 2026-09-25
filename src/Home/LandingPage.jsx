import React, { useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Moon, Sun, Menu, X, Check, Smartphone } from "lucide-react";
import { AuthModal } from "./AuthModal";
import { APK_URL, isNativeApp } from "@/lib/appRelease";

// The landing page is deliberately static: no scroll observers, blur layers
// or looping animations. The old version ran all three and made phones hot.

const GITHUB_URL = "https://github.com/moi-script/YourCeipt";

const peso = (n) => "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2 });

const RECEIPT = {
  store: "MERCURY DRUG",
  branch: "Tomas Morato Ave, Quezon City",
  date: "21/09/2026 18:42",
  items: [
    { name: "BIOGESIC 500MG 10S", price: 55.0 },
    { name: "ALCOHOL 70% 250ML", price: 68.5 },
    { name: "VITAMIN C 500MG 30S", price: 245.0 },
  ],
  total: 368.5,
  vat: 39.48,
  cash: 400.0,
};

function Logo() {
  return (
    <span className="flex items-center gap-2">
      <span className="grid place-items-center w-7 h-7 rounded-md bg-emerald-800 text-[#f7f6f2] font-display text-lg leading-none">R</span>
      <span className="font-medium tracking-tight text-stone-900 dark:text-stone-50">Recepta</span>
    </span>
  );
}

// Paper receipt on the left, what Recepta saves on the right.
function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.1fr] gap-4 sm:gap-0 items-center">
        {/* Receipt */}
        <figure
          aria-label="A printed pharmacy receipt"
          className="relative sm:-rotate-2 sm:mb-10 bg-white dark:bg-stone-100 text-stone-800 font-mono text-[11px] leading-[1.55] px-5 pt-5 pb-7 shadow-[0_1px_2px_rgba(41,37,36,0.06),0_12px_32px_-12px_rgba(41,37,36,0.25)] [mask-image:linear-gradient(to_bottom,black_92%,transparent)] sm:z-0"
        >
          <p className="text-center font-semibold tracking-wide">{RECEIPT.store}</p>
          <p className="text-center text-stone-500">{RECEIPT.branch}</p>
          <p className="text-center text-stone-500 mb-3">{RECEIPT.date}</p>
          <div className="border-t border-dashed border-stone-300 pt-2 space-y-0.5">
            {RECEIPT.items.map((it) => (
              <div key={it.name} className="flex justify-between gap-3">
                <span className="truncate">{it.name}</span>
                <span className="tabular-nums">{it.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-dashed border-stone-300 mt-2 pt-2 space-y-0.5">
            <div className="flex justify-between font-semibold"><span>TOTAL</span><span className="tabular-nums">{RECEIPT.total.toFixed(2)}</span></div>
            <div className="flex justify-between text-stone-500"><span>VAT 12% INCL</span><span className="tabular-nums">{RECEIPT.vat.toFixed(2)}</span></div>
            <div className="flex justify-between text-stone-500"><span>CASH</span><span className="tabular-nums">{RECEIPT.cash.toFixed(2)}</span></div>
            <div className="flex justify-between text-stone-500"><span>CHANGE</span><span className="tabular-nums">{(RECEIPT.cash - RECEIPT.total).toFixed(2)}</span></div>
          </div>
          <p className="text-center text-stone-400 mt-3">THANK YOU</p>
        </figure>

        {/* Ledger entry */}
        <div className="relative sm:-ml-3 sm:mt-16 sm:z-10 rounded-xl bg-[#fdfcfa] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-[0_24px_48px_-24px_rgba(41,37,36,0.35)] font-ui">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-200 dark:border-stone-800">
            <span className="text-[11px] text-stone-500 dark:text-stone-400">Saved to ledger</span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-800 dark:text-emerald-400">
              <Check className="w-3 h-3" /> 3 items
            </span>
          </div>
          <div className="p-4">
            <p className="text-sm font-medium text-stone-900 dark:text-stone-100">Mercury Drug</p>
            <p className="text-xs text-stone-500 dark:text-stone-400">Sep 21, 2026 · Quezon City</p>
            <ul className="mt-3 space-y-1.5 text-xs">
              {RECEIPT.items.map((it) => (
                <li key={it.name} className="flex items-baseline justify-between gap-2">
                  <span className="text-stone-700 dark:text-stone-300 truncate capitalize">{it.name.toLowerCase()}</span>
                  <span className="tabular-nums text-stone-500">{peso(it.price)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-end justify-between">
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300">Healthcare</span>
              <span className="text-lg font-semibold tabular-nums text-stone-900 dark:text-stone-50">{peso(RECEIPT.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const BUDGETS = [
  { name: "Groceries", spent: 4280, limit: 6000 },
  { name: "Dining", spent: 2915, limit: 3000 },
  { name: "Transportation", spent: 1140, limit: 2500 },
];

function BudgetSnippet() {
  return (
    <div className="rounded-xl bg-[#fdfcfa] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 space-y-5">
      <p className="text-xs text-stone-500 dark:text-stone-400">September budgets</p>
      {BUDGETS.map((b) => {
        const pct = Math.round((b.spent / b.limit) * 100);
        const warn = pct >= 90;
        return (
          <div key={b.name}>
            <div className="flex items-baseline justify-between text-sm mb-1.5">
              <span className="text-stone-800 dark:text-stone-200">{b.name}</span>
              <span className={`tabular-nums text-xs ${warn ? "text-amber-700 dark:text-amber-400 font-medium" : "text-stone-500"}`}>
                {peso(b.spent).replace(".00", "")} of {peso(b.limit).replace(".00", "")}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-stone-200/70 dark:bg-stone-800 overflow-hidden">
              <div className={`h-full rounded-full ${warn ? "bg-amber-600" : "bg-emerald-800 dark:bg-emerald-500"}`} style={{ width: `${pct}%` }} />
            </div>
            {warn && <p className="text-xs text-amber-800 dark:text-amber-400 mt-1.5">{pct}% used with 9 days left</p>}
          </div>
        );
      })}
    </div>
  );
}

const CATEGORY_SPEND = [
  { name: "Groceries", value: 4280 },
  { name: "Dining", value: 2915 },
  { name: "Utilities", value: 2340 },
  { name: "Transportation", value: 1140 },
  { name: "Healthcare", value: 368.5 },
];

function SpendSnippet() {
  const max = Math.max(...CATEGORY_SPEND.map((c) => c.value));
  return (
    <div className="rounded-xl bg-[#fdfcfa] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5">
      <div className="flex items-baseline justify-between mb-4">
        <p className="text-xs text-stone-500 dark:text-stone-400">Spent this month</p>
        <p className="text-lg font-semibold tabular-nums text-stone-900 dark:text-stone-50">
          {peso(CATEGORY_SPEND.reduce((a, c) => a + c.value, 0))}
        </p>
      </div>
      <ul className="space-y-2.5">
        {CATEGORY_SPEND.map((c) => (
          <li key={c.name} className="grid grid-cols-[96px_1fr_auto] items-center gap-3 text-xs">
            <span className="text-stone-700 dark:text-stone-300">{c.name}</span>
            <span className="h-2 rounded-sm bg-emerald-800/80 dark:bg-emerald-500/80" style={{ width: `${(c.value / max) * 100}%` }} />
            <span className="tabular-nums text-stone-500 w-16 text-right">{peso(c.value).replace(/\.\d+$/, "")}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const MODEL_ROWS = [
  { name: "Gemini 2.5 Flash", note: "Busy, handing off", state: "busy" },
  { name: "Gemini 3.6 Flash", note: "Read it in 4.1 s", state: "ok" },
  { name: "Nemotron 3 Super", note: "Standing by", state: "idle" },
];

function ModelSnippet() {
  const dot = { busy: "bg-amber-500", ok: "bg-emerald-600", idle: "bg-stone-300 dark:bg-stone-600" };
  return (
    <div className="rounded-xl bg-[#fdfcfa] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 divide-y divide-stone-200 dark:divide-stone-800">
      {MODEL_ROWS.map((m) => (
        <div key={m.name} className="flex items-center justify-between gap-3 px-5 py-3.5">
          <span className="flex items-center gap-2.5 text-sm text-stone-800 dark:text-stone-200">
            <span className={`w-1.5 h-1.5 rounded-full ${dot[m.state]}`} />
            {m.name}
          </span>
          <span className={`text-xs ${m.state === "ok" ? "text-emerald-800 dark:text-emerald-400" : "text-stone-500"}`}>{m.note}</span>
        </div>
      ))}
    </div>
  );
}

const STEPS = [
  {
    title: "Take a photo",
    body: 'Or type a note like "Grab home 180, lunch 250". Printed receipts from supermarkets, restaurants and pharmacies read best.',
  },
  {
    title: "Check what it read",
    body: "You see the store, each item, the tax and the total before anything is saved. If the paper was crumpled, fix the line and move on.",
  },
  {
    title: "Watch your budgets",
    body: "The entry lands in its category and counts against the budget you set for it. Your dashboard updates straight away.",
  },
];

const FEATURES = [
  {
    title: "Know you're close to a limit before you pass it",
    body: "Set a monthly amount for each category. Recepta flags a budget when you're getting near it and again if you go over, which gives you a few days to adjust instead of finding out at the end of the month.",
    visual: <BudgetSnippet />,
  },
  {
    title: "See where the month went",
    body: "Spending by category, by store and by day, built from your own receipts. Log your income too and the balance on the dashboard reflects what you actually have left.",
    visual: <SpendSnippet />,
  },
  {
    title: "One busy AI model won't hold up your receipt",
    body: "Receipts go to Google Gemini first. If it's rate limited or slow, the next working model takes over without you doing anything. You can also choose a model yourself and see how each one is performing.",
    visual: <ModelSnippet />,
    link: { to: "/aiEngine", label: "Live model status" },
  },
];

const FAQ = [
  {
    q: "What happens to my receipt photos?",
    a: "The photo goes to Microsoft Azure to read the text, and that text goes to Google Gemini (or the model you picked) to be split into items and totals. The photo is kept with the entry so you can look at it later, unless you switch that off in Privacy settings. Passwords are hashed, and you can turn on two-step sign-in with an emailed code.",
  },
  {
    q: "How accurate is it?",
    a: "Clear printed receipts come through correctly in our testing, including a 17-line restaurant bill. Faded thermal paper and handwriting are less reliable, which is why you see every result before it's saved.",
  },
  {
    q: "Which currency does it use?",
    a: "Everything is recorded in Philippine pesos. Receipts in other currencies can be read, but Recepta doesn't convert the amounts.",
  },
  {
    q: "Do I need a receipt for every expense?",
    a: 'No. Type something like "salary 15000" or "jeep 13, coffee 120" and it becomes an entry, or fill in the form by hand.',
  },
  {
    q: "Does it cost anything?",
    a: "Not at the moment. Recepta is free while it's in early access. The source code is on GitHub if you'd rather run your own copy with your own API keys.",
  },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  // Inside the Android app the download links would just point at itself.
  const showApk = !isNativeApp();
  const [auth, setAuth] = useState({ open: false, tab: "register" });
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : false
  );

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      /* storage blocked: theme just won't persist */
    }
  }, [isDark]);

  const openAuth = (tab) => {
    setMenuOpen(false);
    setAuth({ open: true, tab });
  };

  const navLinks = [
    { href: "#how", label: "How it works" },
    { href: "#features", label: "Features" },
    { href: "#faq", label: "Questions" },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#f7f6f2] dark:bg-stone-950 text-stone-700 dark:text-stone-300 font-ui antialiased selection:bg-emerald-800/20 [scroll-behavior:smooth]">
      <AuthModal isOpen={auth.open} onClose={(open) => setAuth((a) => ({ ...a, open }))} defaultTab={auth.tab} />

      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 bg-white px-3 py-2 rounded text-sm">
        Skip to content
      </a>

      {/* Nav */}
      <header className="sticky top-0 z-40 bg-[#f7f6f2]/95 dark:bg-stone-950/95 border-b border-stone-200/80 dark:border-stone-800/80">
        <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between" aria-label="Main">
          <a href="#top" aria-label="Recepta home"><Logo /></a>

          <div className="hidden md:flex items-center gap-8 text-sm">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors">
                {l.label}
              </a>
            ))}
            <Link to="/aiEngine" className="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors">
              Model status
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setIsDark((d) => !d)}
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              className="grid place-items-center w-9 h-9 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 dark:hover:text-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => openAuth("login")} className="hidden sm:block text-sm px-3 h-9 rounded-md text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 dark:text-stone-300 dark:hover:text-stone-100 dark:hover:bg-stone-800 transition-colors">
              Sign in
            </button>
            <button onClick={() => openAuth("register")} className="text-sm px-4 h-9 rounded-md bg-stone-900 text-stone-50 hover:bg-stone-800 active:translate-y-px dark:bg-stone-50 dark:text-stone-900 dark:hover:bg-white transition-colors">
              Get started
            </button>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu"
              aria-expanded={menuOpen}
              className="md:hidden grid place-items-center w-9 h-9 rounded-md text-stone-600 hover:bg-stone-200/60 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="md:hidden border-t border-stone-200 dark:border-stone-800 px-5 py-3 space-y-1 bg-[#f7f6f2] dark:bg-stone-950">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-stone-700 dark:text-stone-300">
                {l.label}
              </a>
            ))}
            <Link to="/aiEngine" className="block py-2 text-sm text-stone-700 dark:text-stone-300">Model status</Link>
            <button onClick={() => openAuth("login")} className="block w-full text-left py-2 text-sm text-stone-700 dark:text-stone-300">Sign in</button>
            {showApk && (
              <a href={APK_URL} className="block py-2 text-sm text-stone-700 dark:text-stone-300">Download Android app</a>
            )}
          </div>
        )}
      </header>

      <main id="main">
        {/* Hero */}
        <section id="top" className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 sm:pt-20 pb-20 sm:pb-28 grid lg:grid-cols-[1.05fr_1fr] gap-14 lg:gap-10 items-center">
          <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
            <p className="text-sm text-emerald-800 dark:text-emerald-400 mb-5">Expense tracking for people who keep their receipts</p>
            <h1 className="font-display text-[2.9rem] leading-[1.02] sm:text-6xl lg:text-[4.4rem] text-stone-900 dark:text-stone-50 tracking-[-0.01em] [text-wrap:balance]">
              Photograph the receipt. <span className="italic text-stone-500 dark:text-stone-400">Skip the typing.</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg leading-relaxed max-w-[34rem] [text-wrap:pretty]">
              Recepta reads the store, each item and the total from a photo, files it under the right category, and counts it against your budget. You check the result before it's saved.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
              <button
                onClick={() => openAuth("register")}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md bg-emerald-800 text-white text-[15px] font-medium hover:bg-emerald-900 active:translate-y-px transition-colors dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                Create a free account <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => openAuth("login")} className="h-12 text-[15px] text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white underline underline-offset-4 decoration-stone-300 hover:decoration-stone-500">
                I already have an account
              </button>
            </div>
            <p className="mt-5 text-xs text-stone-500">Free during early access. No card required.</p>
            {showApk && (
              <a href={APK_URL} className="mt-6 inline-flex items-center gap-2 text-sm text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white">
                <Smartphone className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                <span className="underline underline-offset-4 decoration-stone-300 hover:decoration-stone-500">Get the Android app</span>
                <span className="text-xs text-stone-500">APK · web updates arrive automatically</span>
              </a>
            )}
          </div>

          <HeroVisual />
        </section>

        {/* How it works */}
        <section id="how" className="border-t border-stone-200 dark:border-stone-800">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24">
            <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
              <h2 className="font-display text-4xl sm:text-5xl leading-[1.05] text-stone-900 dark:text-stone-50 [text-wrap:balance]">
                From paper to ledger in about ten seconds
              </h2>
              <ol className="grid sm:grid-cols-3 gap-8 sm:gap-6">
                {STEPS.map((s, i) => (
                  <li key={s.title} className="sm:border-l sm:border-stone-200 sm:dark:border-stone-800 sm:pl-6">
                    <span className="font-display text-3xl text-emerald-800 dark:text-emerald-400 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-3 font-medium text-stone-900 dark:text-stone-100">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed">{s.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-[#efede6] dark:bg-stone-900/40 border-y border-stone-200 dark:border-stone-800">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28 space-y-20 sm:space-y-28">
            {FEATURES.map((f, i) => (
              <article key={f.title} className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                <div className={i % 2 ? "md:order-2" : ""}>
                  <h2 className="font-display text-3xl sm:text-4xl leading-[1.1] text-stone-900 dark:text-stone-50 [text-wrap:balance]">{f.title}</h2>
                  <p className="mt-4 leading-relaxed max-w-md [text-wrap:pretty]">{f.body}</p>
                  {f.link && (
                    <Link to={f.link.to} className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-800 hover:text-emerald-950 dark:text-emerald-400 dark:hover:text-emerald-300">
                      {f.link.label} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
                <div className={`w-full max-w-md ${i % 2 ? "md:order-1 md:justify-self-start" : "md:justify-self-end"}`}>{f.visual}</div>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28 grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl leading-[1.05] text-stone-900 dark:text-stone-50">Questions</h2>
            <p className="mt-4 text-sm leading-relaxed max-w-xs">
              Something else?{" "}
              <a href={`${GITHUB_URL}/issues`} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-stone-900 dark:hover:text-white">
                Open an issue on GitHub
              </a>
              .
            </p>
          </div>
          <dl className="divide-y divide-stone-200 dark:divide-stone-800 border-y border-stone-200 dark:border-stone-800">
            {FAQ.map((item) => (
              <div key={item.q} className="py-6 grid sm:grid-cols-[14rem_1fr] gap-2 sm:gap-8">
                <dt className="font-medium text-stone-900 dark:text-stone-100">{item.q}</dt>
                <dd className="text-sm leading-relaxed [text-wrap:pretty]">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Closing CTA */}
        <section className="border-t border-stone-200 dark:border-stone-800">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h2 className="font-display text-4xl sm:text-5xl leading-[1.05] text-stone-900 dark:text-stone-50 max-w-xl [text-wrap:balance]">
              The receipt in your wallet is a good place to start.
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              {showApk && (
                <a
                  href={APK_URL}
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md border border-stone-300 text-stone-800 text-[15px] font-medium hover:bg-stone-200/60 active:translate-y-px transition-colors dark:border-stone-700 dark:text-stone-100 dark:hover:bg-stone-800"
                >
                  <Smartphone className="w-4 h-4" /> Download for Android
                </a>
              )}
              <button
                onClick={() => openAuth("register")}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md bg-emerald-800 text-white text-[15px] font-medium hover:bg-emerald-900 active:translate-y-px transition-colors dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                Create a free account <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row gap-4 sm:items-center justify-between text-sm text-stone-500">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-stone-400">© 2026 · Built by Moises Nugal</span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/legal" className="hover:text-stone-900 dark:hover:text-stone-200">Privacy</Link>
            <Link to="/legal" className="hover:text-stone-900 dark:hover:text-stone-200">Terms</Link>
            <Link to="/aiEngine" className="hover:text-stone-900 dark:hover:text-stone-200">Model status</Link>
            {showApk && <a href={APK_URL} className="hover:text-stone-900 dark:hover:text-stone-200">Android app</a>}
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hover:text-stone-900 dark:hover:text-stone-200">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
