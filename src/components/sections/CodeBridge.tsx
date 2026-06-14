"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  note: string;
}[] = [
  {
    key: "pytorch",
    icon: siPytorch,
    name: "PyTorch",
    focus: "autograd",
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
            four ways.
          </p>
        </Reveal>

        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-2">
          {/* left: the concept */}
          <Reveal x={-40} className="relative flex flex-col rounded-3xl border border-border-soft bg-surface/30 p-6 sm:p-8">
            <div className="glow-coral pointer-events-none absolute inset-0 m-auto h-40 w-40 opacity-10 blur-3xl" />
            <span className="font-mono text-xs uppercase tracking-widest text-faint">
              what you&rsquo;re seeing
            </span>
            <h3 className="font-display mt-2 text-lg font-semibold">
              Gradient descent on a loss curve
            </h3>
            <DescentViz variant={fw.key} />

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

/* looping gradient-descent ball on a bowl, with a framework-specific accent */
function DescentViz({ variant }: { variant: string }) {
  const bowl = "M30 36 C 150 36, 165 168, 215 168 C 265 168, 280 36, 400 36";
  const fast = variant === "sklearn";
  const ballTransition = {
    duration: fast ? 0.9 : 2.4,
    ease: easeOutExpo,
    repeat: Infinity,
    repeatDelay: fast ? 1.8 : 1,
  } as const;
  const showArrow = variant === "pytorch" || variant === "numpy";
  const arrowColor = variant === "numpy" ? "var(--color-violet)" : "var(--color-coral)";

  return (
    <div className="mt-5 rounded-2xl border border-border-soft bg-bg/50 p-4">
      <svg viewBox="0 0 430 218" className="h-auto w-full" fill="none">
        <defs>
          <linearGradient id="cb-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.64 0.19 288)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="oklch(0.64 0.19 288)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d={`${bowl} L 400 188 L 30 188 Z`} fill="url(#cb-fill)" />
        <path d={bowl} stroke="oklch(0.64 0.19 288)" strokeWidth="2" strokeLinecap="round" />

        {/* TensorFlow: a "tape" recording the trajectory */}
        {variant === "tensorflow" && (
          <motion.path
            d={bowl}
            stroke="var(--color-coral)"
            strokeOpacity={0.5}
            strokeWidth={2}
            strokeDasharray="3 6"
            animate={{ strokeDashoffset: [0, -18] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* minimum marker */}
        <line x1="215" y1="168" x2="215" y2="182" stroke="var(--color-success)" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="215" cy="168" r="3" fill="var(--color-success)" />

        {/* scikit-learn: it lands in one .fit() call — flash at the minimum */}
        {variant === "sklearn" && (
          <motion.circle
            cx="215"
            cy="168"
            r="8"
            fill="none"
            stroke="var(--color-coral)"
            strokeWidth={2}
            animate={{ r: [8, 20], opacity: [0.8, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
          />
        )}

        {/* the optimizer ball (+ optional gradient-step arrow that rides along) */}
        <motion.g
          initial={{ offsetDistance: "4%" }}
          animate={{ offsetDistance: ["4%", "50%"] }}
          transition={ballTransition}
          style={{ offsetPath: `path('${bowl}')`, offsetRotate: "0deg" }}
        >
          <circle r="8" fill="oklch(0.72 0.17 35)" />
          {showArrow && (
            <motion.g
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              stroke={arrowColor}
              strokeWidth={2}
              strokeLinecap="round"
            >
              <line x1="0" y1="0" x2="16" y2="13" />
              <path d="M16 13 L9 12 M16 13 L14 6" fill="none" />
            </motion.g>
          )}
        </motion.g>

        {/* Hugging Face: same step, mirrored across devices */}
        {variant === "huggingface" &&
          ["CPU", "GPU", "TPU"].map((d, i) => (
            <motion.g
              key={d}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.4, delay: i * 0.22, repeat: Infinity, ease: "easeInOut" }}
            >
              <rect
                x={120 + i * 70}
                y={198}
                width={50}
                height={16}
                rx={5}
                fill="none"
                stroke="var(--color-border)"
              />
              <text
                x={145 + i * 70}
                y={209}
                textAnchor="middle"
                fontSize="8"
                className="fill-[var(--color-muted)] font-mono"
              >
                {d}
              </text>
            </motion.g>
          ))}
      </svg>
    </div>
  );
}
