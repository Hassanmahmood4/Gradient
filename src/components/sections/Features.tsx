"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import {
  ChartLine,
  Function as FunctionIcon,
  Path,
  Sliders,
  Sparkle,
} from "@phosphor-icons/react";
import { Reveal } from "@/components/motion/Reveal";

export function Features() {
  return (
    <section id="features" className="relative px-5 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-coral">
            Why it clicks
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display mt-4 max-w-2xl text-[length:var(--text-display)] font-bold">
            The textbook tells you. We let you feel it.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-xl text-muted">
            Every concept is a live system you can poke. No passive reading,
            no hand-waving, no &ldquo;trust the math.&rdquo;
          </p>
        </Reveal>

        {/* asymmetric bento */}
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-2">
          {/* Large: interactive playground */}
          <FeatureBlock
            className="md:col-span-4 md:row-span-2"
            x={-44}
            icon={<Sliders size={20} weight="bold" />}
            title="Interactive playgrounds"
            body="Drag data points and watch the model refit instantly. Tune the learning rate and see gradient descent diverge or converge. The math is no longer abstract, it responds to you."
            large
          >
            <PlaygroundViz />
          </FeatureBlock>

          {/* Medium: real math */}
          <FeatureBlock
            className="md:col-span-2"
            x={44}
            icon={<FunctionIcon size={20} weight="bold" />}
            title="Real math, made legible"
            body="Equations rendered cleanly, every symbol hover-explained. We respect that you came for the rigor."
          >
            <div className="mt-4 rounded-xl border border-border-soft bg-bg/60 px-4 py-3 font-mono text-sm text-muted">
              <span className="text-violet">θ</span> := <span className="text-violet">θ</span>{" "}
              − <span className="text-coral">α</span> ∇
              <span className="text-coral">J</span>(<span className="text-violet">θ</span>)
            </div>
          </FeatureBlock>

          {/* Medium: guided paths */}
          <FeatureBlock
            className="md:col-span-2"
            x={44}
            delay={0.08}
            icon={<Path size={20} weight="bold" />}
            title="Guided paths"
            body="A clear route from linear regression to transformers. Always know the next step."
          >
            <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[0.7rem]">
              {["regression", "gradient descent", "neural nets", "CNNs", "attention"].map(
                (t, i) => (
                  <span
                    key={t}
                    className="rounded-full border border-border-soft px-2.5 py-1"
                    style={{ color: i === 1 ? "var(--color-coral)" : undefined }}
                  >
                    {t}
                  </span>
                ),
              )}
            </div>
          </FeatureBlock>
        </div>

        {/* wide strip */}
        <Reveal delay={0.1}>
          <div className="mt-4 flex flex-col items-start justify-between gap-6 rounded-3xl border border-border-soft bg-surface/40 p-7 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-surface-2 text-violet">
                <ChartLine size={20} weight="bold" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold">
                  Track every concept you conquer
                </h3>
                <p className="mt-1 max-w-md text-sm text-muted">
                  Progress saved per topic, with quick checks that prove you
                  actually understand, not just recognize.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-faint">
              <Sparkle size={14} className="text-coral" />
              streaks · checkpoints · mastery
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FeatureBlock({
  className = "",
  icon,
  title,
  body,
  children,
  large = false,
  x = 0,
  delay = 0,
}: {
  className?: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  children?: React.ReactNode;
  large?: boolean;
  x?: number;
  delay?: number;
}) {
  return (
    <Reveal
      x={x}
      delay={delay}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-border-soft bg-surface/40 p-7 transition-colors hover:border-coral/40 ${className}`}
    >
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-surface-2 text-coral">
        {icon}
      </span>
      <h3
        className={`font-display mt-5 font-semibold ${large ? "text-2xl" : "text-lg"}`}
      >
        {title}
      </h3>
      <p className={`mt-2 text-muted ${large ? "max-w-md" : "text-sm"}`}>{body}</p>
      {children}
    </Reveal>
  );
}

/* Regression-fit visual whose best-fit line draws as you scroll through it */
function PlaygroundViz() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "center 0.4"],
  });
  // scrub the line: empty at entry, fully drawn by the time it's centered
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const points = [
    [60, 200],
    [120, 170],
    [180, 150],
    [240, 130],
    [300, 95],
    [360, 80],
  ];

  return (
    <div ref={ref} className="relative mt-auto pt-8">
      <svg viewBox="0 0 420 240" className="h-auto w-full" fill="none">
        {/* axes */}
        <line x1="40" y1="220" x2="400" y2="220" stroke="var(--color-border)" />
        <line x1="40" y1="20" x2="40" y2="220" stroke="var(--color-border)" />

        {/* best-fit line scrubs with scroll position */}
        <motion.line
          x1="50"
          y1="205"
          x2="390"
          y2="70"
          stroke="oklch(0.72 0.17 35)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={prefersReduced ? { pathLength: 1 } : { pathLength }}
        />

        {points.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="6"
            fill="oklch(0.64 0.19 288)"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 320, damping: 18 }}
            style={{ transformOrigin: `${x}px ${y}px` }}
          />
        ))}
      </svg>
    </div>
  );
}
