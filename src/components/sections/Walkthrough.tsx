"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useReducedMotion,
} from "framer-motion";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

/* ---- bowl geometry (1D quadratic loss) ---------------------------------- */
const W = 460;
const H = 280;
const CX = W / 2;
const X_SPAN = 160;
const Y_BOTTOM = 224;
const Y_TOP = 36;

const clampD = (d: number) => Math.max(-1.14, Math.min(1.14, d));
const xScreen = (d: number) => CX + d * X_SPAN;
const yScreen = (d: number) => Y_BOTTOM - d * d * (Y_BOTTOM - Y_TOP);

/* gradient-descent trajectory per chapter, as a function of local progress p */
const trajectories = [
  // 0: learning rate too small — barely crawls down
  (p: number) => -0.95 * (1 - 0.45 * p),
  // 1: just right — eases smoothly into the minimum
  (p: number) => -0.95 * Math.pow(1 - p, 3),
  // 2: too large — oscillates and diverges, climbing the walls
  (p: number) => -Math.cos(p * Math.PI * 3.2) * (0.42 + 0.62 * p),
];

const chapters = [
  {
    tag: "α = 0.01",
    title: "Too small, and you crawl.",
    body: "A timid learning rate barely moves the weights. You converge eventually, but it takes forever. Watch the optimizer inch down the slope.",
    verdict: "Slow convergence",
    accent: "var(--color-violet)",
  },
  {
    tag: "α = 0.1",
    title: "Just right, and it glides.",
    body: "A well-tuned rate slides straight to the minimum in a handful of steps. This is the sweet spot you're hunting for.",
    verdict: "Converges cleanly",
    accent: "var(--color-coral)",
  },
  {
    tag: "α = 0.9",
    title: "Too large, and it explodes.",
    body: "Overshoot the minimum and each step lands further out than the last. The loss oscillates and diverges. This is why your model returns NaN.",
    verdict: "Diverges",
    accent: "var(--color-danger)",
  },
];

/* build the faint full trajectory polyline for a chapter */
function trajectoryPoints(idx: number) {
  const fn = trajectories[idx];
  const pts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const p = i / 60;
    const d = clampD(fn(p));
    pts.push(`${xScreen(d).toFixed(1)},${yScreen(d).toFixed(1)}`);
  }
  return pts.join(" ");
}

/* the static bowl path */
function bowlPath() {
  const pts: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const d = -1.12 + (i / 80) * 2.24;
    pts.push(`${i === 0 ? "M" : "L"}${xScreen(d).toFixed(1)} ${yScreen(d).toFixed(1)}`);
  }
  return pts.join(" ");
}

export function Walkthrough() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [idx, setIdx] = useState(0);
  const [d, setD] = useState(trajectories[0](0));

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const p = Math.max(0, Math.min(0.9999, v));
    const i = Math.min(chapters.length - 1, Math.floor(p * chapters.length));
    const local = p * chapters.length - i;
    setIdx(i);
    setD(clampD(trajectories[i](local)));
  });

  const ball = { x: xScreen(d), y: yScreen(d) };
  const chapter = chapters[idx];
  const diverging = idx === 2 && Math.abs(d) > 0.98;

  return (
    <section className="relative px-5">
      <div ref={ref} className="relative" style={{ height: "320vh" }}>
        {/* pinned stage */}
        <div className="sticky top-0 flex min-h-screen items-center">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 py-20 lg:grid-cols-2">
            {/* left: scrolling chapters */}
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-coral">
                Scroll to explore · learning rate
              </span>

              {/* stepper */}
              <div className="mt-6 flex items-center gap-2">
                {chapters.map((c, i) => (
                  <span
                    key={c.tag}
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: i === idx ? 36 : 16,
                      background: i === idx ? c.accent : "var(--color-border)",
                    }}
                  />
                ))}
              </div>

              <div className="relative mt-7 min-h-[230px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.45, ease: easeOutExpo }}
                  >
                    <span
                      className="inline-block rounded-full border px-3 py-1 font-mono text-xs"
                      style={{ borderColor: chapter.accent, color: chapter.accent }}
                    >
                      {chapter.tag}
                    </span>
                    <h2 className="font-display mt-4 text-[length:var(--text-title)] font-bold">
                      {chapter.title}
                    </h2>
                    <p className="mt-4 max-w-md leading-relaxed text-muted">
                      {chapter.body}
                    </p>
                    <p className="mt-5 flex items-center gap-2 font-mono text-sm">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: chapter.accent }}
                      />
                      <span style={{ color: chapter.accent }}>{chapter.verdict}</span>
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* right: pinned visualization */}
            <div className="relative rounded-3xl border border-border-soft bg-surface/40 p-5">
              <div className="glow-coral pointer-events-none absolute inset-0 m-auto h-48 w-48 opacity-10 blur-3xl" />
              <svg viewBox={`0 0 ${W} ${H}`} className="relative h-auto w-full" fill="none">
                {/* axes */}
                <line x1="30" y1={Y_BOTTOM + 18} x2={W - 20} y2={Y_BOTTOM + 18} stroke="var(--color-border)" />
                <text x="30" y={H - 6} className="fill-[var(--color-faint)] font-mono" fontSize="11">
                  weight
                </text>
                <text
                  x="22"
                  y="28"
                  className="fill-[var(--color-faint)] font-mono"
                  fontSize="11"
                  transform="rotate(-90 22 28)"
                >
                  loss
                </text>

                {/* loss bowl */}
                <path d={bowlPath()} stroke="var(--color-border)" strokeWidth="2" />

                {/* minimum marker */}
                <line
                  x1={CX}
                  y1={Y_BOTTOM}
                  x2={CX}
                  y2={Y_BOTTOM + 12}
                  stroke="var(--color-success)"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <circle cx={CX} cy={Y_BOTTOM} r="3" fill="var(--color-success)" />

                {/* faint trajectory for the active chapter */}
                <motion.polyline
                  key={idx}
                  points={trajectoryPoints(idx)}
                  stroke={chapter.accent}
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                  strokeDasharray="2 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: easeOutExpo }}
                />

                {/* the optimizer ball */}
                <motion.circle
                  cx={ball.x}
                  cy={ball.y}
                  r="9"
                  fill={chapter.accent}
                  animate={
                    prefersReduced
                      ? undefined
                      : { scale: diverging ? [1, 1.35, 1] : 1 }
                  }
                  transition={{ duration: 0.4, repeat: diverging ? Infinity : 0 }}
                  style={{ transformOrigin: `${ball.x}px ${ball.y}px` }}
                />
                <circle cx={ball.x} cy={ball.y} r="9" fill="none" stroke={chapter.accent} strokeOpacity="0.3" strokeWidth="6" />

                {diverging && (
                  <text
                    x={ball.x}
                    y={Math.max(ball.y - 18, 20)}
                    textAnchor="middle"
                    className="fill-[var(--color-danger)] font-mono font-semibold"
                    fontSize="12"
                  >
                    NaN ↗
                  </text>
                )}
              </svg>

              <p className="mt-2 text-center font-mono text-xs text-faint">
                loss surface · gradient descent
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
