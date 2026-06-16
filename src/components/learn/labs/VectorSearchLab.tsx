"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowsClockwise } from "@phosphor-icons/react";
import { LabButton, RangeControl, Stat } from "@/components/learn/controls";
import { makeRng, gaussian, scaleLinear, dist, clamp } from "@/lib/ml";

const W = 360;
const H = 320;
const PAD = 18;
const DOM: [number, number] = [0, 10];
const CORAL = "oklch(0.72 0.17 35)";
const VIOLET = "oklch(0.64 0.19 288)";

function makeVecs(seed: number) {
  const rng = makeRng(seed);
  return Array.from({ length: 60 }, () => ({
    x: clamp(gaussian(rng, 5, 2.4), 0.3, 9.7),
    y: clamp(gaussian(rng, 5, 2.4), 0.3, 9.7),
  }));
}

export function VectorSearchLab() {
  const [seed, setSeed] = useState(7);
  const vecs = useMemo(() => makeVecs(seed), [seed]);
  const [k, setK] = useState(5);
  const [q, setQ] = useState({ x: 5, y: 5 });
  const svgRef = useRef<SVGSVGElement>(null);

  const sx = scaleLinear(DOM, [PAD, W - PAD]);
  const sy = scaleLinear(DOM, [H - PAD, PAD]);

  const results = useMemo(
    () =>
      vecs
        .map((d, i) => ({ i, d, r: dist(d.x, d.y, q.x, q.y) }))
        .sort((a, b) => a.r - b.r)
        .slice(0, k),
    [vecs, q, k],
  );
  const radius = results.length ? results[results.length - 1].r : 0;
  const nearest = results[0]?.r ?? 0;
  const resultSet = new Set(results.map((r) => r.i));

  function place(e: React.PointerEvent<SVGSVGElement>) {
    const rect = svgRef.current!.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const py = ((e.clientY - rect.top) / rect.height) * H;
    setQ({ x: clamp(sx.invert(px), 0, 10), y: clamp(sy.invert(py), 0, 10) });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_240px]">
      <div className="rounded-xl border border-border-soft bg-bg/50 p-4">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full cursor-crosshair touch-none"
          fill="none"
          onPointerDown={place}
        >
          <circle
            cx={sx(q.x)}
            cy={sy(q.y)}
            r={Math.abs(sx(radius) - sx(0))}
            fill={CORAL}
            fillOpacity="0.06"
            stroke={CORAL}
            strokeOpacity="0.4"
            strokeDasharray="4 5"
          />
          {results.map((r) => (
            <line
              key={`e${r.i}`}
              x1={sx(q.x)}
              y1={sy(q.y)}
              x2={sx(r.d.x)}
              y2={sy(r.d.y)}
              stroke={CORAL}
              strokeWidth="1.25"
              strokeOpacity="0.5"
            />
          ))}
          {vecs.map((d, i) => (
            <circle
              key={i}
              cx={sx(d.x)}
              cy={sy(d.y)}
              r={resultSet.has(i) ? 5.5 : 3.5}
              fill={resultSet.has(i) ? CORAL : VIOLET}
              fillOpacity={resultSet.has(i) ? 1 : 0.45}
            />
          ))}
          <circle
            cx={sx(q.x)}
            cy={sy(q.y)}
            r="7"
            fill={CORAL}
            stroke="oklch(0.96 0.008 70)"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="indexed" value={String(vecs.length)} accent="violet" />
          <Stat label="returned" value={String(k)} accent="coral" />
        </div>
        <Stat label="nearest distance" value={nearest.toFixed(2)} accent="coral" />
        <RangeControl label="top-k results" value={k} min={1} max={12} onChange={setK} />
        <LabButton variant="ghost" onClick={() => setSeed((s) => s + 1)}>
          <ArrowsClockwise size={15} weight="bold" /> New index
        </LabButton>
        <p className="text-xs leading-relaxed text-faint">
          Drag the query point. A vector database returns the k nearest embeddings —
          an ANN index finds them fast without comparing against all {vecs.length}.
        </p>
      </div>
    </div>
  );
}
