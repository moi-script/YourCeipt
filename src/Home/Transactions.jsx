import { useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/Toaster.jsx";
import ReceiptDetailModal from "@/components/ReceiptModal";
import { IconLedger } from "@/components/icons";
import { BASE_API_URL } from "@/api/getKeys.js";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "expense", label: "Expenses" },
  { id: "income", label: "Income" },
];

const typeOf = (r) => (String(r?.metadata?.type || "").toLowerCase() === "income" ? "income" : "expense");
const categoryOf = (r) => r?.items?.find((i) => i.category)?.category || r?.items?.[0]?.type || "Other";
const amountOf = (r) => {
  const n = parseFloat(String(r?.total ?? r?.subtotal ?? 0).replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(n) ? n : 0;
};
const dateOf = (r) => {
  const d = new Date(r?.metadata?.datetime || r?.createdAt);
  return Number.isNaN(d.getTime()) ? null : d;
};

function Thumb({ receipt }) {
  const [ok, setOk] = useState(true);
  const src = receipt.metadata?.receipt_image || receipt.metadata?.image_source;
  const letter = (receipt.store || categoryOf(receipt) || "?").trim().charAt(0).toUpperCase();
  if (src && ok) {
    return <img src={src} alt="" loading="lazy" onError={() => setOk(false)} className="w-11 h-11 rounded-lg object-cover bg-stone-200 dark:bg-stone-800 shrink-0" />;
  }
  return (
    <span className={`w-11 h-11 rounded-lg grid place-items-center shrink-0 font-display text-xl ${typeOf(receipt) === "income" ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300" : "bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300"}`}>
      {letter}
    </span>
  );
}

export default function TransactionsPage() {
  const { userReceipts, setRefreshPage, setIsAddDialogOpen, money, isReceiptsLoading } = useAuth();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (Array.isArray(userReceipts) ? userReceipts : [])
      .filter((r) => r && !Array.isArray(r))
      .filter((r) => filter === "all" || typeOf(r) === filter)
      .filter((r) => {
        if (!q) return true;
        const hay = [r.store, r.metadata?.notes, categoryOf(r), ...(r.items || []).map((i) => i.description)].join(" ").toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => (dateOf(b)?.getTime() || 0) - (dateOf(a)?.getTime() || 0));
  }, [userReceipts, search, filter]);

  const totals = useMemo(() => {
    let spent = 0, earned = 0;
    for (const r of rows) (typeOf(r) === "income" ? (earned += amountOf(r)) : (spent += amountOf(r)));
    return { spent, earned };
  }, [rows]);

  const months = useMemo(() => {
    const map = new Map();
    for (const r of rows) {
      const d = dateOf(r);
      const key = d ? d.toLocaleDateString(undefined, { month: "long", year: "numeric" }) : "No date";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    }
    return [...map.entries()];
  }, [rows]);

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl leading-none text-stone-900 dark:text-stone-50">Transactions</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">Every receipt and entry you've saved.</p>
        </div>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="hidden sm:inline-flex items-center gap-2 h-10 px-4 rounded-full bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <label className="relative flex-1">
          <span className="sr-only">Search transactions</span>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stores, items or notes"
            className="w-full h-11 pl-10 pr-3 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[15px] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
          />
        </label>
        <div role="tablist" aria-label="Filter" className="inline-flex p-1 rounded-lg bg-stone-200/60 dark:bg-stone-900 self-start sm:self-auto">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`h-9 px-3.5 rounded-md text-sm transition-colors ${filter === f.id ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-50 shadow-sm" : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 divide-x divide-stone-200 dark:divide-stone-800 mb-6">
        {[
          { label: "Entries", value: rows.length.toLocaleString() },
          { label: "Spent", value: money.format(totals.spent, { compact: totals.spent >= 1e6 }) },
          { label: "Received", value: money.format(totals.earned, { compact: totals.earned >= 1e6 }), tone: "text-emerald-800 dark:text-emerald-400" },
        ].map((s) => (
          <div key={s.label} className="px-3 sm:px-4 py-3 min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-stone-400">{s.label}</p>
            <p className={`mt-0.5 font-semibold tabular-nums truncate text-sm sm:text-base ${s.tone || "text-stone-900 dark:text-stone-50"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {isReceiptsLoading && !rows.length ? (
        <ul className="space-y-2" aria-label="Loading">
          {[0, 1, 2, 3].map((i) => <li key={i} className="h-16 rounded-xl bg-stone-200/60 dark:bg-stone-900 animate-pulse" />)}
        </ul>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 dark:border-stone-700 px-6 py-14 text-center">
          <IconLedger className="w-8 h-8 mx-auto text-stone-400" />
          <p className="mt-3 font-medium text-stone-800 dark:text-stone-200">{search || filter !== "all" ? "Nothing matches that" : "No transactions yet"}</p>
          <p className="text-sm text-stone-500 mt-1">
            {search || filter !== "all" ? "Try a different search or filter." : "Add a receipt or type a quick note to get started."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {months.map(([month, list]) => (
            <section key={month}>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-stone-400 mb-2 px-1">{month}</h2>
              <ul className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 divide-y divide-stone-100 dark:divide-stone-800 overflow-hidden">
                {list.map((r) => {
                  const d = dateOf(r);
                  const income = typeOf(r) === "income";
                  return (
                    <li key={r._id}>
                      <button onClick={() => setSelected(r)} className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                        <Thumb receipt={r} />
                        <span className="flex-1 min-w-0">
                          <span className="block text-[15px] font-medium text-stone-900 dark:text-stone-100 truncate">{r.store || categoryOf(r)}</span>
                          <span className="block text-xs text-stone-500 dark:text-stone-400 truncate">
                            {d ? d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "No date"} · {categoryOf(r)}
                            {r.items?.length > 1 ? ` · ${r.items.length} items` : ""}
                          </span>
                        </span>
                        <span className={`shrink-0 text-[15px] font-semibold tabular-nums ${income ? "text-emerald-800 dark:text-emerald-400" : "text-stone-900 dark:text-stone-100"}`}>
                          {income ? "+" : "−"}{money.format(amountOf(r))}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}

      <ReceiptDetailModal isOpen={!!selected} onClose={() => setSelected(null)} data={selected} onDelete={handleDelete} />
    </div>
  );
}
