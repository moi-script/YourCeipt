// One way to switch themes everywhere, with a smooth crossfade.
//
// Toggling the `dark` class directly makes every color flip in a single
// frame. The View Transitions API snapshots the page and crossfades the old
// and new themes instead; browsers without it get a short CSS color
// transition. Reduced-motion users get an instant switch.

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const persist = (isDark) => {
  try {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  } catch {
    /* storage blocked */
  }
};

const apply = (isDark) => {
  const root = document.documentElement;
  root.classList.toggle("dark", isDark);
  root.style.colorScheme = isDark ? "dark" : "light";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isDark ? "#0c0a09" : "#f7f6f2");
};

export const isDarkTheme = () =>
  typeof document !== "undefined" && document.documentElement.classList.contains("dark");

export function setTheme(isDark, { animate = true } = {}) {
  persist(isDark);
  if (isDarkTheme() === isDark) return;

  if (!animate || prefersReducedMotion()) return apply(isDark);

  if (document.startViewTransition) {
    document.documentElement.classList.add("theme-switching");
    const t = document.startViewTransition(() => apply(isDark));
    t.finished.finally(() => document.documentElement.classList.remove("theme-switching"));
    return;
  }

  const root = document.documentElement;
  root.classList.add("theme-fade");
  apply(isDark);
  window.setTimeout(() => root.classList.remove("theme-fade"), 350);
}
