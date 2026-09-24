import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { IconInbox } from "@/components/icons";
import { BASE_API_URL } from "@/api/getKeys";

// Notifications as a strip of receipt paper: a timestamp column, a rubber
// stamp for the kind of alert, dashed tear lines between entries.

const STAMPS = {
  error: { label: "Over", cls: "text-red-700 border-red-700/60 dark:text-red-400 dark:border-red-400/60" },
  alert: { label: "Over", cls: "text-red-700 border-red-700/60 dark:text-red-400 dark:border-red-400/60" },
  warning: { label: "Near", cls: "text-amber-700 border-amber-700/60 dark:text-amber-400 dark:border-amber-400/60" },
  success: { label: "Saved", cls: "text-emerald-800 border-emerald-800/50 dark:text-emerald-400 dark:border-emerald-400/60" },
  info: { label: "Note", cls: "text-stone-500 border-stone-400 dark:text-stone-400 dark:border-stone-500" },
};

const dayLabel = (d) => {
  const today = new Date();
  const yesterday = new Date(Date.now() - 864e5);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export function NotificationBell({ userId }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  const load = async () => {
    if (!userId) return;
    try {
      const res = await fetch(BASE_API_URL + "/notification/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      setItems(Array.isArray(data.notifications) ? data.notifications : []);
    } catch {
      /* keep what we have */
    }
  };

  // Light polling while the tab is visible, so budget alerts show up.
  useEffect(() => {
    load();
    const tick = () => document.visibilityState === "visible" && load();
    const timer = setInterval(tick, 60000);
    return () => clearInterval(timer);
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onClick = (e) => {
      if (!panelRef.current?.contains(e.target) && !buttonRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const unread = items.filter((n) => !n.isRead).length;

  const groups = useMemo(() => {
    const sorted = [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 30);
    const map = new Map();
    for (const n of sorted) {
      const key = dayLabel(new Date(n.createdAt));
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(n);
    }
    return [...map.entries()];
  }, [items]);

  const markRead = async (id) => {
    setItems((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    fetch(BASE_API_URL + "/notification/read", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: id }),
    }).catch(() => {});
  };

  const markAll = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    fetch(BASE_API_URL + "/notification/read-all", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    }).catch(() => {});
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((o) => !o)}
        aria-label={unread ? `Activity, ${unread} unread` : "Activity"}
        aria-expanded={open}
        className="relative grid place-items-center w-10 h-10 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800 transition-colors"
      >
        <IconInbox className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute top-1 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-[10px] font-semibold leading-[18px] text-stone-950 tabular-nums ring-2 ring-[#f7f6f2] dark:ring-stone-950">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Phone: dim the page behind the bottom sheet */}
          <div className="sm:hidden fixed inset-0 z-40 bg-stone-950/30" onClick={() => setOpen(false)} />
          <div
            ref={panelRef}
            role="dialog"
            aria-label="Activity"
            className="fixed inset-x-0 bottom-0 z-50 sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-12 sm:w-[380px] motion-safe:animate-in motion-safe:slide-in-from-bottom-4 sm:motion-safe:slide-in-from-top-2 motion-safe:fade-in duration-200"
          >
            <div className="bg-[#fdfcf8] dark:bg-stone-900 text-stone-800 dark:text-stone-100 rounded-t-2xl sm:rounded-lg border border-stone-200 dark:border-stone-800 shadow-[0_24px_48px_-16px_rgba(28,25,23,0.4)] overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-4 pb-3">
                <div>
                  <p className="font-display text-2xl leading-none">Activity</p>
                  <p className="font-mono text-[11px] text-stone-400 mt-1 uppercase tracking-wider">
                    {new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                    {unread > 0 && ` · ${unread} unread`}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {unread > 0 && (
                    <button onClick={markAll} className="text-xs px-2.5 py-1.5 rounded-md text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800">
                      Mark all read
                    </button>
                  )}
                  <button onClick={() => setOpen(false)} aria-label="Close" className="p-1.5 rounded-md text-stone-400 hover:text-stone-800 hover:bg-stone-100 dark:hover:text-stone-100 dark:hover:bg-stone-800">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-[60dvh] sm:max-h-[420px] overflow-y-auto overscroll-contain pb-2">
                {groups.length === 0 ? (
                  <div className="px-5 py-10 text-center">
                    <p className="font-mono text-xs uppercase tracking-wider text-stone-400">Nothing printed yet</p>
                    <p className="text-sm text-stone-500 mt-2 max-w-[240px] mx-auto">
                      Saved receipts and budget alerts show up here.
                    </p>
                  </div>
                ) : (
                  groups.map(([day, list]) => (
                    <section key={day}>
                      <p className="px-5 pt-3 pb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-stone-400">{day}</p>
                      <ul>
                        {list.map((n) => {
                          const stamp = STAMPS[n.type] || STAMPS.info;
                          return (
                            <li key={n._id} className="border-t border-dashed border-stone-200 dark:border-stone-800 first:border-t-0">
                              <button
                                onClick={() => !n.isRead && markRead(n._id)}
                                className={`w-full text-left grid grid-cols-[44px_1fr] gap-3 px-5 py-3 transition-colors hover:bg-stone-100/70 dark:hover:bg-stone-800/50 ${n.isRead ? "opacity-60" : ""}`}
                              >
                                <span className="font-mono text-[11px] text-stone-400 pt-0.5 tabular-nums">
                                  {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}
                                </span>
                                <span className="min-w-0">
                                  <span className="flex items-start justify-between gap-3">
                                    <span className="text-sm font-medium leading-snug">{n.title || "Update"}</span>
                                    <span className={`shrink-0 -rotate-3 border rounded-[3px] px-1.5 py-px font-mono text-[9px] font-semibold uppercase tracking-wider ${stamp.cls}`}>
                                      {stamp.label}
                                    </span>
                                  </span>
                                  {n.message && <span className="block text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">{n.message}</span>}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  ))
                )}
              </div>

              {/* Torn paper edge */}
              <div
                aria-hidden="true"
                className="h-2 bg-stone-200/70 dark:bg-stone-800 [mask-image:linear-gradient(135deg,transparent_50%,black_50%),linear-gradient(225deg,transparent_50%,black_50%)] [mask-size:10px_10px] [mask-repeat:repeat-x] [mask-position:bottom]"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
