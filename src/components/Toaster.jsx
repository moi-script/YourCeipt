import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom"; // <--- IMPORT THIS
import { X, CheckCircle2, AlertCircle, Info, Loader2 } from "lucide-react";

// ... (Keep ToastContext and ToastItem component exactly the same) ...

const ToastContext = createContext(null);

const ToastItem = ({ id, type, title, description, onDismiss }) => {
  // ... (Keep your existing ToastItem logic) ...
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), 4000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const styles = {
    success: { icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, border: "border-emerald-200 bg-emerald-50 dark:bg-stone-900", title: "text-emerald-900 dark:text-emerald-100" },
    error:   { icon: <AlertCircle className="w-5 h-5 text-red-600" />,     border: "border-red-200 bg-red-50 dark:bg-stone-900",     title: "text-red-900 dark:text-red-100" },
    loading: { icon: <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />, border: "border-blue-200 bg-blue-50 dark:bg-stone-900", title: "text-blue-900 dark:text-blue-100" },
    info:    { icon: <Info className="w-5 h-5 text-stone-600" />,    border: "border-stone-200 bg-white dark:bg-stone-900",  title: "text-stone-900 dark:text-stone-100" }
  };

  const style = styles[type] || styles.info;

  return (
    <div className={`pointer-events-auto w-full max-w-sm rounded-xl border ${style.border} shadow-2xl p-4 flex gap-3 items-start animate-in slide-in-from-bottom-5 fade-in duration-300`}>
      <div className="shrink-0 mt-0.5">{style.icon}</div>
      <div className="flex-1 grid gap-1">
        <h5 className={`text-sm font-bold ${style.title}`}>{title}</h5>
        {description && <p className="text-xs text-stone-500 dark:text-stone-400">{description}</p>}
      </div>
      <button onClick={() => onDismiss(id)} className="text-stone-400 hover:text-stone-600"><X className="w-4 h-4" /></button>
    </div>
  );
};

// --- UPDATED PROVIDER WITH PORTAL ---
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Use state to ensure we only render portal after mount (avoids SSR errors)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const addToast = useCallback((type, title, description) => {
    console.warn("Adding a toast");
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    console.log("Toast Added:", title); // Debug log
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (t, d) => addToast("success", t, d),
    error: (t, d) => addToast("error", t, d),
    loading: (t, d) => addToast("loading", t, d),
    info: (t, d) => addToast("info", t, d),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      
      {/* RENDER DIRECTLY TO BODY */}
      {mounted && createPortal(
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
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