import { useEffect, useRef, useState } from "react";
import { Capacitor, registerPlugin } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { ArrowRight, Download, Loader2, RotateCw, Settings2, X } from "lucide-react";
import { GITHUB_APK_URL, VERSION_MANIFEST, isNativeApp } from "@/lib/appRelease";

// Native side lives in android/.../ApkUpdaterPlugin.java (added in 1.3.0).
// Older installs don't have it and fall back to opening the link in the
// phone's browser.
const ApkUpdater = registerPlugin("ApkUpdater");
const canInstallInApp = () => Capacitor.isPluginAvailable("ApkUpdater");

// Web changes reach the Android app on their own, because the app loads the
// live site. Only a new APK (native changes) needs the user to act, so this
// checks the published manifest on launch and whenever the app is resumed.
export default function AppUpdatePrompt() {
  const [update, setUpdate] = useState(null);
  // idle | downloading | installing | needs-permission | permission-denied | failed | browser
  const [phase, setPhase] = useState({ state: "idle", percent: 0 });
  const dismissed = useRef(null);

  useEffect(() => {
    if (!isNativeApp()) return;
    let cancelled = false;

    const check = async () => {
      try {
        const [info, res] = await Promise.all([
          CapApp.getInfo(),
          fetch(`${VERSION_MANIFEST}?t=${Date.now()}`, { cache: "no-store" }),
        ]);
        if (!res.ok) return;
        const latest = await res.json();
        const installed = Number(info.build);
        if (!cancelled && Number(latest.versionCode) > installed && dismissed.current !== latest.versionCode) {
          setUpdate({ ...latest, installedName: info.version });
        }
      } catch {
        /* offline or manifest missing: try again on next resume */
      }
    };

    check();
    const sub = CapApp.addListener("resume", check);
    return () => {
      cancelled = true;
      sub.then((s) => s.remove());
    };
  }, []);

  useEffect(() => {
    if (!update || !canInstallInApp()) return;
    const sub = ApkUpdater.addListener("progress", (p) => setPhase(p));
    return () => {
      sub.then((s) => s.remove());
    };
  }, [update]);

  if (!update) return null;

  const url = update.apkUrl || GITHUB_APK_URL;
  const busy = phase.state === "downloading" || phase.state === "downloaded" || phase.state === "installing";

  const start = async () => {
    if (!canInstallInApp()) {
      setPhase({ state: "browser", percent: 0 });
      // Same as tapping a link: Capacitor hands off-site URLs to the browser.
      window.location.href = url;
      return;
    }
    setPhase({ state: "downloading", percent: 0 });
    try {
      await ApkUpdater.downloadAndInstall({ url, version: update.versionName });
    } catch (e) {
      setPhase({ state: "failed", percent: 0, message: e?.message });
    }
  };

  const close = () => {
    dismissed.current = update.versionCode;
    setUpdate(null);
    setPhase({ state: "idle", percent: 0 });
  };

  const status = {
    downloading: `Downloading… ${phase.percent}%`,
    downloaded: "Download complete",
    installing: "Opening the installer. Tap Update to finish.",
    "needs-permission": "Turn on “Allow from this source”, then come back to Recepta.",
    "permission-denied": "Recepta needs permission to install the update.",
    failed: phase.message || "The download didn't finish.",
    browser: "Your browser is downloading it. When it's done, tap the file in your notifications to install. You can close the browser after.",
  }[phase.state];

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div
        role="status"
        className="relative mx-auto max-w-md overflow-hidden rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-[#fdfcfa] dark:bg-stone-900 shadow-[0_20px_48px_-20px_rgba(28,25,23,0.45)]"
      >
        {/* Soft green wash behind the header so it reads as a notice, not a toast. */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-emerald-50 to-transparent dark:from-emerald-950/40" />

        <div className="relative p-4">
          <div className="flex items-start gap-3">
            <span className="grid place-items-center w-11 h-11 shrink-0 rounded-xl bg-emerald-800 text-[#f7f6f2] font-display text-2xl leading-none shadow-sm dark:bg-emerald-700">
              R
            </span>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-[11px] font-medium uppercase tracking-wider text-emerald-800 dark:text-emerald-400">Update available</p>
              <p className="mt-0.5 text-[15px] font-semibold text-stone-900 dark:text-stone-50">Recepta {update.versionName}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 tabular-nums">
                <span className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800">{update.installedName}</span>
                <ArrowRight className="w-3 h-3" />
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-200">{update.versionName}</span>
              </p>
            </div>
            {!busy && (
              <button onClick={close} aria-label="Not now" className="-mr-1 -mt-1 p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:text-stone-200 dark:hover:bg-stone-800">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {update.notes && phase.state === "idle" && (
            <p className="mt-3 text-[13px] leading-relaxed text-stone-600 dark:text-stone-300 line-clamp-3">{update.notes}</p>
          )}

          {phase.state === "downloading" && (
            <div className="mt-4 h-1.5 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-700 dark:bg-emerald-500 transition-[width] duration-300" style={{ width: `${Math.max(phase.percent, 3)}%` }} />
            </div>
          )}

          {status && (
            <p className={`mt-3 text-[13px] leading-relaxed ${phase.state === "failed" || phase.state === "permission-denied" ? "text-rose-700 dark:text-rose-400" : "text-stone-600 dark:text-stone-300"}`}>
              {status}
            </p>
          )}

          <div className="mt-4 flex items-center gap-2">
            {phase.state === "idle" && (
              <>
                <button onClick={start} className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-emerald-800 text-white text-sm font-medium hover:bg-emerald-900 active:translate-y-px dark:bg-emerald-600 dark:hover:bg-emerald-500">
                  <Download className="w-4 h-4" /> Update now
                </button>
                <button onClick={close} className="h-10 px-4 rounded-xl text-sm text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800">
                  Later
                </button>
              </>
            )}
            {busy && (
              <span className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-sm text-stone-600 dark:text-stone-300">
                <Loader2 className="w-4 h-4 animate-spin" /> {phase.state === "downloading" ? "Downloading" : "Installing"}
              </span>
            )}
            {(phase.state === "failed" || phase.state === "permission-denied") && (
              <>
                <button onClick={start} className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-emerald-800 text-white text-sm font-medium hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500">
                  {phase.state === "failed" ? <RotateCw className="w-4 h-4" /> : <Settings2 className="w-4 h-4" />} Try again
                </button>
                <a href={url} className="h-10 px-3 inline-flex items-center rounded-xl text-sm text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800">
                  Use browser
                </a>
              </>
            )}
            {(phase.state === "browser" || phase.state === "needs-permission") && (
              <button onClick={close} className="flex-1 h-10 rounded-xl border border-stone-200 dark:border-stone-700 text-sm text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800">
                Got it
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
