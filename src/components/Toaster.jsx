import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { X, Loader2 } from "lucide-react";

const ToastContext = createContext(null);

const TONES = {
  success: { bar: "bg-emerald-600", label: "Done" },
  error: { bar: "bg-red-600", label: "Problem" },
  warning: { bar: "bg-amber-500", label: "Heads up" },
  loading: { bar: "bg-stone-400", label: "Working" },
  info: { bar: "bg-stone-400", label: "Note" },
};

const ToastItem = ({ id, type, title, description, onDismiss }) => {
  useEffect(() => {
    if (type === "loading") return;
    const timer = setTimeout(() => onDismiss(id), type === "error" ? 6000 : 4000);
    return () => clearTimeout(timer);
  }, [id, type, onDismiss]);

  const tone = TONES[type] || TONES.info;

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className="pointer-events-auto w-full sm:w-[360px] overflow-hidden rounded-lg bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-800 shadow-[0_12px_32px_-12px_rgba(28,25,23,0.35)] flex motion-safe:animate-in motion-safe:slide-in-from-bottom-3 motion-safe:fade-in duration-200"
    >
      <span className={`w-1 shrink-0 ${tone.bar}`} />
      <div className="flex-1 min-w-0 px-4 py-3">
        <p className="text-[11px] uppercase tracking-[0.08em] text-stone-400 flex items-center gap-1.5">
          {type === "loading" && <Loader2 className="w-3 h-3 animate-spin" />}
          {tone.label}
        </p>
        <p className="text-sm font-medium mt-0.5">{title}</p>
        {description && <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onDismiss(id)}
        aria-label="Dismiss"
        className="self-start m-2 p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:text-stone-200 dark:hover:bg-stone-800"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const addToast = useCallback((type, title, description) => {
    const id = Math.random().toString(36).slice(2, 11);
    // Keep at most three on screen.
    setToasts((prev) => [...prev.slice(-2), { id, type, title, description }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useMemo(
    () => ({
      success: (t, d) => addToast("success", t, d),
      error: (t, d) => addToast("error", t, d),
      warning: (t, d) => addToast("warning", t, d),
      loading: (t, d) => addToast("loading", t, d),
      info: (t, d) => addToast("info", t, d),
      dismiss: removeToast,
    }),
    [addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {mounted &&
        createPortal(
          <div className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:right-6 sm:bottom-6 z-[9999] flex flex-col gap-2 pointer-events-none">
            {toasts.map((t) => (
              <ToastItem key={t.id} {...t} onDismiss={removeToast} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
