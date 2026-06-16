"use client";

import { useMemo, useState } from "react";
import { Stat } from "@/components/learn/controls";
import { scaleLinear } from "@/lib/ml";

const W = 360;
const H = 320;
const PAD = 26;
const DOM: [number, number] = [-1.15, 1.15];
const CORAL = "oklch(0.72 0.17 35)";
const VIOLET = "oklch(0.64 0.19 288)";
const AMBER = "oklch(0.80 0.13 85)";
const THEME = [CORAL, VIOLET, AMBER];

type Word = { w: string; v: [number, number]; theme: number };

// Direction encodes meaning: each theme points into its own angular sector.
const WORDS: Word[] = [
  { w: "dog", v: [-0.86, -0.44], theme: 0 },
  { w: "puppy", v: [-0.95, -0.28], theme: 0 },
  { w: "cat", v: [-0.70, -0.62], theme: 0 },
  { w: "kitten", v: [-0.80, -0.52], theme: 0 },
  { w: "king", v: [0.55, 0.82], theme: 1 },
  { w: "queen", v: [0.40, 0.92], theme: 1 },
  { w: "prince", v: [0.66, 0.70], theme: 1 },
  { w: "invoice", v: [0.82, -0.50], theme: 2 },
  { w: "budget", v: [0.92, -0.34], theme: 2 },
  { w: "tax", v: [0.70, -0.64], theme: 2 },
];

function cosine(a: [number, number], b: [number, number]) {
  const dot = a[0] * b[0] + a[1] * b[1];
  return dot / (Math.hypot(...a) * Math.hypot(...b));
}

export function EmbeddingsLab() {
  const [sel, setSel] = useState("puppy");
  const sx = scaleLinear(DOM, [PAD, W - PAD]);
  const sy = scaleLinear(DOM, [H - PAD, PAD]);
  const selWord = WORDS.find((w) => w.w === sel)!;

  const ranked = useMemo(
    () =>
      WORDS.filter((w) => w.w !== sel)
        .map((w) => ({ w, s: cosine(selWord.v, w.v) }))
        .sort((a, b) => b.s - a.s),
    [sel, selWord.v],
  );
  const top = ranked[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_240px]">
      <div className="rounded-xl border border-border-soft bg-bg/50 p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" fill="none">
          <line x1={sx(0)} y1={PAD} x2={sx(0)} y2={H - PAD} stroke="var(--color-border)" />
          <line x1={PAD} y1={sy(0)} x2={W - PAD} y2={sy(0)} stroke="var(--color-border)" />

          {/* similarity links from the selected word */}
          {ranked.map(({ w, s }) => (
            <line
              key={`l${w.w}`}
              x1={sx(selWord.v[0])}
              y1={sy(selWord.v[1])}
              x2={sx(w.v[0])}
              y2={sy(w.v[1])}
              stroke={CORAL}
              strokeWidth={1 + 2.5 * Math.max(0, s)}
              strokeOpacity={Math.max(0.04, s * 0.5)}
            />
          ))}

          {WORDS.map((w) => (
            <g key={w.w} onClick={() => setSel(w.w)} className="cursor-pointer">
              <line
                x1={sx(0)}
                y1={sy(0)}
                x2={sx(w.v[0])}
                y2={sy(w.v[1])}
                stroke={THEME[w.theme]}
                strokeOpacity={w.w === sel ? 0.5 : 0.14}
                strokeWidth="1.5"
              />
              <circle
                cx={sx(w.v[0])}
                cy={sy(w.v[1])}
                r={w.w === sel ? 7 : 5}
                fill={THEME[w.theme]}
                stroke={w.w === sel ? "oklch(0.96 0.008 70)" : "none"}
                strokeWidth="2"
              />
              <text
                x={sx(w.v[0])}
                y={sy(w.v[1]) - 10}
                textAnchor="middle"
                fontSize="10"
                className="fill-[var(--color-text)] font-mono"
                style={{ pointerEvents: "none" }}
              >
                {w.w}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="flex flex-col gap-3">
        <Stat label="query word" value={sel} accent="coral" />
        <Stat label={`closest · ${top.w.w}`} value={top.s.toFixed(2)} accent="coral" />
        <div className="rounded-xl border border-border-soft bg-bg/40 p-3">
          <div className="mb-2 font-mono text-[0.65rem] uppercase tracking-widest text-faint">
            cosine similarity
          </div>
          <div className="space-y-1.5">
            {ranked.map(({ w, s }) => (
              <div key={w.w} className="flex items-center gap-2">
                <span className="w-14 shrink-0 font-mono text-[0.7rem] text-muted">{w.w}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                  <span
                    className="block h-full rounded-full"
                    style={{ width: `${Math.max(0, s) * 100}%`, background: CORAL }}
                  />
                </span>
                <span className="w-8 text-right font-mono text-[0.7rem] tabular-nums text-faint">
                  {s.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs leading-relaxed text-faint">
          Click any word. Direction encodes meaning — words pointing the same way
          (same theme) score a high cosine similarity; opposite directions score low.
        </p>
      </div>
    </div>
  );
}
