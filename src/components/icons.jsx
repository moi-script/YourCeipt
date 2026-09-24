// Recepta's own icon set: plain 24px strokes drawn around the receipt idea,
// so the product doesn't look like every other Lucide dashboard. All icons
// take the usual className and inherit currentColor.

const Svg = ({ className = "w-5 h-5", strokeWidth = 1.6, children, ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...rest}
  >
    {children}
  </svg>
);

// Uneven blocks: the dashboard overview.
export const IconOverview = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="9" height="7" rx="1.5" />
    <rect x="15" y="3.5" width="5.5" height="11" rx="1.5" />
    <rect x="3.5" y="13" width="9" height="7.5" rx="1.5" />
    <rect x="15" y="17" width="5.5" height="3.5" rx="1.2" />
  </Svg>
);

// A receipt with a torn bottom edge.
export const IconLedger = (p) => (
  <Svg {...p}>
    <path d="M6 3.5h12v17l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3z" />
    <path d="M9 8h6M9 11.5h6M9 15h3.5" />
  </Svg>
);

// Half dial with a needle: budgets.
export const IconBudget = (p) => (
  <Svg {...p}>
    <path d="M3.5 16a8.5 8.5 0 0 1 17 0" />
    <path d="M12 16l4-5" />
    <circle cx="12" cy="16" r="1.4" />
    <path d="M3.5 19.5h17" />
  </Svg>
);

// Scan brackets around text lines: the AI that reads receipts.
export const IconReader = (p) => (
  <Svg {...p}>
    <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" />
    <path d="M8 9.5h8M8 12h5.5M8 14.5h7" />
  </Svg>
);

// Stepped line over a baseline: trends.
export const IconTrends = (p) => (
  <Svg {...p}>
    <path d="M3.5 20.5h17" />
    <path d="M4 16l4.5-4 3.5 2.5L19.5 7" />
    <path d="M15.5 7h4v4" />
  </Svg>
);

// A slip sliding out of a tray: notifications.
export const IconInbox = (p) => (
  <Svg {...p}>
    <path d="M7.5 11V4.5h9V11" />
    <path d="M10 7.5h4" />
    <path d="M3.5 13.5l2-2.5h13l2 2.5v5a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5z" />
    <path d="M3.5 13.5h5l1 2h5l1-2h5" />
  </Svg>
);

// A rubber stamp: marks AI-read entries and quick parsing.
export const IconStamp = (p) => (
  <Svg {...p}>
    <path d="M9.5 10.5V8a2.5 2.5 0 1 1 5 0v2.5" />
    <path d="M5 14a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2H5z" />
    <path d="M6 19.5h12" />
  </Svg>
);

// A pen nib: manual entry.
export const IconNib = (p) => (
  <Svg {...p}>
    <path d="M12 3.5l5 6-5 11-5-11z" />
    <path d="M12 12.5v3" />
    <circle cx="12" cy="10.5" r="1" />
  </Svg>
);

// Two half-moons: theme toggle (one icon for both states, rotates).
export const IconTheme = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 4a8 8 0 0 0 0 16z" fill="currentColor" stroke="none" />
  </Svg>
);

// Menu: three lines of different length, like receipt rows.
export const IconMenu = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h11M4 17h14" />
  </Svg>
);

// The brand mark used in the app shell and on the landing page.
export const LogoMark = ({ className = "w-7 h-7" }) => (
  <span className={`grid place-items-center rounded-md bg-emerald-800 text-[#f7f6f2] font-display leading-none ${className}`}>
    <span className="text-[1.1em] translate-y-[1px]">R</span>
  </span>
);
