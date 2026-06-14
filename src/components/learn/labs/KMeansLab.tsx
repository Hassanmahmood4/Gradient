"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, ArrowCounterClockwise, SkipForward } from "@phosphor-icons/react";
import { LabButton, RangeControl, Stat } from "@/components/learn/controls";
import { makeRng, gaussian, scaleLinear, dist2, clamp, round } from "@/lib/ml";

const W = 360;
const H = 320;
const PAD = { l: 16, r: 16, t: 16, b: 16 };
const DOM: [number, number] = [0, 10];
const PALETTE = [
  "oklch(0.72 0.17 35)", // coral
  "oklch(0.64 0.19 288)", // violet
  "oklch(0.74 0.15 150)", // green
  "oklch(0.8 0.15 75)", // amber
  "oklch(0.7 0.13 230)", // blue
];

type Pt = { x: number; y: number };

function makePoints(seed: number): Pt[] {
  const rng = makeRng(seed);
  const centers = [
    [3, 7],
    [7, 7],
    [5, 3],
    [2.5, 3],
  ];
  const pts: Pt[] = [];
  for (const [cx, cy] of centers) {
    for (let i = 0; i < 16; i++) {
      pts.push({
        x: clamp(gaussian(rng, cx, 0.9), 0.3, 9.7),
        y: clamp(gaussian(rng, cy, 0.9), 0.3, 9.7),
      });
    }
  }
  return pts;
}

export function KMeansLab() {
  const [seed, setSeed] = useState(5);
  const [k, setK] = useState(3);
  const points = useMemo(() => makePoints(seed), [seed]);

  const [nonce, setNonce] = useState(0);
  const [centroids, setCentroids] = useState<Pt[]>([]);
  const [iter, setIter] = useState(0);
  const [running, setRunning] = useState(false);
  const [builtKey, setBuiltKey] = useState("");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const sx = scaleLinear(DOM, [PAD.l, W - PAD.r]);
  const sy = scaleLinear(DOM, [H - PAD.b, PAD.t]);

  const freshCentroids = (): Pt[] => {
    const rng = makeRng(seed * 31 + k * 7 + nonce * 101);
    return Array.from({ length: k }, () => ({ x: 1 + rng() * 8, y: 1 + rng() * 8 }));
  };

  // (re)initialise centroids whenever seed, k, or the reset nonce changes —
  // adjusting state during render is the recommended alternative to an effect.
  const key = `${seed}|${k}|${nonce}`;
  if (builtKey !== key) {
    setCentroids(freshCentroids());
    setIter(0);
    setBuiltKey(key);
  }

  const assignments = useMemo(() => {
    if (!centroids.length) return points.map(() => 0);
    return points.map((p) => {
      let best = 0;
      let bestD = Infinity;
      centroids.forEach((c, ci) => {
        const d = dist2(p.x, p.y, c.x, c.y);
        if (d < bestD) {
          bestD = d;
          best = ci;
        }
      });
      return best;
    });
  }, [points, centroids]);

  const inertia = useMemo(() => {
    if (!centroids.length) return 0;
    return points.reduce(
      (s, p, i) => s + dist2(p.x, p.y, centroids[assignments[i]].x, centroids[assignments[i]].y),
      0,
    );
  }, [points, centroids, assignments]);

  const step = () => {
    setCentroids((prev) => {
      if (!prev.length) return prev;
      const sums = prev.map(() => ({ x: 0, y: 0, n: 0 }));
      points.forEach((p) => {
        let best = 0;
        let bestD = Infinity;
        prev.forEach((c, ci) => {
          const d = dist2(p.x, p.y, c.x, c.y);
          if (d < bestD) {
            bestD = d;
            best = ci;
          }
        });
        sums[best].x += p.x;
        sums[best].y += p.y;
        sums[best].n += 1;
      });
      return prev.map((c, ci) =>
        sums[ci].n ? { x: sums[ci].x / sums[ci].n, y: sums[ci].y / sums[ci].n } : c,
      );
    });
    setIter((n) => n + 1);
  };

  function stop() {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setRunning(false);
  }

  function run() {
    if (running) return stop();
    setRunning(true);
    let last = -1;
    timer.current = setInterval(() => {
      setIter((n) => {
        if (n === last) {
          stop();
          return n;
        }
        last = n;
        step();
        return n;
      });
    }, 500);
  }

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_240px]">
      <div className="rounded-xl border border-border-soft bg-bg/50 p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" fill="none">
          {points.map((p, i) => {
            const c = PALETTE[assignments[i] % PALETTE.length];
            return <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r="4.5" fill={c} fillOpacity="0.85" />;
          })}
          {centroids.map((c, i) => (
            <g key={i}>
              <circle
                cx={sx(c.x)}
                cy={sy(c.y)}
                r="9"
                fill={PALETTE[i % PALETTE.length]}
                stroke="oklch(0.96 0.008 70)"
                strokeWidth="2.5"
              />
              <circle cx={sx(c.x)} cy={sy(c.y)} r="2" fill="oklch(0.17 0.012 60)" />
            </g>
          ))}
        </svg>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="iteration" value={String(iter)} />
          <Stat label="inertia" value={round(inertia, 1).toString()} accent="violet" />
        </div>
        <RangeControl
          label="clusters (k)"
          value={k}
          min={2}
          max={5}
          step={1}
          onChange={(v) => {
            stop();
            setK(v);
          }}
        />
        <div className="flex flex-wrap gap-2">
          <LabButton onClick={run}>
            {running ? <Pause size={15} weight="fill" /> : <Play size={15} weight="fill" />}
            {running ? "Pause" : "Run"}
          </LabButton>
          <LabButton variant="ghost" onClick={step} disabled={running}>
            <SkipForward size={15} weight="fill" /> Step
          </LabButton>
          <LabButton variant="ghost" onClick={() => { stop(); setNonce((n) => n + 1); }}>
            <ArrowCounterClockwise size={15} weight="bold" /> Reset
          </LabButton>
        </div>
        <LabButton variant="ghost" onClick={() => { stop(); setSeed((s) => s + 1); }}>
          New data
        </LabButton>
        <p className="text-xs leading-relaxed text-faint">
          Each iteration assigns points to the nearest centroid, then moves every
          centroid to the mean of its cluster. Inertia drops until it converges.
        </p>
      </div>
    </div>
  );
}
