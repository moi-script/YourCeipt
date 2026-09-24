// Every amount is stored in pesos (that's what receipts are parsed into).
// The user's display currency converts on the way out, and typed amounts
// convert back to pesos on the way in, so switching currency never changes
// the stored numbers.

export const BASE_CURRENCY = "PHP";

export const CURRENCIES = [
  { code: "PHP", label: "Philippine peso" },
  { code: "USD", label: "US dollar" },
  { code: "EUR", label: "Euro" },
  { code: "GBP", label: "British pound" },
  { code: "JPY", label: "Japanese yen" },
  { code: "SGD", label: "Singapore dollar" },
  { code: "AUD", label: "Australian dollar" },
  { code: "CAD", label: "Canadian dollar" },
  { code: "KRW", label: "South Korean won" },
  { code: "AED", label: "UAE dirham" },
];

const RATES_URL = "https://open.er-api.com/v6/latest/PHP";
const CACHE_KEY = "recepta.fx.v1";
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;

// Used only until live rates load (or if the rates service is down).
const FALLBACK_RATES = {
  PHP: 1, USD: 0.0171, EUR: 0.0158, GBP: 0.0133, JPY: 2.55, SGD: 0.0226,
  AUD: 0.0262, CAD: 0.0237, KRW: 23.9, AED: 0.0628,
};

export function readCachedRates() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (cached?.rates) return cached;
  } catch {
    /* ignore */
  }
  return { rates: FALLBACK_RATES, fetchedAt: 0, live: false };
}

export async function loadRates() {
  const cached = readCachedRates();
  if (cached.live && Date.now() - cached.fetchedAt < CACHE_TTL_MS) return cached;
  try {
    const res = await fetch(RATES_URL);
    const data = await res.json();
    if (data.result !== "success" || !data.rates) throw new Error("bad rates");
    const fresh = { rates: data.rates, fetchedAt: Date.now(), live: true, updated: data.time_last_update_utc };
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(fresh));
    } catch {
      /* ignore */
    }
    return fresh;
  } catch {
    return cached;
  }
}

const toNumber = (v) => {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const n = parseFloat(String(v ?? "").replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(n) ? n : 0;
};

export function makeMoney(code = BASE_CURRENCY, fx = readCachedRates()) {
  const currency = CURRENCIES.some((c) => c.code === code) ? code : BASE_CURRENCY;
  const rate = fx.rates?.[currency] ?? FALLBACK_RATES[currency] ?? 1;
  const decimals = ["JPY", "KRW"].includes(currency) ? 0 : 2;

  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const compactFormatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    notation: "compact",
    maximumFractionDigits: 1,
  });
  const symbol = formatter.formatToParts(0).find((p) => p.type === "currency")?.value || currency;

  const convert = (pesos) => toNumber(pesos) * rate;

  return {
    code: currency,
    symbol,
    rate,
    live: Boolean(fx.live),
    convert,
    // Display-currency amount typed by the user -> pesos for storage.
    toBase: (amount) => toNumber(amount) / rate,
    format: (pesos, { compact = false, sign = false } = {}) => {
      const value = convert(pesos);
      const text = (compact ? compactFormatter : formatter).format(Math.abs(value));
      if (!sign) return value < 0 ? `-${text}` : text;
      return value < 0 ? `−${text}` : `+${text}`;
    },
  };
}
