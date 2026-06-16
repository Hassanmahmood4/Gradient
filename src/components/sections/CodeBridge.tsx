"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, type TargetAndTransition, type Transition } from "framer-motion";
import { siPytorch, siTensorflow, siScikitlearn, siNumpy, siHuggingface } from "simple-icons";
import { Reveal } from "@/components/motion/Reveal";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

type SimpleIcon = { path: string; title: string };

const frameworks: {
  key: string;
  icon: SimpleIcon;
  name: string;
  code: string;
  focus: string;
  vizTitle: string;
  note: string;
}[] = [
  {
    key: "pytorch",
    icon: siPytorch,
    name: "PyTorch",
    focus: "autograd",
    vizTitle: "Autograd — forward, then backward",
    note: "loss.backward() fills w.grad with ∂L/∂w. Then w -= lr * grad is the exact step the ball takes downhill.",
    code: `import torch

w = torch.zeros(1, requires_grad=True)
lr = 0.1

for _ in range(100):
    y_pred = X @ w
    loss = ((y_pred - y) ** 2).mean()
    loss.backward()              # autograd
    with torch.no_grad():
        w -= lr * w.grad         # one GD step
        w.grad.zero_()`,
  },
  {
    key: "tensorflow",
    icon: siTensorflow,
    name: "TensorFlow",
    focus: "GradientTape",
    vizTitle: "GradientTape records, then replays",
    note: "The tape records the forward pass, then SGD.apply_gradients nudges w one step closer to the minimum.",
    code: `import tensorflow as tf

w = tf.Variable(tf.zeros([1]))
opt = tf.keras.optimizers.SGD(0.1)

for _ in range(100):
    with tf.GradientTape() as tape:
        y_pred = X @ w
        loss = tf.reduce_mean((y_pred - y) ** 2)
    grads = tape.gradient(loss, [w])
    opt.apply_gradients(zip(grads, [w]))`,
  },
  {
    key: "huggingface",
    icon: siHuggingface,
    name: "Hugging Face",
    focus: "🤗 Accelerate",
    vizTitle: "One step, mirrored across devices",
    note: "The same backward and step, made device-agnostic. It runs on CPU, GPU, or TPU without changing a line.",
    code: `from accelerate import Accelerator

accelerator = Accelerator()
model, opt, data = accelerator.prepare(
    model, opt, data
)

for x, y in data:
    loss = ((model(x) - y) ** 2).mean()
    accelerator.backward(loss)   # same GD step
    opt.step()
    opt.zero_grad()`,
  },
  {
    key: "sklearn",
    icon: siScikitlearn,
    name: "scikit-learn",
    focus: "one call",
    vizTitle: "fit() — data in, model out",
    note: "SGDRegressor.fit() runs this exact descent loop for you, hidden behind a single method call.",
    code: `from sklearn.linear_model import SGDRegressor

model = SGDRegressor(
    learning_rate="constant",
    eta0=0.1,
    max_iter=100,
)
model.fit(X, y)        # gradient descent inside
print(model.coef_)`,
  },
  {
    key: "numpy",
    icon: siNumpy,
    name: "NumPy",
    focus: "from scratch",
    vizTitle: "The gradient, written by hand",
    note: "No autograd here. You write the gradient 2·Xᵀ(Xw - y)/n yourself: the raw math, nothing hidden.",
    code: `import numpy as np

w = np.zeros(X.shape[1])
lr = 0.1

for _ in range(100):
    err = X @ w - y
    grad = 2 * X.T @ err / len(y)
    w -= lr * grad               # the update rule`,
  },
];

/* lightweight python highlighter -> coral strings, violet keywords */
const KEYWORDS = new Set([
  "import", "from", "as", "for", "in", "with", "def", "return", "print",
  "True", "False", "None", "range",
]);

function highlightLine(line: string, lineKey: number): ReactNode {
  const pattern = /(#.*)|('[^']*'|"[^"]*")|(\d+(?:\.\d+)?)|([A-Za-z_][\w]*)/g;
  const nodes: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = pattern.exec(line))) {
    if (m.index > last) nodes.push(line.slice(last, m.index));
    const [full, comment, str, num, word] = m;
    if (comment) nodes.push(<span key={k} className="text-faint italic">{comment}</span>);
    else if (str) nodes.push(<span key={k} className="text-coral">{str}</span>);
    else if (num) nodes.push(<span key={k} className="text-coral">{num}</span>);
    else if (word && KEYWORDS.has(word)) nodes.push(<span key={k} className="text-violet">{word}</span>);
    else nodes.push(full);
    last = pattern.lastIndex;
    k++;
  }
  if (last < line.length) nodes.push(line.slice(last));
  return <div key={lineKey} className="min-h-[1.5em]">{nodes}</div>;
}

export function CodeBridge() {
  const [active, setActive] = useState(0);
  const fw = frameworks[active];

  return (
    <section id="tools" className="relative scroll-mt-24 px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-coral">
            Concept → code
          </span>
          <h2 className="font-display mt-4 text-[length:var(--text-display)] font-bold">
            See it here. Write it there.
          </h2>
          <p className="mt-5 text-muted">
            The intuition you build dragging sliders maps straight onto the
            frameworks you&rsquo;ll actually ship with. Same gradient descent,
            five ways &mdash; each shown the way that framework thinks about it.
          </p>
        </Reveal>

        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-2">
          {/* left: the concept, visualized per framework */}
          <Reveal x={-40} className="relative flex flex-col rounded-3xl border border-border-soft bg-surface/30 p-6 sm:p-8">
            <div className="glow-coral pointer-events-none absolute inset-0 m-auto h-40 w-40 opacity-10 blur-3xl" />
            <span className="font-mono text-xs uppercase tracking-widest text-faint">
              what you&rsquo;re seeing
            </span>
            <AnimatePresence mode="wait">
              <motion.h3
                key={fw.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: easeOutExpo }}
                className="font-display mt-2 text-lg font-semibold"
              >
                {fw.vizTitle}
              </motion.h3>
            </AnimatePresence>

            <FrameworkViz variant={fw.key} />

            {/* annotation that tracks the selected framework */}
            <div className="mt-auto min-h-[88px] pt-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={fw.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: easeOutExpo }}
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-coral/40 px-3 py-1 font-mono text-xs text-coral">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                      <path d={fw.icon.path} />
                    </svg>
                    {fw.name} &middot; {fw.focus}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{fw.note}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>

          {/* right: the code */}
          <Reveal x={40} delay={0.1} className="overflow-hidden rounded-3xl border border-border bg-surface">
            {/* tabs */}
            <div className="flex flex-wrap gap-1 border-b border-border-soft bg-surface-2/60 p-2">
              {frameworks.map((f, i) => (
                <button
                  key={f.key}
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    i === active
                      ? "bg-bg text-text"
                      : "text-muted hover:text-text"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill={i === active ? "var(--color-coral)" : "currentColor"}
                    aria-hidden
                  >
                    <path d={f.icon.path} />
                  </svg>
                  {f.name}
                </button>
              ))}
            </div>

            {/* code */}
            <div className="relative">
              <div className="flex items-center gap-2 px-5 pt-4 font-mono text-xs text-faint">
                <span className="h-2.5 w-2.5 rounded-full bg-danger/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
                <span className="ml-2">linear_regression.py</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.pre
                  key={fw.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: easeOutExpo }}
                  className="overflow-x-auto px-5 py-5 font-mono text-[0.82rem] leading-relaxed text-muted"
                >
                  <code>
                    {fw.code.split("\n").map((line, i) => highlightLine(line, i))}
                  </code>
                </motion.pre>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Per-framework visualizations — each tells that framework's story.          */
/* -------------------------------------------------------------------------- */

function FrameworkViz({ variant }: { variant: string }) {
  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-border-soft bg-bg/50 p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={variant}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25, ease: easeOutExpo }}
        >
          {variant === "pytorch" && <PytorchViz />}
          {variant === "tensorflow" && <TensorflowViz />}
          {variant === "huggingface" && <HuggingfaceViz />}
          {variant === "sklearn" && <SklearnViz />}
          {variant === "numpy" && <NumpyViz />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const svgClass = "h-auto w-full";

function Node({ x, label, accent }: { x: number; label: string; accent?: boolean }) {
  return (
    <g transform={`translate(${x - 32}, 52)`}>
      <rect
        width="64"
        height="40"
        rx="10"
        fill="var(--color-surface-2)"
        stroke={accent ? "var(--color-coral)" : "var(--color-border)"}
      />
      <text x="32" y="25" textAnchor="middle" fontSize="13" className="fill-[var(--color-text)] font-mono">
        {label}
      </text>
      {accent && <circle cx="56" cy="8" r="3" fill="var(--color-coral)" />}
    </g>
  );
}

/* PyTorch: forward pass (coral) flows right, backward() (violet) flows back
   and fills the w.grad tensor. */
function PytorchViz() {
  const path = "M64 72 L366 72";
  const cycle = 3.6;
  return (
    <svg viewBox="0 0 430 200" className={svgClass} fill="none">
      <text x="215" y="36" textAnchor="middle" fontSize="9.5" className="fill-[var(--color-faint)] font-mono">
        forward →
      </text>

      <line x1="96" y1="72" x2="334" y2="72" stroke="var(--color-border)" strokeWidth="2" />

      <Node x={64} label="X" />
      <Node x={215} label="× w" accent />
      <Node x={366} label="loss" />

      {/* w.grad tensor — populates on the backward sweep */}
      <g transform="translate(180, 120)">
        <text x="37" y="-7" textAnchor="middle" fontSize="9.5" className="fill-[var(--color-violet)] font-mono">
          w.grad = ∂L/∂w
        </text>
        {[0, 1, 2, 3].map((i) => (
          <motion.rect
            key={i}
            x={(i % 2) * 40}
            y={Math.floor(i / 2) * 26}
            width="34"
            height="22"
            rx="4"
            fill="var(--color-violet)"
            stroke="var(--color-violet)"
            animate={{ fillOpacity: [0, 0, 0.28, 0.28, 0], opacity: [0.3, 0.3, 1, 1, 0.3] }}
            transition={{
              duration: cycle,
              times: [0, 0.6, 0.78, 0.92, 1],
              repeat: Infinity,
              delay: i * 0.06,
            }}
          />
        ))}
      </g>

      {/* forward token */}
      <motion.circle
        r="5"
        fill="var(--color-coral)"
        style={{ offsetPath: `path('${path}')` }}
        animate={{ offsetDistance: ["0%", "100%", "100%"], opacity: [1, 1, 0] }}
        transition={{ duration: cycle, times: [0, 0.42, 0.48], repeat: Infinity, ease: easeOutExpo }}
      />
      {/* backward token */}
      <motion.circle
        r="5"
        fill="var(--color-violet)"
        style={{ offsetPath: `path('${path}')` }}
        animate={{ offsetDistance: ["100%", "100%", "0%", "0%"], opacity: [0, 1, 1, 0] }}
        transition={{ duration: cycle, times: [0, 0.52, 0.86, 0.92], repeat: Infinity, ease: easeOutExpo }}
      />
    </svg>
  );
}

/* TensorFlow: a tape records the forward ops left→right, then a playback
   head sweeps back right→left to compute the gradients. */
function TensorflowViz() {
  const ops = ["X @ w", "− y", "( )²", "mean"];
  const cycle = 4;
  return (
    <svg viewBox="0 0 430 200" className={svgClass} fill="none">
      <text x="215" y="40" textAnchor="middle" fontSize="9.5" className="fill-[var(--color-faint)] font-mono">
        with tf.GradientTape() as tape
      </text>

      {/* tape body */}
      <rect x="34" y="74" width="362" height="58" rx="11" fill="var(--color-surface-2)" stroke="var(--color-border)" />

      {ops.map((op, i) => {
        const x = 48 + i * 88;
        return (
          <motion.g
            key={op}
            animate={{ opacity: [0, 0, 1, 1, 1], y: [7, 7, 0, 0, 0] }}
            transition={{
              duration: cycle,
              times: [0, 0.06 + i * 0.1, 0.16 + i * 0.1, 1, 1],
              repeat: Infinity,
              ease: easeOutExpo,
            }}
          >
            <rect x={x} y={84} width="76" height="38" rx="8" fill="var(--color-bg)" stroke="var(--color-coral)" strokeOpacity="0.5" />
            <text x={x + 38} y={108} textAnchor="middle" fontSize="11.5" className="fill-[var(--color-text)] font-mono">
              {op}
            </text>
          </motion.g>
        );
      })}

      {/* playback head computing gradients backward */}
      <motion.g
        animate={{ x: [398, 398, 32, 32] }}
        transition={{ duration: cycle, times: [0, 0.56, 0.92, 1], repeat: Infinity, ease: easeOutExpo }}
      >
        <line x1="0" y1="66" x2="0" y2="140" stroke="var(--color-violet)" strokeWidth="2" />
        <circle cx="0" cy="66" r="3.5" fill="var(--color-violet)" />
        <text x="0" y="158" textAnchor="middle" fontSize="9" className="fill-[var(--color-violet)] font-mono">
          tape.gradient
        </text>
      </motion.g>
    </svg>
  );
}

/* Hugging Face: accelerate dispatches the identical step to every device,
   in lock-step. */
function HuggingfaceViz() {
  const devices = ["CPU", "GPU", "TPU"];
  const cycle = 2.6;
  return (
    <svg viewBox="0 0 430 200" className={svgClass} fill="none">
      {/* central accelerator */}
      <rect x="150" y="16" width="130" height="40" rx="11" fill="var(--color-surface-2)" stroke="var(--color-coral)" strokeOpacity="0.6" />
      <text x="215" y="41" textAnchor="middle" fontSize="12" className="fill-[var(--color-text)] font-mono">
        🤗 accelerate
      </text>

      {devices.map((d, i) => {
        const cx = 95 + i * 120;
        const connector = `M215 56 C 215 92, ${cx} 78, ${cx} 112`;
        return (
          <g key={d}>
            <path d={connector} stroke="var(--color-border)" strokeWidth="1.5" fill="none" />
            <motion.circle
              r="4"
              fill="var(--color-coral)"
              style={{ offsetPath: `path('${connector}')` }}
              animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 0] }}
              transition={{ duration: cycle, repeat: Infinity, ease: "easeIn" }}
            />
            <motion.g
              animate={{ scale: [1, 1.07, 1] }}
              transition={{ duration: cycle, repeat: Infinity, ease: "easeInOut", delay: cycle * 0.42 }}
              style={{ transformOrigin: `${cx}px 134px` }}
            >
              <rect x={cx - 47} y={112} width="94" height="46" rx="11" fill="var(--color-bg)" stroke="var(--color-border)" />
              <text x={cx} y={132} textAnchor="middle" fontSize="12" className="fill-[var(--color-text)] font-mono">
                {d}
              </text>
              <text x={cx} y={148} textAnchor="middle" fontSize="8.5" className="fill-[var(--color-faint)] font-mono">
                backward()
              </text>
            </motion.g>
          </g>
        );
      })}

      <text x="215" y="186" textAnchor="middle" fontSize="9.5" className="fill-[var(--color-muted)] font-mono">
        one step · every device · in sync
      </text>
    </svg>
  );
}

/* scikit-learn: data flows into the .fit() box and a fitted line snaps out —
   the whole descent loop hidden behind one call. */
function SklearnViz() {
  const cycle = 3;
  const pts: [number, number][] = [
    [30, 150],
    [46, 134],
    [58, 142],
    [72, 120],
    [86, 126],
  ];
  return (
    <svg viewBox="0 0 430 200" className={svgClass} fill="none">
      <text x="58" y="40" textAnchor="middle" fontSize="9.5" className="fill-[var(--color-faint)] font-mono">
        X, y
      </text>

      {/* input scatter, flowing into the box */}
      {pts.map(([x, y], i) => (
        <motion.circle
          key={i}
          cy={y}
          r="4"
          fill="var(--color-muted)"
          animate={{ cx: [x, 188, 188], opacity: [1, 1, 0] }}
          transition={{ duration: cycle, times: [0, 0.32, 0.36], repeat: Infinity, delay: i * 0.04, ease: easeOutExpo }}
        />
      ))}

      {/* the .fit() box */}
      <motion.rect
        x="172"
        y="84"
        width="86"
        height="56"
        rx="13"
        fill="var(--color-surface-2)"
        stroke="var(--color-coral)"
        animate={{ strokeOpacity: [0.4, 1, 0.4] }}
        transition={{ duration: cycle, times: [0, 0.42, 0.72], repeat: Infinity }}
      />
      <text x="215" y="110" textAnchor="middle" fontSize="13" className="fill-[var(--color-text)] font-mono">
        .fit()
      </text>
      <text x="215" y="128" textAnchor="middle" fontSize="8.5" className="fill-[var(--color-faint)] font-mono">
        SGDRegressor
      </text>

      {/* output: fitted line snaps in over the held-out points */}
      <g transform="translate(296, 0)">
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="var(--color-faint)" />
        ))}
        <motion.line
          x1="24"
          y1="156"
          x2="92"
          y2="116"
          stroke="var(--color-coral)"
          strokeWidth="2.5"
          strokeLinecap="round"
          animate={{ pathLength: [0, 0, 1, 1], opacity: [0, 0, 1, 1] }}
          transition={{ duration: cycle, times: [0, 0.46, 0.64, 1], repeat: Infinity, ease: easeOutExpo }}
        />
      </g>

      <text x="215" y="190" textAnchor="middle" fontSize="9.5" className="fill-[var(--color-muted)] font-mono">
        one call · gradient descent hidden inside
      </text>
    </svg>
  );
}

/* NumPy: no autograd — the gradient is assembled by hand from raw arrays. */
function NumpyViz() {
  const cycle = 3.4;
  // sequential reveal: Xᵀ, then err, then grad fills, looping.
  const reveal = (order: number) => ({
    animate: { opacity: [0, 0, 1, 1, 0], y: [6, 6, 0, 0, 0] },
    transition: {
      duration: cycle,
      times: [0, 0.1 + order * 0.14, 0.24 + order * 0.14, 0.9, 1],
      repeat: Infinity,
      ease: easeOutExpo,
    },
  });
  return (
    <svg viewBox="0 0 430 200" className={svgClass} fill="none">
      <text x="215" y="34" textAnchor="middle" fontSize="9.5" className="fill-[var(--color-faint)] font-mono">
        grad = 2 · Xᵀ @ (X w − y) / n
      </text>

      {/* grad result tensor — fills last (violet) */}
      <text x="56" y="84" textAnchor="middle" fontSize="10" className="fill-[var(--color-violet)] font-mono">
        grad
      </text>
      <Grid x={42} y={92} rows={3} cols={1} color="var(--color-violet)" {...{
        animate: { fillOpacity: [0, 0, 0, 0.3, 0], opacity: [0.35, 0.35, 0.35, 1, 0.35] },
        transition: { duration: cycle, times: [0, 0.6, 0.7, 0.85, 1], repeat: Infinity },
      }} filled />

      <text x="84" y="118" textAnchor="middle" fontSize="16" className="fill-[var(--color-muted)] font-mono">=</text>

      <text x="112" y="118" textAnchor="middle" fontSize="11" className="fill-[var(--color-muted)] font-mono">2/n</text>

      {/* Xᵀ */}
      <motion.g {...reveal(0)}>
        <text x="160" y="84" textAnchor="middle" fontSize="10" className="fill-[var(--color-faint)] font-mono">Xᵀ</text>
        <Grid x={136} y={92} rows={3} cols={3} color="var(--color-border)" />
      </motion.g>

      <text x="206" y="118" textAnchor="middle" fontSize="15" className="fill-[var(--color-muted)] font-mono">·</text>

      {/* (X w − y) error */}
      <motion.g {...reveal(1)}>
        <text x="266" y="84" textAnchor="middle" fontSize="10" className="fill-[var(--color-coral)] font-mono">X w − y</text>
        <text x="226" y="120" textAnchor="middle" fontSize="22" className="fill-[var(--color-border)] font-mono">(</text>
        <Grid x={250} y={92} rows={3} cols={1} color="var(--color-coral)" />
        <text x="288" y="120" textAnchor="middle" fontSize="22" className="fill-[var(--color-border)] font-mono">)</text>
      </motion.g>

      <text x="215" y="188" textAnchor="middle" fontSize="9.5" className="fill-[var(--color-muted)] font-mono">
        you write the derivative yourself
      </text>
    </svg>
  );
}

function Grid({
  x,
  y,
  rows,
  cols,
  color,
  filled,
  animate,
  transition,
}: {
  x: number;
  y: number;
  rows: number;
  cols: number;
  color: string;
  filled?: boolean;
  animate?: TargetAndTransition;
  transition?: Transition;
}) {
  const cell = 15;
  const gap = 3;
  const step = cell + gap;
  return (
    <g transform={`translate(${x}, ${y})`}>
      {Array.from({ length: rows * cols }).map((_, k) => (
        <motion.rect
          key={k}
          x={(k % cols) * step}
          y={Math.floor(k / cols) * step}
          width={cell}
          height={cell}
          rx="3"
          fill={filled ? color : "var(--color-bg)"}
          stroke={color}
          strokeOpacity="0.7"
          {...(animate ? { animate, transition } : {})}
        />
      ))}
    </g>
  );
}
