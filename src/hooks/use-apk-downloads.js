import { useEffect, useState } from "react";

// GitHub counts every download of a release asset. Summing across releases
// gives the all-time total, not just the current version's.
const RELEASES_API = "https://api.github.com/repos/moi-script/YourCeipt/releases?per_page=100";
const CACHE_KEY = "recepta.apkDownloads";
// The unauthenticated API allows 60 requests an hour per visitor IP.
const CACHE_MS = 10 * 60 * 1000;

export function useApkDownloads(enabled = true) {
  const [count, setCount] = useState(() => {
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY));
      return cached && Date.now() - cached.at < CACHE_MS ? cached.count : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!enabled || count !== null) return;
    let cancelled = false;
    fetch(RELEASES_API, { headers: { Accept: "application/vnd.github+json" } })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((releases) => {
        const total = releases
          .flatMap((r) => r.assets)
          .filter((a) => a.name.endsWith(".apk"))
          .reduce((sum, a) => sum + a.download_count, 0);
        if (cancelled) return;
        setCount(total);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ count: total, at: Date.now() }));
        } catch {
          /* storage blocked: we'll just fetch again next visit */
        }
      })
      .catch(() => {
        /* rate-limited or offline: the label simply stays hidden */
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, count]);

  return count;
}
