import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, RotateCw, Trash2, Maximize2, MapPin } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Receipt details. A plain fixed overlay rather than the Radix dialog: that
// version put the content in a ScrollArea with only a max-height, so tall
// receipts overflowed the screen, couldn't scroll, and pushed the close
// button out of reach. Here the header is pinned and the body scrolls.

const formatDate = (iso) => {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(d.getTime())) return null;
  return {
    date: d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
  };
};

function PhotoViewer({ src, alt, onClose }) {
  const [turns, setTurns] = useState(0);
  const sideways = turns % 2 === 1;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key.toLowerCase() === "r") setTurns((t) => t + 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] bg-black flex flex-col" role="dialog" aria-label="Receipt photo">
      <div className="flex items-center justify-end gap-2 p-3">
        <button
          onClick={() => setTurns((t) => t + 1)}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm"
        >
          <RotateCw className="w-4 h-4" /> Rotate
        </button>
        <button onClick={onClose} aria-label="Close photo" className="grid place-items-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 min-h-0 flex items-center justify-center p-4 overflow-hidden" onClick={onClose}>
        <img
          src={src}
          alt={alt}
          onClick={(e) => e.stopPropagation()}
          style={{ transform: `rotate(${turns * 90}deg)` }}
          className={`object-contain transition-transform duration-300 ${sideways ? "max-h-[92vw] max-w-[80dvh]" : "max-h-full max-w-full"}`}
        />
      </div>
    </div>
  );
}

const ReceiptDetailModal = ({ isOpen, onClose, data, onDelete }) => {
  const { money } = useAuth();
  const [viewing, setViewing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [imageOk, setImageOk] = useState(true);

  useEffect(() => {
    setViewing(false);
    setConfirmDelete(false);
    setImageOk(true);
  }, [data?._id, data?.id]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && !viewing && onClose(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, viewing, onClose]);

  if (!isOpen || !data) return null;

  const meta = data.metadata || {};
  const when = formatDate(meta.datetime);
  const isIncome = String(meta.type || data.type || "").toLowerCase() === "income";
  const photo = meta.receipt_image || null;
  const picture = photo || meta.image_source;
  const address = [data.address?.street, data.address?.city, data.address?.state, data.address?.zip].filter(Boolean).join(", ");
  const items = data.items || [];

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-stone-950/45 motion-safe:animate-in motion-safe:fade-in duration-200" onClick={() => onClose(false)} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="receipt-title"
        className="relative w-full sm:w-[440px] max-h-[92dvh] sm:max-h-[86dvh] flex flex-col bg-[#fdfcf8] dark:bg-stone-900 text-stone-800 dark:text-stone-100 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden motion-safe:animate-in motion-safe:slide-in-from-bottom-6 sm:motion-safe:zoom-in-95 duration-200"
      >
        {/* Pinned header */}
        <div className="shrink-0 flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-stone-200 dark:border-stone-800">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-stone-400">
              {isIncome ? "Income" : "Expense"}{meta.source_type ? ` · ${meta.source_type}` : ""}
            </p>
            <h2 id="receipt-title" className="font-display text-2xl leading-tight truncate">{data.store || "Unnamed entry"}</h2>
            {when && <p className="text-xs text-stone-500 dark:text-stone-400">{when.date} · {when.time}</p>}
          </div>
          <button onClick={() => onClose(false)} aria-label="Close" className="shrink-0 grid place-items-center w-9 h-9 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/70 dark:hover:text-white dark:hover:bg-stone-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          {picture && imageOk && (
            <button onClick={() => setViewing(true)} className="group relative block w-full h-44 bg-stone-200 dark:bg-stone-800 overflow-hidden" aria-label="View photo full size">
              <img src={picture} alt={photo ? "Receipt photo" : ""} onError={() => setImageOk(false)} className="w-full h-full object-cover" />
              <span className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-full bg-stone-950/70 text-white text-xs px-2.5 py-1">
                <Maximize2 className="w-3 h-3" /> {photo ? "View receipt" : "View image"}
              </span>
            </button>
          )}

          <div className="px-5 py-4 space-y-4">
            {(address || data.contact) && (
              <p className="flex items-start gap-2 text-xs text-stone-500 dark:text-stone-400">
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{[address, data.contact].filter(Boolean).join(" · ")}</span>
              </p>
            )}

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-stone-400 mb-2">{items.length} {items.length === 1 ? "item" : "items"}</p>
              <ul className="divide-y divide-dashed divide-stone-200 dark:divide-stone-800">
                {items.map((item, i) => (
                  <li key={i} className="flex items-baseline justify-between gap-3 py-2 text-sm">
                    <span className="min-w-0">
                      <span className="text-stone-800 dark:text-stone-200">
                        {item.quantity > 1 && <span className="text-stone-400 tabular-nums">{item.quantity}× </span>}
                        {item.description || "Item"}
                      </span>
                      {(item.category || item.type) && <span className="block text-[11px] text-stone-400">{item.category || item.type}</span>}
                    </span>
                    <span className="tabular-nums text-stone-600 dark:text-stone-300 shrink-0">{money.format((item.price || 0) * (item.quantity || 1))}</span>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="space-y-1 text-sm border-t border-stone-200 dark:border-stone-800 pt-3">
              {data.subtotal != null && Number(data.subtotal) !== Number(data.total) && (
                <div className="flex justify-between text-stone-500"><dt>Subtotal</dt><dd className="tabular-nums">{money.format(data.subtotal)}</dd></div>
              )}
              {Number(data.tax_amount) > 0 && (
                <div className="flex justify-between text-stone-500"><dt>Tax{data.tax_rate ? ` (${data.tax_rate}%)` : ""}</dt><dd className="tabular-nums">{money.format(data.tax_amount)}</dd></div>
              )}
              <div className="flex justify-between items-baseline pt-1">
                <dt className="font-medium">Total</dt>
                <dd className={`text-2xl font-semibold tabular-nums ${isIncome ? "text-emerald-800 dark:text-emerald-400" : ""}`}>
                  {isIncome ? "+" : ""}{money.format(data.total ?? data.subtotal ?? 0)}
                </dd>
              </div>
              {data.payment_method && <div className="flex justify-between text-xs text-stone-500 pt-1"><dt>Paid by</dt><dd className="capitalize">{data.payment_method}</dd></div>}
            </dl>

            {meta.notes && <p className="text-sm text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800/60 rounded-lg px-3 py-2">{meta.notes}</p>}
            {money.code !== "PHP" && <p className="text-[11px] text-stone-400">Recorded in pesos, shown in {money.code} at today's rate.</p>}
          </div>
        </div>

        {onDelete && (
          <div className="shrink-0 px-5 py-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2">
            {confirmDelete ? (
              <>
                <span className="text-sm text-stone-600 dark:text-stone-300 mr-auto">Delete this entry?</span>
                <button onClick={() => setConfirmDelete(false)} className="h-9 px-4 rounded-full text-sm hover:bg-stone-200/70 dark:hover:bg-stone-800">Keep</button>
                <button onClick={() => onDelete(data._id || data.id)} className="h-9 px-4 rounded-full text-sm bg-red-700 hover:bg-red-800 text-white">Delete</button>
              </>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-2 h-9 px-3 rounded-full text-sm text-stone-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            )}
          </div>
        )}
      </div>

      {viewing && picture && <PhotoViewer src={picture} alt={data.store || "Receipt"} onClose={() => setViewing(false)} />}
    </div>,
    document.body
  );
};

export default ReceiptDetailModal;
