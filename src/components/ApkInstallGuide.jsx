import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { APK_URL } from "@/lib/appRelease";

// Chrome holds every APK from a website at 100% until the user taps
// "Download anyway", and discards it if Chrome is closed first. People read
// that as a stuck download, so we show the steps while the file downloads.
const STEPS = [
  {
    title: "Tap “Download anyway”",
    body: "When the download reaches 100%, Chrome asks if you want to keep recepta.apk. It asks this for every app that isn't from the Play Store. If you don't see the prompt, open Chrome's ⋮ menu → Downloads.",
  },
  {
    title: "Open recepta.apk",
    body: "Tap Open in the prompt, or tap the finished download in your notifications.",
  },
  {
    title: "Allow the install",
    body: "If Android says Chrome can't install apps, tap Settings, turn on “Allow from this source”, then go back and tap Install.",
  },
];

export default function ApkInstallGuide({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#f7f6f2] dark:bg-stone-950 border-stone-200 dark:border-stone-800">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-normal text-stone-900 dark:text-stone-50">Your download has started</DialogTitle>
          <DialogDescription className="text-stone-600 dark:text-stone-400">
            Keep Chrome open until it finishes. Then:
          </DialogDescription>
        </DialogHeader>
        <ol className="space-y-4 mt-1">
          {STEPS.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[2rem_1fr] gap-2">
              <span className="font-display text-xl text-emerald-800 dark:text-emerald-400 tabular-nums">{i + 1}</span>
              <div>
                <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{s.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-stone-600 dark:text-stone-400">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-xs text-stone-500 border-t border-stone-200 dark:border-stone-800 pt-3">
          Nothing happened?{" "}
          <a href={APK_URL} className="underline underline-offset-4 text-stone-700 dark:text-stone-300">Start the download again</a>
        </p>
      </DialogContent>
    </Dialog>
  );
}
