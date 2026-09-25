import { useEffect, useState } from "react";

// Downloads now come from this site and are counted by our backend. The
// GitHub release count covers the downloads made there before the switch
// (and anyone who still grabs it from GitHub), so the total is both.
const RELEASES_API = "https://api.github.com/repos/moi-script/YourCeipt/releases?per_page=100";
const COUNTER_API = `${import.meta.env.VITE_URL_BACKEND}/app/downloads`;
const CACHE_KEY = "recepta.apkDownloads";
// The unauthenticated GitHub API allows 60 requests an hour per visitor IP.
const CACHE_MS = 10 * 60 * 1000;

const readCache = () => {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY));
    return cached && Date.now() - cached.at < CACHE_MS ? cached : null;
  } catch {
    return null;
  }
};

const writeCache = (value) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ...value, at: Date.now() }));
  } catch {
    /* storage blocked: we'll just fetch again next visit */
  }
};

const fetchGithubCount = () =>
  fetch(RELEASES_API, { headers: { Accept: "application/vnd.github+json" } })
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((releases) =>
      releases
        .flatMap((r) => r.assets)
        .filter((a) => a.name.endsWith(".apk"))
        .reduce((sum, a) => sum + a.download_count, 0)
    );

const fetchSiteCount = () =>
  fetch(COUNTER_API)
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((data) => data.count);

export function useApkDownloads(enabled = true) {
  const [counts, setCounts] = useState(readCache);

  useEffect(() => {
    if (!enabled || readCache()) return;
    let cancelled = false;
    // Render's free tier can take ~50s to wake, so each source fills in
    // independently instead of waiting on the slower one.
    const merge = (key) => (value) => {
      if (cancelled) return;
      setCounts((prev) => {
        const next = { github: 0, site: 0, ...prev, [key]: value };
        writeCache(next);
        return next;
      });
    };
    fetchGithubCount().then(merge("github")).catch(() => {});
    fetchSiteCount().then(merge("site")).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const total = counts ? counts.github + counts.site : 0;

  // Count the tap right away so the visitor sees their own download land.
  const recordDownload = () => {
    fetch(COUNTER_API, { method: "POST", keepalive: true }).catch(() => {});
    setCounts((prev) => {
      const next = { github: 0, site: 0, ...prev };
      next.site += 1;
      writeCache(next);
      return next;
    });
  };

  return { count: total || null, recordDownload };
}
