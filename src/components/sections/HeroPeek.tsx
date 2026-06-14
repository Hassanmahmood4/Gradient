"use client";

import { motion } from "framer-motion";
import { Play, CaretDown } from "@phosphor-icons/react";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const lessons = [
  { label: "Linear regression", done: true },
  { label: "Gradient descent", done: true },
  { label: "Neural networks", done: true },
  { label: "Random forest", active: true },
];

/** A peek at the real app: the top of the workspace rising into view. */
export function HeroPeek() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: easeOutExpo, delay: 0.5 }}
      className="relative z-10 mx-auto mt-16 max-w-4xl [mask-image:linear-gradient(to_bottom,black_72%,transparent)]"
    >
      <div className="overflow-hidden rounded-t-2xl border border-b-0 border-border bg-surface shadow-[0_-1px_0_0_oklch(0.4_0.02_70/_0.4)_inset,0_30px_80px_-30px_oklch(0.1_0.02_60)]">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-border-soft bg-surface-2 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-danger/60" />
          <span className="h-3 w-3 rounded-full bg-warning/60" />
          <span className="h-3 w-3 rounded-full bg-success/60" />
          <div className="mx-auto flex items-center gap-2 rounded-md bg-bg/60 px-3 py-1 font-mono text-xs text-faint">
            app.gradient.dev/random-forest
          </div>
        </div>

        {/* app body */}
        <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr]">
          {/* sidebar */}
          <aside className="hidden flex-col gap-1 border-r border-border-soft bg-bg/40 p-4 sm:flex">
            <p className="px-2 pb-2 font-mono text-[0.62rem] uppercase tracking-widest text-faint">
              Foundations
            </p>
            {lessons.map((l) => (
              <div
                key={l.label}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  l.active ? "bg-surface-2 text-text" : "text-muted"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    l.active ? "bg-coral" : l.done ? "bg-success" : "bg-border"
                  }`}
                />
                {l.label}
              </div>
            ))}
          </aside>

          {/* main panel */}
          <div className="p-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-semibold">Random Forest</h3>
                <p className="mt-1 text-sm text-muted">
                  Many decision trees vote — the majority wins.
                </p>
              </div>
              <span className="flex items-center gap-2 rounded-full bg-coral px-4 py-2 text-sm font-semibold text-bg">
                <Play size={14} weight="fill" /> Train
              </span>
            </div>

            <PeekForest />

            <div className="mt-5 grid grid-cols-2 gap-4">
              <Slider label="trees" value="3" pct={42} />
              <Slider label="max depth" value="4" pct={58} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const CORAL = "oklch(0.72 0.17 35)";
const VIOLET = "oklch(0.64 0.19 288)";

type Leaf = "a" | "b";

/** One decision tree: a root that splits twice down to four leaves. */
function buildTree(cx: number, leaves: [Leaf, Leaf, Leaf, Leaf]) {
  const root = { x: cx, y: 22 };
  const c1 = { x: cx - 34, y: 78 };
  const c2 = { x: cx + 34, y: 78 };
  const leafNodes = [
    { x: cx - 50, y: 142, cls: leaves[0] },
    { x: cx - 20, y: 142, cls: leaves[1] },
    { x: cx + 20, y: 142, cls: leaves[2] },
    { x: cx + 50, y: 142, cls: leaves[3] },
  ];
  const edges = [
    [root, c1],
    [root, c2],
    [c1, leafNodes[0]],
    [c1, leafNodes[1]],
    [c2, leafNodes[2]],
    [c2, leafNodes[3]],
  ] as const;
  return { root, splits: [c1, c2], leafNodes, edges };
}

function PeekForest() {
  // three trees, each casts a majority-coral vote → the forest predicts coral
  const trees = [
    buildTree(75, ["a", "b", "a", "a"]),
    buildTree(215, ["a", "a", "b", "a"]),
    buildTree(355, ["b", "a", "a", "a"]),
  ];

  return (
    <div className="mt-5 rounded-xl border border-border-soft bg-bg/50 p-4">
      <svg viewBox="0 0 430 175" className="h-auto w-full" fill="none">
        {trees.map((tree, t) => {
          const base = 0.6 + t * 0.25;
          return (
            <g key={t}>
              {/* branches */}
              {tree.edges.map(([from, to], i) => (
                <motion.line
                  key={`e${t}-${i}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={VIOLET}
                  strokeWidth="1.5"
                  strokeOpacity="0.35"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: base + i * 0.06 }}
                />
              ))}

              {/* root + split nodes */}
              {[tree.root, ...tree.splits].map((n, i) => (
                <motion.circle
                  key={`n${t}-${i}`}
                  cx={n.x}
                  cy={n.y}
                  r="7"
                  fill="oklch(0.28 0.03 288)"
                  stroke={VIOLET}
                  strokeWidth="1.5"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: base + i * 0.08, type: "spring", stiffness: 320, damping: 18 }}
                  style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                />
              ))}

              {/* leaf predictions */}
              {tree.leafNodes.map((leaf, i) => (
                <motion.rect
                  key={`l${t}-${i}`}
                  x={leaf.x - 6}
                  y={leaf.y - 6}
                  width="12"
                  height="12"
                  rx="3"
                  fill={leaf.cls === "a" ? CORAL : VIOLET}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: base + 0.35 + i * 0.05, type: "spring", stiffness: 320, damping: 18 }}
                  style={{ transformOrigin: `${leaf.x}px ${leaf.y}px` }}
                />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Slider({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div className="rounded-xl border border-border-soft bg-surface/50 p-3">
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="text-muted">{label}</span>
        <span className="flex items-center gap-1 text-text">
          {value} <CaretDown size={10} className="text-faint" />
        </span>
      </div>
      <div className="mt-2.5 h-1.5 rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-coral" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
