import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/Toaster.jsx";
import ReceiptDetailModal from "@/components/ReceiptModal";
import TransactionDashboardSkeleton from "@/components/loaders/HomeSkeletonLoader";
import { IconLedger, IconBudget } from "@/components/icons";
import { BASE_API_URL } from "@/api/getKeys.js";

import food from "../assets/food.webp";
import transport from "../assets/transportation.webp";
import utilities from "../assets/utilities.webp";
import shop from "../assets/shopping.webp";
import health from "../assets/healthcare.webp";
import income from "../assets/income.webp";
import general from "../assets/other.webp";

const CATEGORY_IMAGES = {
  food, groceries: food, dining: food, transportation: transport, utilities,
  shopping: shop, healthcare: health, income,
};

const categoryOf = (t) => t?.items?.find((i) => i.category)?.category || t?.items?.[0]?.type || "Other";
const isIncome = (t) => String(t?.metadata?.type || "").toLowerCase() === "income";
const amountOf = (t) => {
  const n = parseFloat(String(t?.total ?? t?.subtotal ?? 0).replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(n) ? n : 0;
};
const fallbackImage = (t) => CATEGORY_IMAGES[categoryOf(t).toLowerCase()] || general;

const change = (now, before) => {
  if (!before) return null;
  return ((now - before) / before) * 100;
};

function Stat({ label, value, delta, goodWhenUp = true, hint }) {
  const up = delta != null && delta >= 0;
  const good = delta == null ? null : up === goodWhenUp;
  return (
    <div className="rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-4 py-4 min-w-0">
      <p className="text-xs text-stone-500 dark:text-stone-400">{label}</p>
      <p className="mt-1 text-xl sm:text-2xl font-semibold tabular-nums text-stone-900 dark:text-stone-50 truncate">{value}</p>
      <p className={`mt-1 text-xs tabular-nums ${good == null ? "text-stone-400" : good ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}>
        {delta == null ? hint || "No data for last month" : `${up ? "▲" : "▼"} ${Math.abs(delta).toFixed(0)}% vs last month`}
      </p>
    </div>
  );
}

function ReceiptCard({ t, onOpen, money }) {
  const [src, setSrc] = useState(t.metadata?.receipt_image || t.metadata?.image_source || fallbackImage(t));
  // Category icons are flat glyphs: show them small and centred, not cropped.
  const isIcon = Object.values(CATEGORY_IMAGES).includes(src) || src === general;
  const d = new Date(t.metadata?.datetime);
  return (
    <button onClick={() => onOpen(t)} className="group text-left rounded-xl overflow-hidden bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 transition-colors">
      <div className="h-28 bg-stone-100 dark:bg-stone-800 overflow-hidden">
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setSrc(fallbackImage(t))}
          className={isIcon
            ? "w-full h-full object-contain p-7 opacity-60 mix-blend-multiply dark:invert dark:mix-blend-screen"
            : "w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"}
        />
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">{t.store || categoryOf(t)}</p>
        <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
          {Number.isNaN(d.getTime()) ? "No date" : d.toLocaleDateString(undefined, { month: "short", day: "numeric" })} · {categoryOf(t)}
        </p>
        <p className={`mt-2 text-[15px] font-semibold tabular-nums ${isIncome(t) ? "text-emerald-800 dark:text-emerald-400" : "text-stone-900 dark:text-stone-100"}`}>
          {isIncome(t) ? "+" : ""}{money.format(amountOf(t))}
        </p>
      </div>
    </button>
  );
}

function TrendChart({ data, money }) {
  const max = Math.max(1, ...data.flatMap((d) => [d.income, d.expense]));
  return (
    <div>
      <div className="flex items-end gap-4 sm:gap-8 h-40">
        {data.map((d) => (
          <div key={d.month} className="flex-1 h-full flex flex-col justify-end">
            <div className="flex items-end justify-center gap-1.5 h-full">
              <span
                title={`Received ${money.format(d.income)}`}
                className="w-full max-w-[22px] rounded-t bg-emerald-700/85 dark:bg-emerald-500/80"
                style={{ height: `${(d.income / max) * 100}%`, minHeight: d.income ? 3 : 0 }}
              />
              <span
                title={`Spent ${money.format(d.expense)}`}
                className="w-full max-w-[22px] rounded-t bg-stone-400 dark:bg-stone-500"
                style={{ height: `${(d.expense / max) * 100}%`, minHeight: d.expense ? 3 : 0 }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 sm:gap-8 border-t border-stone-200 dark:border-stone-800 pt-2">
        {data.map((d) => (
          <div key={d.month} className="flex-1 text-center">
            <p className="text-xs text-stone-500">{d.month}</p>
            <p className="text-[11px] tabular-nums text-stone-400 truncate">{money.format(d.expense, { compact: true })}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-3 text-xs text-stone-500">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-700 dark:bg-emerald-500" /> Received</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-stone-400 dark:bg-stone-500" /> Spent</span>
      </div>
    </div>
  );
}

export function Home() {
  const [selected, setSelected] = useState(null);
  const toast = useToast();
  const {
    user, money, setRefreshPage, userReceipts, isReceiptsLoading, monthlyExpenses, monthlyIncome,
    setIsAddDialogOpen, previousIncome, previousExpense, categorySpent, spendingTrend,
  } = useAuth();

  const recent = useMemo(
    () =>
      (Array.isArray(userReceipts) ? userReceipts : [])
        .filter((r) => r && !Array.isArray(r))
        .sort((a, b) => new Date(b.metadata?.datetime || b.createdAt) - new Date(a.metadata?.datetime || a.createdAt))
        .slice(0, 8),
    [userReceipts]
  );

  const budgets = useMemo(
    () =>
      (categorySpent || []).map((b) => {
        const limit = Number(b.budgetAmount) || 0;
        const spent = Number(b.spent) || 0;
        return { name: b.budgetName || b.category, spent, limit, pct: limit ? (spent / limit) * 100 : 0 };
      }).sort((a, b) => b.pct - a.pct),
    [categorySpent]
  );

  const budgetTotals = budgets.reduce((acc, b) => ({ spent: acc.spent + b.spent, limit: acc.limit + b.limit }), { spent: 0, limit: 0 });
  const net = (monthlyIncome || 0) - (monthlyExpenses || 0);
  const trend = Array.isArray(spendingTrend) ? spendingTrend : [];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const handleDelete = async (id) => {
    try {
      const res = await fetch(BASE_API_URL + `/receipt/delete?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setSelected(null);
      setRefreshPage(true);
      toast.success("Entry deleted");
    } catch {
      toast.error("Couldn't delete that entry", "Please try again.");
    }
  };

  if (isReceiptsLoading && !userReceipts) return <TransactionDashboardSkeleton />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      <div>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h1 className="font-display text-4xl sm:text-5xl leading-tight text-stone-900 dark:text-stone-50">
          {greeting}, {user?.nickname || user?.fullname?.split(" ")[0] || "there"}
        </h1>
      </div>

      <section aria-label="This month" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Spent this month" value={money.format(monthlyExpenses || 0)} delta={change(monthlyExpenses || 0, previousExpense)} goodWhenUp={false} />
        <Stat label="Received this month" value={money.format(monthlyIncome || 0)} delta={change(monthlyIncome || 0, previousIncome)} />
        <Stat label="Net this month" value={money.format(net)} hint={net >= 0 ? "More in than out" : "More out than in"} />
        <Stat
          label="Budgets used"
          value={budgetTotals.limit ? `${Math.round((budgetTotals.spent / budgetTotals.limit) * 100)}%` : "No budgets"}
          hint={budgetTotals.limit ? `${money.format(budgetTotals.spent)} of ${money.format(budgetTotals.limit)}` : "Set one on the Budgets page"}
        />
      </section>

      <section aria-labelledby="recent-heading">
        <div className="flex items-end justify-between mb-3">
          <h2 id="recent-heading" className="text-lg font-medium text-stone-900 dark:text-stone-50">Recent activity</h2>
          {recent.length > 0 && (
            <Link to="/user/transactions" className="inline-flex items-center gap-1 text-sm text-emerald-800 hover:text-emerald-950 dark:text-emerald-400 dark:hover:text-emerald-300">
              See all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
        {recent.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-300 dark:border-stone-700 px-6 py-12 text-center">
            <IconLedger className="w-8 h-8 mx-auto text-stone-400" />
            <p className="mt-3 font-medium text-stone-800 dark:text-stone-200">Nothing logged yet</p>
            <p className="text-sm text-stone-500 mt-1 mb-5">Photograph a receipt or type a quick note to add your first entry.</p>
            <button onClick={() => setIsAddDialogOpen(true)} className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 text-white text-sm font-medium">
              <Plus className="w-4 h-4" /> Add your first entry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {recent.map((t) => <ReceiptCard key={t._id} t={t} onOpen={setSelected} money={money} />)}
          </div>
        )}
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        <section aria-labelledby="budgets-heading" className="rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5">
          <div className="flex items-end justify-between mb-4">
            <h2 id="budgets-heading" className="text-lg font-medium text-stone-900 dark:text-stone-50">Budgets</h2>
            <Link to="/user/budgets" className="text-sm text-emerald-800 hover:text-emerald-950 dark:text-emerald-400">Manage</Link>
          </div>
          {budgets.length === 0 ? (
            <div className="py-6 text-center">
              <IconBudget className="w-7 h-7 mx-auto text-stone-400" />
              <p className="text-sm text-stone-500 mt-2">No budgets yet. Add one to get a warning before you overspend.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {budgets.slice(0, 5).map((b) => {
                const over = b.pct > 100, near = b.pct >= 85;
                return (
                  <li key={b.name}>
                    <div className="flex items-baseline justify-between gap-3 text-sm mb-1.5">
                      <span className="text-stone-800 dark:text-stone-200 truncate">{b.name}</span>
                      <span className={`tabular-nums text-xs shrink-0 ${over ? "text-red-700 dark:text-red-400 font-medium" : near ? "text-amber-700 dark:text-amber-400" : "text-stone-500"}`}>
                        {money.format(b.spent)} of {money.format(b.limit)}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-stone-200/80 dark:bg-stone-800 overflow-hidden">
                      <div className={`h-full rounded-full ${over ? "bg-red-600" : near ? "bg-amber-500" : "bg-emerald-700 dark:bg-emerald-500"}`} style={{ width: `${Math.min(100, b.pct)}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section aria-labelledby="trend-heading" className="rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5">
          <div className="flex items-end justify-between mb-4">
            <h2 id="trend-heading" className="text-lg font-medium text-stone-900 dark:text-stone-50">Last four months</h2>
            <Link to="/user/analytics" className="text-sm text-emerald-800 hover:text-emerald-950 dark:text-emerald-400">Analytics</Link>
          </div>
          {trend.some((d) => d.income || d.expense) ? (
            <TrendChart data={trend} money={money} />
          ) : (
            <p className="text-sm text-stone-500 py-10 text-center">Your monthly totals appear here once you've logged a few entries.</p>
          )}
        </section>
      </div>

      <ReceiptDetailModal isOpen={!!selected} onClose={() => setSelected(null)} data={selected} onDelete={handleDelete} />
    </div>
  );
}
