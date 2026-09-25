import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Download, MonitorSmartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/Toaster.jsx";
import { Section, Row } from "./Profile";
import { exportWithFeedback } from "@/lib/saveFile";
import { BASE_API_URL } from "@/api/getKeys";

// These endpoints authenticate with the session cookie.
const api = async (path, { method = "GET", body } = {}) => {
  const res = await fetch(BASE_API_URL + path, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong. Please try again.");
  return data;
};

const inputCls =
  "w-full h-10 px-3 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-[15px] focus:outline-none focus:ring-2 focus:ring-emerald-700/30";

function PasswordField({ id, label, value, onChange, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="text-xs text-stone-500">{label}</label>
      <div className="relative mt-1">
        <input id={id} type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} className={inputCls + " pr-10"} />
        <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function ChangePassword() {
  const toast = useToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (next.length < 8) return setError("Use at least 8 characters for the new password.");
    if (next !== confirm) return setError("The new passwords don't match.");
    setBusy(true);
    try {
      const { message } = await api("/user/change-password", { method: "POST", body: { currentPassword: current, newPassword: next } });
      toast.success("Password changed", message);
      setCurrent(""); setNext(""); setConfirm("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="px-5 py-4 space-y-3">
      <PasswordField id="pw-current" label="Current password" value={current} onChange={setCurrent} autoComplete="current-password" />
      <div className="grid sm:grid-cols-2 gap-3">
        <PasswordField id="pw-new" label="New password" value={next} onChange={setNext} autoComplete="new-password" />
        <PasswordField id="pw-confirm" label="Repeat new password" value={confirm} onChange={setConfirm} autoComplete="new-password" />
      </div>
      {error && <p role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p>}
      <div className="flex items-center justify-between gap-3 pt-1">
        <p className="text-xs text-stone-500">Other devices are signed out when you change it.</p>
        <button type="submit" disabled={busy || !current || !next} className="h-10 px-5 rounded-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white text-sm font-medium inline-flex items-center gap-2 shrink-0">
          {busy && <Loader2 className="w-4 h-4 animate-spin" />} Change password
        </button>
      </div>
    </form>
  );
}

function DeleteAccount({ onDeleted }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/user/delete-account", { method: "DELETE", body: { password } });
      onDeleted();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <Row label="Delete account" hint="Removes your profile, every entry, budgets, alerts and stored photos.">
        <button onClick={() => setOpen(true)} className="h-9 px-4 rounded-full border border-red-300 dark:border-red-900 text-red-700 dark:text-red-400 text-sm hover:bg-red-50 dark:hover:bg-red-950/40">
          Delete account…
        </button>
      </Row>
    );
  }

  return (
    <form onSubmit={submit} className="px-5 py-4 space-y-3 bg-red-50/60 dark:bg-red-950/20">
      <p className="text-sm text-red-900 dark:text-red-200">
        This can't be undone. Download your data first if you want a copy.
      </p>
      <PasswordField id="del-pw" label="Your password" value={password} onChange={setPassword} autoComplete="current-password" />
      <div>
        <label htmlFor="del-confirm" className="text-xs text-stone-500">Type DELETE to confirm</label>
        <input id="del-confirm" value={typed} onChange={(e) => setTyped(e.target.value)} className={inputCls + " mt-1"} autoComplete="off" />
      </div>
      {error && <p role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => { setOpen(false); setPassword(""); setTyped(""); setError(""); }} className="h-10 px-4 rounded-full text-sm hover:bg-stone-200/70 dark:hover:bg-stone-800">Cancel</button>
        <button type="submit" disabled={busy || !password || typed !== "DELETE"} className="h-10 px-5 rounded-full bg-red-700 hover:bg-red-800 disabled:opacity-40 text-white text-sm font-medium inline-flex items-center gap-2">
          {busy && <Loader2 className="w-4 h-4 animate-spin" />} Delete everything
        </button>
      </div>
    </form>
  );
}

export default function PrivacySecurity() {
  const { user, updateUser, setUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [security, setSecurity] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [busy, setBusy] = useState("");

  useEffect(() => {
    api("/user/security").then(setSecurity).catch((err) => setLoadError(err.message));
  }, []);

  const signedOut = (message) => {
    try { localStorage.setItem("user", false); } catch { /* ignore */ }
    setUser(null);
    navigate("/", { replace: true });
    if (message) toast.info(message);
  };

  const toggle = async (field, value) => {
    const before = security[field];
    setSecurity((s) => ({ ...s, [field]: value }));
    updateUser({ [field]: value });
    try {
      await api("/user/security", { method: "POST", body: { [field]: value } });
      if (field === "twoFactor") {
        toast.success(value ? "Two-step sign-in is on" : "Two-step sign-in is off", value ? `We'll email a code to ${user?.email} each time you sign in.` : undefined);
      }
    } catch (err) {
      setSecurity((s) => ({ ...s, [field]: before }));
      updateUser({ [field]: before });
      toast.error("Couldn't save that setting", err.message);
    }
  };

  const signOutAll = async () => {
    setBusy("signout");
    try {
      await api("/user/signout-all", { method: "POST" });
      signedOut("Signed out on every device.");
    } catch (err) {
      toast.error("Couldn't sign out everywhere", err.message);
      setBusy("");
    }
  };

  const exportAll = async () => {
    setBusy("export");
    try {
      const data = await api("/user/export");
      await exportWithFeedback(toast, JSON.stringify(data, null, 2), `recepta-account-${new Date().toISOString().slice(0, 10)}.json`, "application/json");
    } catch (err) {
      toast.error("Couldn't prepare your data", err.message);
    } finally {
      setBusy("");
    }
  };

  const when = security?.lastLoginAt ? new Date(security.lastLoginAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div>
        <h1 className="font-display text-4xl sm:text-5xl leading-none text-stone-900 dark:text-stone-50">Privacy & security</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">Who can get into your account, and what Recepta keeps.</p>
      </div>

      {loadError && (
        <p className="rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-sm px-4 py-3">
          {loadError === "Session was signed out" ? "Your session ended. Sign in again to change these settings." : `Couldn't load your settings: ${loadError}`}
        </p>
      )}

      <Section title="Password">
        <ChangePassword />
      </Section>

      <Section title="Sign-in">
        <Row label="Two-step sign-in" hint={`After your password, enter a 6-digit code we email to ${user?.email || "you"}.`}>
          <Switch disabled={!security} checked={Boolean(security?.twoFactor)} onCheckedChange={(v) => toggle("twoFactor", v)} className="data-[state=checked]:bg-emerald-700" />
        </Row>
        <div className="px-5 py-4 flex items-start gap-3">
          <MonitorSmartphone className="w-5 h-5 text-stone-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0 text-sm">
            <p className="text-stone-800 dark:text-stone-200">This device: {security?.currentDevice || "…"}</p>
            <p className="text-xs text-stone-500 mt-0.5">
              {when ? `Last sign-in ${when}${security.lastLoginDevice ? ` on ${security.lastLoginDevice}` : ""}.` : "Sign-in history starts from your next sign-in."}
            </p>
          </div>
        </div>
        <Row label="Sign out everywhere" hint="Ends every session, including this one. Use it if you signed in on a device you don't own.">
          <button onClick={signOutAll} disabled={busy === "signout"} className="h-9 px-4 rounded-full border border-stone-300 dark:border-stone-700 text-sm hover:bg-stone-50 dark:hover:bg-stone-800 inline-flex items-center gap-2 disabled:opacity-50">
            {busy === "signout" && <Loader2 className="w-4 h-4 animate-spin" />} Sign out everywhere
          </button>
        </Row>
      </Section>

      <Section title="What Recepta keeps" description="Receipt photos go to Microsoft Azure to read the text and Google Gemini (or the model you chose) to sort it into items. Neither is used for advertising.">
        <Row label="Keep receipt photos" hint="Store the original photo with each entry so you can look at it later. Turning this off only affects new receipts.">
          <Switch disabled={!security} checked={security ? security.keepReceiptImages : true} onCheckedChange={(v) => toggle("keepReceiptImages", v)} className="data-[state=checked]:bg-emerald-700" />
        </Row>
        <Row label="Download my data" hint="Profile, every entry, budgets and alerts, as one JSON file.">
          <button onClick={exportAll} disabled={busy === "export"} className="h-9 px-4 rounded-full border border-stone-300 dark:border-stone-700 text-sm hover:bg-stone-50 dark:hover:bg-stone-800 inline-flex items-center gap-2 disabled:opacity-50">
            {busy === "export" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Download
          </button>
        </Row>
      </Section>

      <Section title="Danger zone">
        <DeleteAccount onDeleted={() => signedOut("Your account and all of its data were deleted.")} />
      </Section>
    </div>
  );
}
