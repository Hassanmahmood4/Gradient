"use client";

import { motion } from "framer-motion";

/* ----------------------------------------------------------------------------
   Inline loader: a ball settling in a bowl with a damped bounce — the same
   descent motif as the splash, sized for buttons and inline states. Inherits
   currentColor so it adapts to whatever it sits inside.
---------------------------------------------------------------------------- */

const BOWL = "M3 6 Q 12 21, 21 6";

export function Spinner({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      role="status"
      aria-label="Loading"
    >
      <path d={BOWL} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.3" />
      <motion.circle
        r="2.6"
        fill="currentColor"
        style={{ offsetPath: `path('${BOWL}')`, offsetRotate: "0deg" }}
        animate={{ offsetDistance: ["50%", "10%", "50%", "90%", "50%", "28%", "50%", "72%", "50%"] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}
