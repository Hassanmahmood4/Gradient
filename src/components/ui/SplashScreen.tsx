"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";

/* ----------------------------------------------------------------------------
   One-time boot splash: the brand's loss curve with a coral ball rolling to the
   minimum. Mounted in the root layout, so it shows once when the site is opened
   (a full page load) and never on client-side navigation between routes.
---------------------------------------------------------------------------- */

const BOWL = "M20 30 C 120 30, 132 130, 170 130 C 208 130, 220 30, 320 30";
const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // brief branded moment, then reveal the app
    const t = setTimeout(() => setVisible(false), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
        >
          <svg viewBox="0 0 340 160" className="w-64 max-w-[70vw]" fill="none" aria-hidden>
            <motion.path
              d={BOWL}
              stroke="var(--color-violet)"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: easeOutExpo }}
            />
            <line x1="170" y1="130" x2="170" y2="146" stroke="var(--color-success)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
            <circle cx="170" cy="130" r="3" fill="var(--color-success)" opacity="0.6" />
            <motion.circle
              r="7"
              fill="var(--color-coral)"
              style={{ offsetPath: `path('${BOWL}')`, offsetRotate: "0deg" }}
              initial={{ offsetDistance: "2%", opacity: 0 }}
              animate={{ offsetDistance: ["2%", "50%", "50%"], opacity: [0, 1, 1] }}
              transition={{ duration: 1.2, times: [0, 0.7, 1], ease: easeOutExpo }}
            />
          </svg>

          <div className="flex items-center gap-2.5">
            <Logo className="h-6 w-6" />
            <span className="font-display text-lg font-bold tracking-tight">Gradient</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
