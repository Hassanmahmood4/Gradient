"use client";

import { motion } from "framer-motion";
import { Sliders, Function as Fn, Path, Check } from "@phosphor-icons/react";
import { Reveal } from "@/components/motion/Reveal";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export function FeatureRows() {
  return (
    <section id="features" className="relative scroll-mt-24 px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-coral">
            Why it clicks
          </span>
          <h2 className="font-display mt-4 text-[length:var(--text-display)] font-bold">
            Built to be poked, not read.
          </h2>
        </Reveal>

        <div className="mt-20 flex flex-col gap-24 sm:gap-32">
          <Row
            eyebrow="Interactive playgrounds"
            icon={<Sliders size={18} weight="bold" />}
            title="Drag the data. Watch the model chase it."
            body="Move a point and the best-fit line refits instantly. Tune the learning rate and watch gradient descent converge, crawl, or blow up. Nothing is pre-rendered, it responds to you."
            viz={<RegressionViz />}
          />
          <Row
            reversed
            eyebrow="Real math, made legible"
            icon={<Fn size={18} weight="bold" />}
            title="The rigor stays. The fog lifts."
            body="Every equation is rendered cleanly with each symbol explained on hover. You came for the math, so we keep it front and center, just no longer abstract."
            viz={<EquationViz />}
          />
          <Row
            eyebrow="Guided paths & progress"
            icon={<Path size={18} weight="bold" />}
            title="A clear route from regression to transformers."
            body="Follow a structured path, always knowing the next step. Progress saves per concept, with quick checks that prove you understand rather than just recognize."
            viz={<PathViz />}
          />
        </div>
      </div>
    </section>
  );
}

function Row({
  eyebrow,
  icon,
  title,
  body,
  viz,
  reversed = false,
}: {
  eyebrow: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  viz: React.ReactNode;
  reversed?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <Reveal
        x={reversed ? 40 : -40}
        className={reversed ? "md:order-2" : ""}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface/40 px-3 py-1.5 font-mono text-xs text-coral">
          {icon}
          {eyebrow}
        </span>
        <h3 className="font-display mt-5 text-[length:var(--text-title)] font-bold leading-tight">
          {title}
        </h3>
        <p className="mt-4 max-w-md leading-relaxed text-muted">{body}</p>
      </Reveal>

      <Reveal
        x={reversed ? -40 : 40}
        delay={0.1}
        className={`relative rounded-3xl border border-border-soft bg-surface/30 p-6 transition-colors duration-300 hover:border-coral/30 ${
          reversed ? "md:order-1" : ""
        }`}
      >
        <div className="glow-coral pointer-events-none absolute inset-0 m-auto h-40 w-40 opacity-10 blur-3xl" />
        {viz}
      </Reveal>
    </div>
  );
}

/* ---- regression: scatter + best-fit line + residuals ------------------- */
function RegressionViz() {
  const points = [
    [70, 220],
    [130, 190],
    [195, 168],
    [255, 132],
    [320, 118],
    [380, 78],
    [430, 62],
  ];
  // line endpoints approximating the fit
  const lineY = (x: number) => 250 - x * 0.43;

  return (
    <svg viewBox="0 0 480 270" className="h-auto w-full" fill="none">
      <line x1="40" y1="240" x2="460" y2="240" stroke="var(--color-border)" />
      <line x1="40" y1="30" x2="40" y2="240" stroke="var(--color-border)" />

      {/* residuals */}
      {points.map(([x, y], i) => (
        <motion.line
          key={`r${i}`}
          x1={x}
          y1={y}
          x2={x}
          y2={lineY(x)}
          stroke="var(--color-violet)"
          strokeOpacity={0.3}
          strokeDasharray="2 3"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 + i * 0.05, duration: 0.4 }}
        />
      ))}

      <motion.line
        x1="55"
        y1={lineY(55)}
        x2="450"
        y2={lineY(450)}
        stroke="var(--color-coral)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: easeOutExpo }}
      />

      {points.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r="6"
          fill="url(#hs-violet)"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07, type: "spring", stiffness: 320, damping: 18 }}
          style={{ transformOrigin: `${x}px ${y}px` }}
        />
      ))}
      <defs>
        <radialGradient id="hs-violet">
          <stop offset="0%" stopColor="oklch(0.7 0.19 288)" />
          <stop offset="100%" stopColor="oklch(0.58 0.21 286)" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ---- equation panel with highlighted symbols --------------------------- */
function EquationViz() {
  const symbols: { t: string; cls?: string; note?: string }[] = [
    { t: "θ", cls: "text-violet", note: "weights" },
    { t: ":=" },
    { t: "θ", cls: "text-violet" },
    { t: "−" },
    { t: "α", cls: "text-coral", note: "learning rate" },
    { t: "∇J(θ)", cls: "text-coral", note: "gradient" },
  ];
  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-2xl sm:text-3xl">
        {symbols.map((s, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.4 }}
            className={`group relative ${s.cls ?? "text-muted"}`}
          >
            {s.t}
            {s.note && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border-soft bg-surface px-2 py-0.5 text-[0.6rem] text-faint opacity-0 transition-opacity group-hover:opacity-100">
                {s.note}
              </span>
            )}
          </motion.span>
        ))}
      </div>
      <p className="text-center font-mono text-xs text-faint">
        hover a symbol to see what it means
      </p>
      <div className="mx-auto flex gap-1.5">
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.span
            key={i}
            className="h-6 w-1 rounded-full bg-coral/30"
            initial={{ scaleY: 0.2 }}
            whileInView={{ scaleY: [0.2, 1 - i / 30, 0.2] }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.04, duration: 0.5 }}
            style={{ transformOrigin: "bottom" }}
          />
        ))}
      </div>
    </div>
  );
}

/* ---- guided path with progress ----------------------------------------- */
function PathViz() {
  const steps = [
    { label: "Regression", done: true },
    { label: "Gradient descent", done: true },
    { label: "Neural nets", active: true },
    { label: "CNNs", done: false },
    { label: "Attention", done: false },
  ];
  return (
    <div className="flex flex-col gap-3 py-3">
      {steps.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5, ease: easeOutExpo }}
          className={`flex items-center gap-4 rounded-2xl border px-4 py-3 ${
            s.active
              ? "border-coral/50 bg-surface/60"
              : "border-border-soft bg-surface/20"
          }`}
        >
          <span
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs ${
              s.done
                ? "bg-success/20 text-success"
                : s.active
                  ? "bg-coral text-bg"
                  : "bg-surface-2 text-faint"
            }`}
          >
            {s.done ? <Check size={14} weight="bold" /> : i + 1}
          </span>
          <span className={`text-sm ${s.active ? "text-text" : "text-muted"}`}>
            {s.label}
          </span>
          {s.active && (
            <span className="ml-auto font-mono text-xs text-coral">in progress</span>
          )}
        </motion.div>
      ))}
    </div>
  );
}
