import { useEffect, useState } from "react";
import { App as CapApp } from "@capacitor/app";
import { Download, X } from "lucide-react";
import { APK_URL, VERSION_MANIFEST, isNativeApp } from "@/lib/appRelease";

// Web changes reach the Android app on their own, because the app loads the
// live site. Only a new APK (native changes) needs the user to act, so this
// checks the published manifest on launch and whenever the app is resumed.
export default function AppUpdatePrompt() {
  const [update, setUpdate] = useState(null);

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
        if (!cancelled && Number(latest.versionCode) > installed) {
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

  if (!update) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div role="status" className="mx-auto max-w-md rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-[0_12px_32px_-12px_rgba(28,25,23,0.35)] flex overflow-hidden">
        <span className="w-1 shrink-0 bg-emerald-700" />
        <div className="flex-1 min-w-0 px-4 py-3">
          <p className="text-sm font-medium text-stone-900 dark:text-stone-100">Recepta {update.versionName} is available</p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            You have {update.installedName}.{update.notes ? ` ${update.notes}` : ""}
          </p>
          <a
            href={update.apkUrl || APK_URL}
            className="mt-2.5 inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-emerald-800 text-white text-xs font-medium hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            <Download className="w-3.5 h-3.5" /> Download update
          </a>
        </div>
        <button onClick={() => setUpdate(null)} aria-label="Dismiss" className="self-start p-3 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
