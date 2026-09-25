import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Camera, Download, ArrowRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/Toaster.jsx";
import { exportWithFeedback } from "@/lib/saveFile";
import { CURRENCIES } from "@/lib/money";
import { isDarkTheme, setTheme } from "@/lib/theme";
import { BASE_API_URL } from "@/api/getKeys";

const post = (path, body) =>
  fetch(BASE_API_URL + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r;
  });

export const Section = ({ title, description, children }) => (
  <section className="rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
    <header className="px-5 pt-5 pb-3">
      <h2 className="text-base font-medium text-stone-900 dark:text-stone-50">{title}</h2>
      {description && <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">{description}</p>}
    </header>
    <div className="divide-y divide-stone-100 dark:divide-stone-800">{children}</div>
  </section>
);

export const Row = ({ label, hint, children, htmlFor }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4">
    <div className="min-w-0">
      <label htmlFor={htmlFor} className="text-sm font-medium text-stone-800 dark:text-stone-200">{label}</label>
      {hint && <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{hint}</p>}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

const inputCls =
  "w-full h-10 px-3 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-[15px] focus:outline-none focus:ring-2 focus:ring-emerald-700/30";

// CSV: one row per item, so it opens cleanly in a spreadsheet.
function toCsv(receipts, money) {
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const showConverted = money.code !== "PHP";
  const head = ["Date", "Store", "Type", "Category", "Item", "Quantity", "Unit price (PHP)", "Line total (PHP)", "Receipt total (PHP)"];
  if (showConverted) head.push(`Receipt total (${money.code})`);
  head.push("Payment", "Notes");

  const lines = [head.join(",")];
  for (const r of receipts) {
    const total = parseFloat(String(r.total ?? r.subtotal ?? 0).replace(/[^0-9.-]+/g, "")) || 0;
    const items = r.items?.length ? r.items : [{}];
    for (const it of items) {
      const qty = Number(it.quantity) || 1;
      const price = Number(it.price) || 0;
      const row = [
        r.metadata?.datetime ? new Date(r.metadata.datetime).toISOString().slice(0, 10) : "",
        r.store, r.metadata?.type, it.category, it.description, it.description ? qty : "",
        it.description ? price.toFixed(2) : "", it.description ? (price * qty).toFixed(2) : "", total.toFixed(2),
      ];
      if (showConverted) row.push(money.convert(total).toFixed(2));
      row.push(r.payment_method, r.metadata?.notes);
      lines.push(row.map(esc).join(","));
    }
  }
  return "﻿" + lines.join("\n"); // BOM so Excel reads the ₱ sign
}


function Avatar() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const input = useRef(null);
  const [busy, setBusy] = useState(false);

  const change = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const form = new FormData();
      form.append("image", file);
      if (user?.image_public_url) form.append("public_url", user.image_public_url);
      const up = await fetch(BASE_API_URL + "/image", { method: "POST", body: form });
      if (!up.ok) throw new Error();
      const { imageUrl, publicId } = await up.json();
      await post("/user/image_profile", { userId: user._id, image_source: imageUrl, image_public_url: publicId || "" });
      updateUser({ image_profile: imageUrl, image_public_url: publicId });
      toast.success("Photo updated");
    } catch {
      toast.error("Couldn't update your photo", "Try a smaller JPG or PNG.");
    } finally {
      setBusy(false);
    }
  };

  const initial = (user?.nickname || user?.fullname || "?").charAt(0).toUpperCase();
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <button onClick={() => input.current?.click()} disabled={busy} className="relative w-16 h-16 rounded-xl overflow-hidden bg-emerald-800 text-white grid place-items-center font-display text-3xl shrink-0 group" aria-label="Change photo">
        {user?.image_profile ? <img src={user.image_profile} alt="" className="w-full h-full object-cover" /> : initial}
        <span className="absolute inset-0 grid place-items-center bg-stone-950/45 opacity-0 group-hover:opacity-100 transition-opacity">
          {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
        </span>
      </button>
      <div className="min-w-0">
        <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">{user?.fullname}</p>
        <p className="text-xs text-stone-500 truncate">{user?.email}</p>
        <button onClick={() => input.current?.click()} disabled={busy} className="mt-1 text-xs text-emerald-800 hover:text-emerald-950 dark:text-emerald-400">
          {busy ? "Uploading…" : "Change photo"}
        </button>
      </div>
      <input ref={input} type="file" accept="image/*" className="hidden" onChange={change} />
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateUser, money, userReceipts } = useAuth();
  const toast = useToast();
  const [fullname, setFullname] = useState("");
  const [nickname, setNickname] = useState("");
  const [savingNames, setSavingNames] = useState(false);
  const [dark, setDark] = useState(isDarkTheme());

  useEffect(() => {
    setFullname(user?.fullname || "");
    setNickname(user?.nickname || "");
  }, [user?.fullname, user?.nickname]);

  if (!user) return null;

  const currency = (user.currency || "PHP").toUpperCase();
  const namesChanged = fullname.trim() !== (user.fullname || "") || nickname.trim() !== (user.nickname || "");

  const saveNames = async (e) => {
    e.preventDefault();
    if (!fullname.trim() || !nickname.trim()) return toast.error("Names can't be empty");
    setSavingNames(true);
    try {
      await Promise.all([
        post("/user/fullname", { fullname: fullname.trim(), userId: user._id }),
        post("/user/nickname", { nickname: nickname.trim(), userId: user._id }),
      ]);
      updateUser({ fullname: fullname.trim(), nickname: nickname.trim() });
      toast.success("Profile saved");
    } catch {
      toast.error("Couldn't save your profile", "Please try again.");
    } finally {
      setSavingNames(false);
    }
  };

  // Optimistic: update everywhere at once, roll back if the server says no.
  const savePref = async (path, field, value, body) => {
    const before = user[field];
    updateUser({ [field]: value });
    try {
      await post(path, { userId: user._id, ...body });
    } catch {
      updateUser({ [field]: before });
      toast.error("Couldn't save that setting", "Please try again.");
    }
  };

  const changeTheme = (isDark) => {
    setDark(isDark);
    setTheme(isDark);
    savePref("/user/theme", "theme", isDark ? "dark" : "light", { preferences: isDark ? "dark" : "light" });
  };

  const receipts = (Array.isArray(userReceipts) ? userReceipts : []).filter((r) => r && !Array.isArray(r));
  const stamp = new Date().toISOString().slice(0, 10);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div>
        <h1 className="font-display text-4xl sm:text-5xl leading-none text-stone-900 dark:text-stone-50">Settings</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">Your profile, how money is shown, and alerts.</p>
      </div>

      <Section title="Profile">
        <Avatar />
        <form onSubmit={saveNames} className="px-5 py-4 grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullname" className="text-xs text-stone-500">Full name</label>
            <input id="fullname" className={inputCls + " mt-1"} value={fullname} onChange={(e) => setFullname(e.target.value)} autoComplete="name" />
          </div>
          <div>
            <label htmlFor="nickname" className="text-xs text-stone-500">What should we call you?</label>
            <input id="nickname" className={inputCls + " mt-1"} value={nickname} onChange={(e) => setNickname(e.target.value)} autoComplete="nickname" />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button type="submit" disabled={!namesChanged || savingNames} className="h-10 px-5 rounded-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 disabled:hover:bg-emerald-800 text-white text-sm font-medium inline-flex items-center gap-2">
              {savingNames && <Loader2 className="w-4 h-4 animate-spin" />} Save profile
            </button>
          </div>
        </form>
      </Section>

      <Section title="Display" description="Amounts are stored in pesos and converted when shown.">
        <Row
          label="Currency"
          htmlFor="currency"
          hint={currency === "PHP" ? "Showing pesos as recorded." : `1 PHP ≈ ${money.rate.toFixed(currency === "JPY" || currency === "KRW" ? 2 : 4)} ${currency}${money.live ? ", updated daily" : ", approximate rate"}`}
        >
          <select
            id="currency"
            value={currency}
            onChange={(e) => savePref("/user/currency", "currency", e.target.value, { currency: e.target.value })}
            className="h-10 pl-3 pr-8 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
          >
            {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} · {c.label}</option>)}
          </select>
        </Row>
        <Row label="Theme" hint="Also on the button in the top bar.">
          <div role="radiogroup" aria-label="Theme" className="inline-flex p-1 rounded-lg bg-stone-100 dark:bg-stone-950">
            {[{ v: false, l: "Light" }, { v: true, l: "Dark" }].map((o) => (
              <button key={o.l} role="radio" aria-checked={dark === o.v} onClick={() => changeTheme(o.v)} className={`h-8 px-4 rounded-md text-sm ${dark === o.v ? "bg-white dark:bg-stone-800 shadow-sm text-stone-900 dark:text-stone-50" : "text-stone-500"}`}>
                {o.l}
              </button>
            ))}
          </div>
        </Row>
      </Section>

      <Section title="Budget alerts" description="Shown in Activity and as a pop-up when it happens. One of each per budget per month.">
        <Row label="Close to the limit" hint="When a budget reaches 85%.">
          <Switch checked={user.nearLimit !== false} onCheckedChange={(v) => savePref("/user/nearLimit", "nearLimit", v, { nearLimit: v })} className="data-[state=checked]:bg-emerald-700" />
        </Row>
        <Row label="Over budget" hint="When spending goes past the limit.">
          <Switch checked={user.overSpending !== false} onCheckedChange={(v) => savePref("/user/overSpending", "overSpending", v, { overSpending: v })} className="data-[state=checked]:bg-emerald-700" />
        </Row>
      </Section>

      <Section title="Export" description={`${receipts.length} ${receipts.length === 1 ? "entry" : "entries"} in your ledger.`}>
        <Row label="Spreadsheet (CSV)" hint="One row per item. Opens in Excel, Numbers or Google Sheets.">
          <button disabled={!receipts.length} onClick={() => exportWithFeedback(toast, toCsv(receipts, money), `recepta-${stamp}.csv`, "text/csv;charset=utf-8")} className="h-9 px-4 rounded-full border border-stone-300 dark:border-stone-700 text-sm inline-flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-40">
            <Download className="w-4 h-4" /> Download CSV
          </button>
        </Row>
        <Row label="Full backup (JSON)" hint="Every field of every entry, for moving your data elsewhere.">
          <button disabled={!receipts.length} onClick={() => exportWithFeedback(toast, JSON.stringify(receipts, null, 2), `recepta-${stamp}.json`, "application/json")} className="h-9 px-4 rounded-full border border-stone-300 dark:border-stone-700 text-sm inline-flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-40">
            <Download className="w-4 h-4" /> Download JSON
          </button>
        </Row>
      </Section>

      <Link to="/user/privacy" className="flex items-center justify-between rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-5 py-4 hover:bg-stone-50 dark:hover:bg-stone-800/60">
        <span>
          <span className="block text-sm font-medium text-stone-900 dark:text-stone-100">Privacy & security</span>
          <span className="block text-xs text-stone-500">Password, two-step sign-in, receipt photos, devices, deleting your account.</span>
        </span>
        <ArrowRight className="w-4 h-4 text-stone-400" />
      </Link>
    </div>
  );
}
