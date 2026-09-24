import React from 'react';

// Shown while the session is verified. This used to autoplay a 1 MB looping
// video over two animated blur layers, on every dashboard load.
export default function VideoLoader() {
  return (
    <div className="min-h-screen bg-[#f7f6f2] dark:bg-stone-950 flex items-center justify-center p-4 font-sans">
      <div className="flex flex-col items-center gap-4 text-center" role="status" aria-live="polite">
        <div className="h-9 w-9 rounded-full border-2 border-stone-300 dark:border-stone-700 border-t-emerald-700 dark:border-t-emerald-400 animate-spin" />
        <div>
          <p className="text-sm font-medium text-stone-800 dark:text-stone-100">Loading your ledger</p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Checking your session…</p>
        </div>
      </div>
    </div>
  );
}
