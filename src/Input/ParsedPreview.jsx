import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const peso = (n) =>
  typeof n === "number"
    ? "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "—";

const modelLabel = (id = "") =>
  id.split("/").pop().replace(/:free$/, "").replace(/-preview$/, "").replace(/-/g, " ");

// What the AI read, shown before anything is saved, so a wrong total gets
// caught here instead of in next month's budget.
export function ParsedPreview({ receipt, info }) {
  const [imageOk, setImageOk] = useState(true);
  if (!receipt) return null;

  const items = receipt.items || [];
  const date = receipt.metadata?.datetime ? new Date(receipt.metadata.datetime) : null;
  const seconds = info?.timings
    ? Object.values(info.timings).reduce((a, b) => a + (b || 0), 0) / 1000
    : null;
  const image = receipt.metadata?.image_source;

  return (
    <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden text-left">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-stone-50 dark:bg-stone-950/60 border-b border-stone-200 dark:border-stone-800">
        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" /> Read successfully
        </span>
        {info?.model && (
          <span className="text-[11px] text-stone-500 dark:text-stone-400 truncate capitalize">
            {modelLabel(info.model)}
            {seconds ? ` · ${seconds.toFixed(1)}s` : ""}
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-medium text-stone-900 dark:text-stone-100 truncate">{receipt.store || (receipt.metadata?.source_type === "text" ? "Quick entry" : "Unnamed store")}</p>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {date && !Number.isNaN(date.getTime())
                ? date.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })
                : "No date on receipt"}
              {receipt.address?.city ? ` · ${receipt.address.city}` : ""}
              {receipt.metadata?.type === "Income" ? " · Income" : ""}
            </p>
          </div>
          {image && imageOk && (
            <img
              src={image}
              alt=""
              onError={() => setImageOk(false)}
              className="w-12 h-12 rounded-lg object-cover border border-stone-200 dark:border-stone-700 shrink-0"
            />
          )}
        </div>

        {items.length > 0 && (
          <ul className="divide-y divide-stone-100 dark:divide-stone-800 text-sm max-h-44 overflow-y-auto">
            {items.map((item, i) => (
              <li key={i} className="flex items-baseline justify-between gap-3 py-1.5">
                <span className="min-w-0 truncate text-stone-700 dark:text-stone-300">
                  {item.quantity > 1 && <span className="text-stone-400 tabular-nums">{item.quantity}× </span>}
                  {item.description || "Item"}
                  <span className="ml-2 text-[11px] text-stone-400">{item.category}</span>
                </span>
                <span className="tabular-nums text-stone-600 dark:text-stone-400 shrink-0">{peso(item.price)}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-baseline justify-between pt-2 border-t border-stone-200 dark:border-stone-800">
          <span className="text-sm text-stone-500 dark:text-stone-400">
            Total{receipt.tax_amount ? ` (incl. ${peso(receipt.tax_amount)} tax)` : ""}
          </span>
          <span className="text-lg font-semibold tabular-nums text-stone-900 dark:text-stone-50">{peso(receipt.total)}</span>
        </div>
      </div>
    </div>
  );
}
