"use client";

import { useMemo, useState } from "react";
import { ArrowsClockwise } from "@phosphor-icons/react";
import { LabButton, RangeControl, Stat } from "@/components/learn/controls";
import { makeRng, scaleLinear, clamp, round } from "@/lib/ml";

const SIZE = 320;
const DOM: [number, number] = [-1.2, 1.2];
const GRID = 24;
const CORAL = "oklch(0.72 0.17 35)";
const VIOLET = "oklch(0.64 0.19 288)";

type Pt = { x: number; y: number; label: 0 | 1 };
type Node =
  | { leaf: true; p: number }
  | { leaf: false; axis: 0 | 1; thr: number; L: Node; R: Node };

function makeData(seed: number): Pt[] {
  const rng = makeRng(seed);
  return Array.from({ length: 130 }, () => {
    const x = (rng() - 0.5) * 2.2;
    const y = (rng() - 0.5) * 2.2;
    const r = Math.hypot(x, y);
    // circular boundary + label noise → axis-aligned trees must staircase it
    const label: 0 | 1 = r + (rng() - 0.5) * 0.18 < 0.62 ? 1 : 0;
    return { x, y, label };
  });
}

const giniOf = (n0: number, n1: number) => {
  const n = n0 + n1;
  if (!n) return 0;
  const p0 = n0 / n;
  const p1 = n1 / n;
  return 1 - p0 * p0 - p1 * p1;
};

function build(pts: Pt[], depth: number, rng: () => number): Node {
  const n1 = pts.filter((p) => p.label === 1).length;
  const p = pts.length ? n1 / pts.length : 0.5;
  if (depth === 0 || pts.length < 4 || n1 === 0 || n1 === pts.length) {
    return { leaf: true, p };
  }
  let best: { axis: 0 | 1; thr: number; gain: number } | null = null;
  const parent = giniOf(pts.length - n1, n1);
  const axes: (0 | 1)[] = rng() < 0.5 ? [0, 1] : [1, 0];
  for (const axis of axes) {
    const vals = [...new Set(pts.map((q) => (axis === 0 ? q.x : q.y)))].sort(
      (a, b) => a - b,
    );
    for (let i = 0; i < vals.length - 1; i++) {
      const thr = (vals[i] + vals[i + 1]) / 2;
      let l0 = 0, l1 = 0, r0 = 0, r1 = 0;
      for (const q of pts) {
        const v = axis === 0 ? q.x : q.y;
        if (v <= thr) {
          if (q.label === 1) l1++;
          else l0++;
        } else if (q.label === 1) r1++;
        else r0++;
      }
      const nl = l0 + l1;
      const nr = r0 + r1;
      const weighted =
        (nl / pts.length) * giniOf(l0, l1) + (nr / pts.length) * giniOf(r0, r1);
      const gain = parent - weighted;
      if (!best || gain > best.gain) best = { axis, thr, gain };
    }
  }
  if (!best || best.gain <= 1e-6) return { leaf: true, p };
  const L = pts.filter((q) => (best!.axis === 0 ? q.x : q.y) <= best!.thr);
  const R = pts.filter((q) => (best!.axis === 0 ? q.x : q.y) > best!.thr);
  return {
    leaf: false,
    axis: best.axis,
    thr: best.thr,
    L: build(L, depth - 1, rng),
    R: build(R, depth - 1, rng),
  };
}

function predict(node: Node, x: number, y: number): number {
  if (node.leaf) return node.p;
  const v = node.axis === 0 ? x : y;
  return predict(v <= node.thr ? node.L : node.R, x, y);
}

export function DecisionTreeLab({ defaultTrees = 1 }: { defaultTrees?: number }) {
  const [seed, setSeed] = useState(9);
  const [maxDepth, setMaxDepth] = useState(4);
  const [trees, setTrees] = useState(defaultTrees);
  const data = useMemo(() => makeData(seed), [seed]);

  const forest = useMemo(() => {
    const rng = makeRng(seed * 101 + maxDepth * 7 + trees);
    return Array.from({ length: trees }, () => {
      // bootstrap sample for each tree (bagging)
      const sample =
        trees === 1
          ? data
          : Array.from({ length: data.length }, () => data[Math.floor(rng() * data.length)]);
      return build(sample, maxDepth, rng);
    });
  }, [data, maxDepth, trees, seed]);

  const vote = (x: number, y: number) =>
    forest.reduce((s, t) => s + predict(t, x, y), 0) / forest.length;

  const accuracy = useMemo(() => {
    const correct = data.filter((p) => (vote(p.x, p.y) > 0.5 ? 1 : 0) === p.label).length;
    return correct / data.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forest, data]);

  const sx = scaleLinear(DOM, [0, SIZE]);
  const sy = scaleLinear(DOM, [SIZE, 0]);
  const cell = SIZE / GRID;

  const cells = [];
  for (let gx = 0; gx < GRID; gx++) {
    for (let gy = 0; gy < GRID; gy++) {
      const dx = sx.invert((gx + 0.5) * cell);
      const dy = sy.invert((gy + 0.5) * cell);
      const v = vote(dx, dy);
      cells.push(
        <rect
          key={`${gx}-${gy}`}
          x={gx * cell}
          y={gy * cell}
          width={cell + 0.5}
          height={cell + 0.5}
          fill={v > 0.5 ? VIOLET : CORAL}
          fillOpacity={0.08 + Math.abs(v - 0.5) * 0.5}
        />,
      );
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_240px]">
      <div className="overflow-hidden rounded-xl border border-border-soft bg-bg/50 p-4">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-auto w-full" fill="none">
          {cells}
          {data.map((p, i) => (
            <circle
              key={i}
              cx={sx(p.x)}
              cy={sy(p.y)}
              r="4"
              fill={p.label === 1 ? VIOLET : CORAL}
              stroke="oklch(0.17 0.012 60)"
              strokeWidth="1.25"
            />
          ))}
        </svg>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="trees" value={String(trees)} accent="coral" />
          <Stat label="accuracy" value={`${round(accuracy * 100, 0)}%`} accent="violet" />
        </div>
        <RangeControl label="max depth" value={maxDepth} min={1} max={8} step={1} onChange={setMaxDepth} />
        <RangeControl
          label="trees in forest"
          value={trees}
          min={1}
          max={25}
          step={1}
          onChange={(v) => setTrees(clamp(v, 1, 25))}
        />
        <LabButton variant="ghost" onClick={() => setSeed((s) => s + 1)}>
          <ArrowsClockwise size={15} weight="bold" /> New data
        </LabButton>
        <p className="text-xs leading-relaxed text-faint">
          One deep tree carves sharp, blocky regions and overfits the noise. Add
          trees (each on a bootstrap sample) and their votes average into a
          smoother, sturdier boundary.
        </p>
      </div>
    </div>
  );
}
