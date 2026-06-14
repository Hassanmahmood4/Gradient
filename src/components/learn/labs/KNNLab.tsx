"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowsClockwise } from "@phosphor-icons/react";
import { LabButton, RangeControl, Stat } from "@/components/learn/controls";
import { makeRng, gaussian, scaleLinear, dist, clamp } from "@/lib/ml";

const W = 360;
const H = 320;
const PAD = { l: 16, r: 16, t: 16, b: 16 };
const DOM: [number, number] = [0, 10];
const CORAL = "oklch(0.72 0.17 35)";
const VIOLET = "oklch(0.64 0.19 288)";

function makeData(seed: number) {
  const rng = makeRng(seed);
  const blob = (cx: number, cy: number, cls: 0 | 1) =>
    Array.from({ length: 13 }, () => ({
      x: clamp(gaussian(rng, cx, 1.1), 0.3, 9.7),
      y: clamp(gaussian(rng, cy, 1.1), 0.3, 9.7),
      cls,
    }));
  return [...blob(3.2, 6.8, 0), ...blob(6.8, 3.4, 1)];
}

export function KNNLab() {
  const [seed, setSeed] = useState(11);
  const data = useMemo(() => makeData(seed), [seed]);
  const [k, setK] = useState(5);
  const [query, setQuery] = useState({ x: 5, y: 5 });
  const svgRef = useRef<SVGSVGElement>(null);

  const sx = scaleLinear(DOM, [PAD.l, W - PAD.r]);
  const sy = scaleLinear(DOM, [H - PAD.b, PAD.t]);

  const neighbors = useMemo(() => {
    return data
      .map((d, i) => ({ i, d, r: dist(d.x, d.y, query.x, query.y) }))
      .sort((a, b) => a.r - b.r)
      .slice(0, k);
  }, [data, query, k]);

  const votes = neighbors.reduce(
    (acc, n) => {
      acc[n.d.cls]++;
      return acc;
    },
    [0, 0],
  );
  const predicted = votes[1] > votes[0] ? 1 : 0;
  const radius = neighbors.length ? neighbors[neighbors.length - 1].r : 0;

  function place(e: React.PointerEvent<SVGSVGElement>) {
    const rect = svgRef.current!.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const py = ((e.clientY - rect.top) / rect.height) * H;
    setQuery({
      x: clamp(sx.invert(px), 0, 10),
      y: clamp(sy.invert(py), 0, 10),
    });
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
          {/* neighbourhood radius */}
          <circle
            cx={sx(query.x)}
            cy={sy(query.y)}
            r={Math.abs(sx(radius) - sx(0))}
            fill={predicted === 1 ? VIOLET : CORAL}
            fillOpacity="0.06"
            stroke={predicted === 1 ? VIOLET : CORAL}
            strokeOpacity="0.4"
            strokeDasharray="4 5"
          />
          {/* edges to neighbours */}
          {neighbors.map((n) => (
            <line
              key={`e${n.i}`}
              x1={sx(query.x)}
              y1={sy(query.y)}
              x2={sx(n.d.x)}
              y2={sy(n.d.y)}
              stroke={n.d.cls === 1 ? VIOLET : CORAL}
              strokeWidth="1.25"
              strokeOpacity="0.5"
            />
          ))}
          {/* data points */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={sx(d.x)}
              cy={sy(d.y)}
              r="5"
              fill={d.cls === 1 ? VIOLET : CORAL}
            />
          ))}
          {/* query point */}
          <circle
            cx={sx(query.x)}
            cy={sy(query.y)}
            r="7"
            fill={predicted === 1 ? VIOLET : CORAL}
            stroke="oklch(0.96 0.008 70)"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="flex flex-col gap-3">
        <Stat
          label="predicted class"
          value={predicted === 1 ? "Violet" : "Coral"}
          accent={predicted === 1 ? "violet" : "coral"}
        />
        <div className="grid grid-cols-2 gap-3">
          <Stat label="coral votes" value={String(votes[0])} accent="coral" />
          <Stat label="violet votes" value={String(votes[1])} accent="violet" />
        </div>
        <RangeControl
          label="k (neighbours)"
          value={k}
          min={1}
          max={11}
          step={2}
          onChange={setK}
        />
        <LabButton variant="ghost" onClick={() => setSeed((s) => s + 1)}>
          <ArrowsClockwise size={15} weight="bold" /> New data
        </LabButton>
        <p className="text-xs leading-relaxed text-faint">
          Click anywhere to move the query point. It’s labelled by a majority
          vote of its k closest neighbours — change k and watch the vote flip.
        </p>
      </div>
    </div>
  );
}
