"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, ArrowClockwise, CaretDown } from "@phosphor-icons/react";
import { Reveal } from "@/components/motion/Reveal";

type Control = { label: string; value: string; pct: number };

type Lesson = {
  id: string;
  label: string;
  slug: string;
  title: string;
  blurb: string;
  controls: [Control, Control];
  Viz: () => React.ReactElement;
};

const lessons: Lesson[] = [
  {
    id: "linear",
    label: "Linear regression",
    slug: "linear-regression",
    title: "Linear Regression",
    blurb: "Fit a straight line through noisy data, one residual at a time.",
    controls: [
      { label: "slope", value: "1.4", pct: 56 },
      { label: "intercept", value: "12", pct: 40 },
    ],
    Viz: LinearRegressionViz,
  },
  {
    id: "gradient",
    label: "Gradient descent",
    slug: "gradient-descent",
    title: "Gradient Descent",
    blurb: "Watch the optimizer roll toward the minimum.",
    controls: [
      { label: "learning rate", value: "0.08", pct: 32 },
      { label: "iterations", value: "240", pct: 70 },
    ],
    Viz: GradientDescentViz,
  },
  {
    id: "logistic",
    label: "Logistic regression",
    slug: "logistic-regression",
    title: "Logistic Regression",
    blurb: "Squash the line into a probability with the sigmoid.",
    controls: [
      { label: "threshold", value: "0.50", pct: 50 },
      { label: "steepness", value: "1.8", pct: 60 },
    ],
    Viz: LogisticRegressionViz,
  },
  {
    id: "neural",
    label: "Neural networks",
    slug: "neural-networks",
    title: "Neural Networks",
    blurb: "Signal flows forward through layers of weighted neurons.",
    controls: [
      { label: "hidden units", value: "6", pct: 50 },
      { label: "activation", value: "ReLU", pct: 66 },
    ],
    Viz: NeuralNetworkViz,
  },
  {
    id: "backprop",
    label: "Backpropagation",
    slug: "backpropagation",
    title: "Backpropagation",
    blurb: "Errors travel backward, nudging every weight.",
    controls: [
      { label: "learning rate", value: "0.03", pct: 24 },
      { label: "batch size", value: "32", pct: 44 },
    ],
    Viz: BackpropViz,
  },
];

export function DemoShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [12, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.93, 1]);

  const [activeId, setActiveId] = useState("gradient");
  const active = lessons.find((l) => l.id === activeId) ?? lessons[1];
  const activeIndex = lessons.findIndex((l) => l.id === activeId);

  // Run replays the current viz by remounting it via the key.
  const [runKey, setRunKey] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const runTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleRun() {
    if (runTimer.current) clearTimeout(runTimer.current);
    setRunKey((k) => k + 1);
    setIsRunning(true);
    runTimer.current = setTimeout(() => setIsRunning(false), 2200);
  }

  function selectLesson(id: string) {
    if (runTimer.current) clearTimeout(runTimer.current);
    setActiveId(id);
    setIsRunning(false);
  }

  return (
    <section id="demo" className="relative scroll-mt-24 px-5 py-24 sm:py-32">
      <div className="glow-violet absolute left-1/2 top-1/3 h-[36rem] w-[36rem] -translate-x-1/2 opacity-20 blur-3xl" />

      <div className="mx-auto max-w-6xl text-center">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-violet">
            The app
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display mx-auto mt-4 max-w-2xl text-[length:var(--text-display)] font-bold">
            This is where it all comes together.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-lg text-muted">
            A focused workspace for every concept: visualization on one side,
            the controls in your hands, the math always within reach.
          </p>
        </Reveal>
      </div>

      {/* perspective wrapper */}
      <div
        ref={ref}
        className="mx-auto mt-16 max-w-5xl"
        style={{ perspective: 1400 }}
      >
        <motion.div
          style={{ y, rotateX, scale, transformOrigin: "center top" }}
          className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_40px_120px_-20px_oklch(0.1_0.02_60)]"
        >
          {/* window chrome */}
          <div className="flex items-center gap-2 border-b border-border-soft bg-surface-2 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-danger/70" />
            <span className="h-3 w-3 rounded-full bg-warning/70" />
            <span className="h-3 w-3 rounded-full bg-success/70" />
            <div className="mx-auto flex items-center gap-2 rounded-md bg-bg/60 px-3 py-1 font-mono text-xs text-faint">
              app.gradient.dev/{active.slug}
            </div>
          </div>

          {/* app body */}
          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr]">
            {/* sidebar */}
            <aside className="hidden flex-col gap-1 border-r border-border-soft bg-bg/40 p-4 sm:flex">
              <p className="px-2 pb-2 font-mono text-[0.65rem] uppercase tracking-widest text-faint">
                Foundations
              </p>
              {lessons.map((l, i) => {
                const isActive = l.id === activeId;
                const isDone = i < activeIndex;
                return (
                  <button
                    key={l.id}
                    onClick={() => selectLesson(l.id)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      isActive
                        ? "bg-surface-2 text-text"
                        : "text-muted hover:bg-surface-2/50 hover:text-text"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isActive ? "bg-coral" : isDone ? "bg-success" : "bg-border"
                      }`}
                    />
                    {l.label}
                  </button>
                );
              })}
            </aside>

            {/* main panel */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl font-semibold">
                    {active.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{active.blurb}</p>
                </div>
                <button
                  onClick={handleRun}
                  className="flex shrink-0 items-center gap-2 rounded-full bg-coral px-4 py-2 text-sm font-semibold text-bg transition-transform active:scale-95"
                >
                  {isRunning ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="flex"
                    >
                      <ArrowClockwise size={14} weight="bold" />
                    </motion.span>
                  ) : (
                    <Play size={14} weight="fill" />
                  )}
                  {isRunning ? "Running…" : "Run"}
                </button>
              </div>

              {/* viz — remounts on switch so animations replay */}
              <motion.div
                key={`${active.id}-${runKey}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 rounded-xl border border-border-soft bg-bg/50 p-4"
              >
                <active.Viz />
              </motion.div>

              {/* controls */}
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Slider {...active.controls[0]} />
                <Slider {...active.controls[1]} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const VIOLET = "oklch(0.64 0.19 288)";
const CORAL = "oklch(0.72 0.17 35)";

function VizSvg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 560 240" className="h-auto w-full" fill="none">
      {children}
    </svg>
  );
}

function LinearRegressionViz() {
  // points scattered around the line y = -0.32x + 210
  const pts = [
    [60, 188], [110, 178], [150, 150], [200, 158], [250, 132],
    [300, 118], [350, 96], [400, 104], [450, 70], [500, 66],
  ];
  const line = { x1: 40, y1: 198, x2: 520, y2: 44 };
  return (
    <VizSvg>
      {/* residuals */}
      {pts.map(([x, y], i) => {
        const t = (x - line.x1) / (line.x2 - line.x1);
        const ly = line.y1 + t * (line.y2 - line.y1);
        return (
          <motion.line
            key={`r${i}`}
            x1={x} y1={y} x2={x} y2={ly}
            stroke={CORAL} strokeWidth="1.5" strokeOpacity="0.4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.04 }}
          />
        );
      })}
      {/* fitted line */}
      <motion.line
        x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
        stroke={VIOLET} strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* points */}
      {pts.map(([x, y], i) => (
        <motion.circle
          key={`p${i}`}
          cx={x} cy={y} r="5" fill={CORAL}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        />
      ))}
    </VizSvg>
  );
}

function GradientDescentViz() {
  const curve =
    "M30 30 C 160 30, 180 200, 280 200 C 380 200, 400 30, 530 30";
  return (
    <VizSvg>
      <defs>
        <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={VIOLET} stopOpacity="0.25" />
          <stop offset="100%" stopColor={VIOLET} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${curve} L 530 220 L 30 220 Z`} fill="url(#curveFill)" />
      <path d={curve} stroke={VIOLET} strokeWidth="2" strokeLinecap="round" />
      <motion.circle
        r="8" fill={CORAL}
        initial={{ offsetDistance: "8%" }}
        whileInView={{ offsetDistance: ["8%", "50%"] }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        style={{ offsetPath: `path('${curve}')` }}
      />
    </VizSvg>
  );
}

function LogisticRegressionViz() {
  // S-curve: low-left rising to high-right
  const curve =
    "M30 200 C 180 198, 230 196, 280 120 C 330 44, 380 42, 530 40";
  const negClass = [[60, 192], [95, 200], [130, 186], [165, 196], [200, 180], [235, 192]];
  const posClass = [[330, 60], [365, 48], [400, 58], [435, 44], [470, 52], [505, 46]];
  return (
    <VizSvg>
      <defs>
        <linearGradient id="sigFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={VIOLET} stopOpacity="0.2" />
          <stop offset="100%" stopColor={VIOLET} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* decision threshold */}
      <line x1="280" y1="20" x2="280" y2="220" stroke="oklch(0.5 0.02 60)" strokeWidth="1" strokeDasharray="4 5" />
      <path d={`${curve} L 530 220 L 30 220 Z`} fill="url(#sigFill)" />
      <motion.path
        d={curve} stroke={VIOLET} strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
      {[...negClass, ...posClass].map(([x, y], i) => (
        <motion.circle
          key={i} cx={x} cy={y} r="5"
          fill={i < negClass.length ? "oklch(0.5 0.02 60)" : CORAL}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.3 + i * 0.04 }}
        />
      ))}
    </VizSvg>
  );
}

const NET_LAYERS = [
  [70, [70, 120, 170]],
  [230, [55, 100, 145, 190]],
  [390, [70, 120, 170]],
  [510, [120]],
];

function NeuralNetworkViz() {
  const layers = NET_LAYERS as [number, number[]][];
  const edges: { x1: number; y1: number; x2: number; y2: number; key: string }[] = [];
  for (let l = 0; l < layers.length - 1; l++) {
    const [x1, ys1] = layers[l];
    const [x2, ys2] = layers[l + 1];
    ys1.forEach((y1, a) =>
      ys2.forEach((y2, b) =>
        edges.push({ x1, y1, x2, y2, key: `${l}-${a}-${b}` })
      )
    );
  }
  return (
    <VizSvg>
      {edges.map((e, i) => (
        <motion.line
          key={e.key}
          x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
          stroke={VIOLET} strokeWidth="1" strokeOpacity="0.25"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.01 }}
        />
      ))}
      {layers.map(([x, ys], l) =>
        ys.map((y, n) => (
          <motion.circle
            key={`${l}-${n}`}
            cx={x} cy={y} r="10"
            fill={l === layers.length - 1 ? CORAL : "oklch(0.28 0.03 288)"}
            stroke={VIOLET} strokeWidth="1.5"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 + l * 0.15 + n * 0.05 }}
          />
        ))
      )}
    </VizSvg>
  );
}

function BackpropViz() {
  const layers = NET_LAYERS as [number, number[]][];
  const edges: { x1: number; y1: number; x2: number; y2: number; key: string }[] = [];
  // reverse order so the gradient appears to flow backward
  for (let l = layers.length - 1; l > 0; l--) {
    const [x2, ys2] = layers[l];
    const [x1, ys1] = layers[l - 1];
    ys2.forEach((y2, b) =>
      ys1.forEach((y1, a) =>
        edges.push({ x1: x2, y1: y2, x2: x1, y2: y1, key: `${l}-${b}-${a}` })
      )
    );
  }
  return (
    <VizSvg>
      <defs>
        <marker id="bpArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 Z" fill={CORAL} />
        </marker>
      </defs>
      {edges.map((e, i) => (
        <motion.line
          key={e.key}
          x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
          stroke={CORAL} strokeWidth="1.25" strokeOpacity="0.5"
          markerEnd="url(#bpArrow)"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.015 }}
        />
      ))}
      {layers.map(([x, ys], l) =>
        ys.map((y, n) => (
          <circle
            key={`${l}-${n}`}
            cx={x} cy={y} r="10"
            fill={l === layers.length - 1 ? CORAL : "oklch(0.28 0.03 288)"}
            stroke={CORAL} strokeWidth="1.5" strokeOpacity="0.6"
          />
        ))
      )}
    </VizSvg>
  );
}

function Slider({ label, value, pct }: Control) {
  return (
    <div className="rounded-xl border border-border-soft bg-surface/50 p-3">
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="text-muted">{label}</span>
        <span className="flex items-center gap-1 text-text">
          {value} <CaretDown size={10} className="text-faint" />
        </span>
      </div>
      <div className="mt-2.5 h-1.5 rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-coral"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
