import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { BASE_API_URL } from "@/api/getKeys";

// Second step of two-step sign-in: the 6-digit code from the email.
export function SignInCode({ email, maskedEmail, onSuccess, onBack, onResend }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);
  const input = useRef(null);

  useEffect(() => input.current?.focus(), []);

  const submit = async (e) => {
    e?.preventDefault();
    if (code.length !== 6) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(BASE_API_URL + "/user/login/verify-code", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "That code didn't work.");
      onSuccess(data);
    } catch (err) {
      setError(err.message);
      setCode("");
      setBusy(false);
    }
  };

  useEffect(() => {
    if (code.length === 6 && !busy) submit();
  }, [code]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <h2 className="font-display text-3xl text-stone-900 dark:text-stone-50">Check your email</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          We sent a 6-digit code to <span className="text-stone-800 dark:text-stone-200">{maskedEmail || email}</span>. It expires in 10 minutes.
        </p>
      </div>
      <label htmlFor="signin-code" className="sr-only">Sign-in code</label>
      <input
        ref={input}
        id="signin-code"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        maxLength={6}
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
        className="w-full h-14 text-center font-mono text-2xl tracking-[0.5em] rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/40"
        placeholder="••••••"
      />
      {error && <p role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p>}
      <button type="submit" disabled={busy || code.length !== 6} className="w-full h-12 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white font-medium inline-flex items-center justify-center gap-2">
        {busy && <Loader2 className="w-4 h-4 animate-spin" />} Sign in
      </button>
      <div className="flex justify-between text-sm">
        <button type="button" onClick={onBack} className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200">Use a different account</button>
        {onResend && (
          <button
            type="button"
            disabled={resent}
            onClick={async () => { setResent(true); await onResend(); setTimeout(() => setResent(false), 30000); }}
            className="text-emerald-800 dark:text-emerald-400 disabled:text-stone-400"
          >
            {resent ? "Code sent" : "Send a new code"}
          </button>
        )}
      </div>
    </form>
  );
}
