/** Gradient mark: a point descending a loss curve. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="logoStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.72 0.17 35)" />
          <stop offset="100%" stopColor="oklch(0.64 0.19 288)" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="oklch(0.21 0.014 60)" />
      <rect width="32" height="32" rx="9" stroke="oklch(0.32 0.014 60)" />
      {/* loss curve */}
      <path
        d="M6 9 C 10 9, 11 22, 16 22 C 21 22, 22 12, 26 12"
        stroke="url(#logoStroke)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* descending point at the minimum */}
      <circle cx="16" cy="22" r="3" fill="oklch(0.72 0.17 35)" />
    </svg>
  );
}
