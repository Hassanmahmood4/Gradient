"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds for sequencing siblings. */
  delay?: number;
  /** Vertical travel distance in px. */
  y?: number;
  /** Horizontal travel distance in px (for directional slide-in). */
  x?: number;
  as?: "div" | "section" | "li" | "span" | "h2" | "p";
}

/** Scroll-triggered entrance: fade + rise/slide, fires once when in view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  x = 0,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: easeOutExpo, delay }}
    >
      {children}
    </MotionTag>
  );
}

/** Container that staggers its <Reveal>-like children. */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};
