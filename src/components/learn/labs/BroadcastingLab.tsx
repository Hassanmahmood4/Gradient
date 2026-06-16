"use client";

import { useState } from "react";
import { RangeControl, Stat } from "@/components/learn/controls";

const CELL = 22;
const CORAL = "oklch(0.72 0.17 35)";
const VIOLET = "oklch(0.64 0.19 288)";
const GREEN = "oklch(0.72 0.15 150)";

function Grid({ rows, cols, color }: { rows: number; cols: number; color: string }) {
  return (
    <div
      className="inline-grid gap-1"
      style={{ gridTemplateColumns: `repeat(${cols}, ${CELL}px)` }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <span
          key={i}
          className="rounded-[3px]"
          style={{ width: CELL, height: CELL, background: color, opacity: 0.85 }}
        />
      ))}
    </div>
  );
}

const compat = (a: number, b: number) => a === b || a === 1 || b === 1;

export function BroadcastingLab() {
  const [ar, setAr] = useState(3);
  const [ac, setAc] = useState(1);
  const [br, setBr] = useState(1);
  const [bc, setBc] = useState(4);

  const ok = compat(ar, br) && compat(ac, bc);
  const rr = Math.max(ar, br);
  const rc = Math.max(ac, bc);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_240px]">
      <div className="rounded-xl border border-border-soft bg-bg/50 p-4">
        <div className="flex flex-wrap items-center justify-center gap-5">
          <figure className="text-center">
            <Grid rows={ar} cols={ac} color={CORAL} />
            <figcaption className="mt-2 font-mono text-xs text-muted">
              A ({ar}, {ac})
            </figcaption>
          </figure>
          <span className="font-mono text-lg text-faint">+</span>
          <figure className="text-center">
            <Grid rows={br} cols={bc} color={VIOLET} />
            <figcaption className="mt-2 font-mono text-xs text-muted">
              B ({br}, {bc})
            </figcaption>
          </figure>
          <span className="font-mono text-lg text-faint">=</span>
          {ok ? (
            <figure className="text-center">
              <Grid rows={rr} cols={rc} color={GREEN} />
              <figcaption className="mt-2 font-mono text-xs text-text">
                ({rr}, {rc})
              </figcaption>
            </figure>
          ) : (
            <div className="max-w-[150px] rounded-lg border border-danger/40 bg-danger/5 p-3 text-center text-xs text-danger">
              These shapes don’t broadcast
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Stat
          label="result shape"
          value={ok ? `(${rr}, ${rc})` : "error"}
          accent={ok ? "coral" : undefined}
        />
        <div className="grid grid-cols-2 gap-3">
          <RangeControl label="A rows" value={ar} min={1} max={4} onChange={setAr} />
          <RangeControl label="A cols" value={ac} min={1} max={4} onChange={setAc} />
          <RangeControl label="B rows" value={br} min={1} max={4} onChange={setBr} />
          <RangeControl label="B cols" value={bc} min={1} max={4} onChange={setBc} />
        </div>
        <p className="text-xs leading-relaxed text-faint">
          Two dimensions are compatible when they’re equal or one of them is 1 — the
          size-1 dim is stretched to match. Otherwise NumPy raises an error.
        </p>
      </div>
    </div>
  );
}
