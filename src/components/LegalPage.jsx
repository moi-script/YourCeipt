import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, ArrowUpRight, Github } from "lucide-react";

// Plain, specific statements only: everything here should match what the app
// and backend actually do. Update the date when the content changes.
const UPDATED = "September 25, 2026";
const GITHUB_URL = "https://github.com/moi-script/YourCeipt";
const PORTFOLIO_URL = "https://portfolio-five-xi-51.vercel.app/";

const TABS = [
  { id: "privacy", label: "Privacy" },
  { id: "terms", label: "Terms" },
  { id: "about", label: "About" },
];

function H({ children }) {
  return <h2 className="mt-12 first:mt-0 font-display text-2xl sm:text-3xl text-stone-900 dark:text-stone-50">{children}</h2>;
}

function P({ children }) {
  return <p className="mt-3 leading-relaxed [text-wrap:pretty]">{children}</p>;
}

function List({ items }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 leading-relaxed">
          <span className="mt-2.5 w-1 h-1 rounded-full bg-emerald-700 dark:bg-emerald-400 shrink-0" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

// The part people most need to know, so it sits at the top of both Privacy
// and Terms rather than inside a numbered section.
export function FreeAiNotice({ compact = false }) {
  return (
    <aside id="ai" className="rounded-2xl border border-amber-300/80 dark:border-amber-800/70 bg-amber-50 dark:bg-amber-950/30 p-5 sm:p-6">
      <div className="flex gap-3">
        <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0 text-amber-700 dark:text-amber-400" />
        <div className="text-amber-950 dark:text-amber-100">
          <p className="font-semibold">Recepta runs on free AI services. What you scan is shared with them.</p>
          <p className="mt-2 text-sm leading-relaxed text-amber-900/90 dark:text-amber-100/80">
            Recepta is free, so it uses the <strong>free tiers</strong> of outside AI providers. When you scan a receipt or type an entry, that content leaves Recepta:
          </p>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-amber-900/90 dark:text-amber-100/80 list-disc pl-5">
            <li><strong>Microsoft Azure AI Vision</strong> receives the receipt photo to read its text.</li>
            <li><strong>Google Gemini</strong> (free tier) receives that text, or the note you typed, to sort it into items and totals.</li>
            <li>If Gemini is busy, or you pick another model, the text goes to <strong>free models on OpenRouter</strong>, which pass it to the company that runs that model.</li>
          </ul>
          {!compact && (
            <p className="mt-3 text-sm leading-relaxed text-amber-900/90 dark:text-amber-100/80">
              <strong>On free tiers, these providers may keep what they receive, have people review it, and use it to improve their models.</strong> Their own terms apply, not ours, and Recepta can't delete data once they have it. Store names, items, amounts and anything else printed on the receipt can be included. Don't scan receipts that show card numbers, IDs, addresses or anything you wouldn't want a third party to read. Crossing those details out before taking the photo works.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

function Privacy() {
  return (
    <>
      <FreeAiNotice />

      <H>What Recepta stores</H>
      <List
        items={[
          <><strong className="text-stone-900 dark:text-stone-100">Your account:</strong> name, email, profile picture and a hashed password. The password itself is never stored.</>,
          <><strong className="text-stone-900 dark:text-stone-100">Your records:</strong> transactions, items, categories, budgets, alerts and income you enter or scan.</>,
          <><strong className="text-stone-900 dark:text-stone-100">Receipt photos:</strong> kept with their entry on Cloudinary so you can look at them later. You can switch this off in Privacy &amp; security; it applies to new receipts.</>,
        ]}
      />
      <P>Records are kept in a MongoDB database. Connections to Recepta use HTTPS.</P>

      <H>What Recepta doesn't do</H>
      <List
        items={[
          "Sell your data or share it with advertisers.",
          "Show ads or use trackers for advertising.",
          "Connect to your bank or read your accounts. Recepta only knows what you give it.",
        ]}
      />

      <H>Your controls</H>
      <List
        items={[
          "Download everything Recepta holds about you as JSON, or your transactions as CSV, from Privacy & security.",
          "Turn on two-step sign-in, which asks for a code sent to your email.",
          "Delete your account. This removes your profile, every entry, budgets, alerts and stored photos. It can't be undone. It also can't recall anything the AI providers above already received.",
        ]}
      />

      <H>Questions</H>
      <P>
        Recepta is a one-person project, so there's no support inbox. Open an issue on{" "}
        <a href={`${GITHUB_URL}/issues`} target="_blank" rel="noreferrer" className="text-emerald-800 dark:text-emerald-400 underline underline-offset-4">GitHub</a>{" "}
        or reach the developer through the{" "}
        <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer" className="text-emerald-800 dark:text-emerald-400 underline underline-offset-4">portfolio site</a>.
      </P>
    </>
  );
}

function Terms() {
  return (
    <>
      <FreeAiNotice compact />

      <H>1. Using Recepta</H>
      <P>
        By creating an account or using Recepta on the web or the Android app, you agree to these terms. If you don't agree, please don't use it.
        Recepta is free during early access. Features, limits and these terms may change, and when they do the date at the top is updated.
      </P>

      <H>2. AI results can be wrong</H>
      <P>
        Receipts are read by AI models, which can misread amounts, skip items or invent lines, especially on faded or crumpled paper.
        You see every result before it's saved, and you're responsible for checking it. Don't rely on Recepta alone for taxes, accounting, reimbursement or legal purposes; keep the original receipt.
      </P>

      <H>3. Third-party AI services</H>
      <P>
        Scanning and typed entries depend on free tiers of Microsoft Azure, Google Gemini and models reached through OpenRouter. By using those features you agree that your content is sent to them and handled under their terms, as described in the notice above.
        Free quotas run out and providers change their models, so scanning may be slow or unavailable at times.
      </P>

      <H>4. Not financial advice</H>
      <P>Recepta is a record-keeping and budgeting tool. Budgets, charts and summaries are for your information and aren't financial, tax or investment advice.</P>

      <H>5. Your account</H>
      <List
        items={[
          "Keep your password to yourself. You're responsible for what happens under your account.",
          "Only upload receipts and content you're allowed to share, and nothing illegal.",
          "Don't try to break, overload or get around the limits of the service, including the AI quotas it shares with other users.",
        ]}
      />
      <P>Accounts that break these rules can be suspended or deleted.</P>

      <H>6. Your data</H>
      <P>Your records belong to you. You can export or delete them at any time, as described in the Privacy tab.</P>

      <H>7. No guarantees</H>
      <P>
        Recepta is provided as is, with no warranty. It runs on free hosting and may be slow, go offline, or lose data. Export anything you can't afford to lose.
        To the extent the law allows, the developer isn't liable for losses that come from using Recepta or from errors in what it records.
      </P>

      <H>8. The Android app</H>
      <P>
        The Android app is distributed directly as an APK, not through Google Play. Only install it from this website or the project's GitHub releases.
        The app checks for new versions and asks before installing them.
      </P>

      <H>9. Governing law</H>
      <P>These terms are governed by the laws of the Republic of the Philippines, including the Data Privacy Act of 2012.</P>
    </>
  );
}

function About() {
  return (
    <>
      <H>What Recepta is</H>
      <P>
        Recepta turns a photo of a receipt, or a quick note like "jeep 13, coffee 120", into an organised ledger. It files each entry under a category,
        counts it against your budgets, and shows where your money went. It's built for everyday spending in the Philippines.
      </P>
      <P>
        It's an independent, early-access project with no company or investors behind it. Keeping it free is why it relies on free AI tiers, which is the trade-off explained in the Privacy tab.
      </P>

      <H>Who made it</H>
      <div className="mt-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5">
        <span className="grid place-items-center w-14 h-14 shrink-0 rounded-2xl bg-emerald-800 text-[#f7f6f2] font-display text-2xl">MN</span>
        <div className="flex-1">
          <p className="font-medium text-stone-900 dark:text-stone-100">Moises Nugal</p>
          <p className="mt-1 text-sm leading-relaxed">Designed and built Recepta end to end: the web app, the API, the receipt pipeline and the Android app.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-md bg-emerald-800 text-white text-sm font-medium hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            Portfolio <ArrowUpRight className="w-4 h-4" />
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-md border border-stone-300 dark:border-stone-700 text-sm text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <Github className="w-4 h-4" /> Source
          </a>
        </div>
      </div>

      <H>Built with</H>
      <P>React and Vite on Vercel, a Node.js API on Render, MongoDB, Cloudinary for photos, Microsoft Azure AI Vision for reading receipts, Google Gemini and OpenRouter models for sorting them, and Capacitor for the Android app.</P>
    </>
  );
}

export default function LegalPage() {
  const [params, setParams] = useSearchParams();
  const tab = TABS.some((t) => t.id === params.get("tab")) ? params.get("tab") : "privacy";

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [tab]);

  return (
    <div className="min-h-[100dvh] bg-[#f7f6f2] dark:bg-stone-950 text-stone-700 dark:text-stone-300 font-ui antialiased">
      <header className="sticky top-0 z-40 bg-[#f7f6f2]/95 dark:bg-stone-950/95 border-b border-stone-200/80 dark:border-stone-800/80">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100">
            <ArrowLeft className="w-4 h-4" /> Recepta
          </Link>
          <nav className="flex gap-1 p-1 rounded-lg bg-stone-200/60 dark:bg-stone-900" aria-label="Sections">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setParams({ tab: t.id }, { replace: true })}
                aria-current={tab === t.id ? "page" : undefined}
                className={`px-3 sm:px-4 h-8 rounded-md text-sm transition-colors ${
                  tab === t.id
                    ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-50 shadow-sm"
                    : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <h1 className="font-display text-4xl sm:text-5xl leading-[1.05] text-stone-900 dark:text-stone-50">
          {tab === "privacy" ? "Privacy" : tab === "terms" ? "Terms of use" : "About Recepta"}
        </h1>
        {tab !== "about" && <p className="mt-3 text-sm text-stone-500">Last updated {UPDATED}</p>}
        <div className="mt-10">
          {tab === "privacy" && <Privacy />}
          {tab === "terms" && <Terms />}
          {tab === "about" && <About />}
        </div>
      </main>

      <footer className="border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 text-sm text-stone-500 flex flex-wrap gap-x-6 gap-y-2 justify-between">
          <span>© 2026 Recepta · Built by Moises Nugal</span>
          <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer" className="hover:text-stone-900 dark:hover:text-stone-200">Portfolio</a>
        </div>
      </footer>
    </div>
  );
}
