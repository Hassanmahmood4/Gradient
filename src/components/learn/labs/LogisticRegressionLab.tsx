"use client";

import { useMemo, useState } from "react";
import { Sparkle, ArrowsClockwise } from "@phosphor-icons/react";
import { LabButton, RangeControl, Stat } from "@/components/learn/controls";
import { makeRng, sigmoid, scaleLinear, linspace, round } from "@/lib/ml";

const W = 480;
const H = 300;
const PAD = { l: 38, r: 16, t: 22, b: 28 };
const X_DOM: [number, number] = [0, 10];
const Y_DOM: [number, number] = [0, 1];

function makeData(seed: number) {
  const rng = makeRng(seed);
  return Array.from({ length: 30 }, () => {
    const x = rng() * 10;
    const p = sigmoid(1.3 * (x - 5));
    const cls = rng() < p ? 1 : 0;
    return { x, cls, jitter: (rng() - 0.5) * 0.12 };
  });
}

export function LogisticRegressionLab() {
  const [seed, setSeed] = useState(3);
  const data = useMemo(() => makeData(seed), [seed]);

  const [threshold, setThreshold] = useState(3.5);
  const [k, setK] = useState(1.2);

  const sx = scaleLinear(X_DOM, [PAD.l, W - PAD.r]);
  const sy = scaleLinear(Y_DOM, [H - PAD.b, PAD.t]);

  const curve = useMemo(() => {
    const pts = linspace(X_DOM[0], X_DOM[1], 80).map(
      (x) => `${sx(x)},${sy(sigmoid(k * (x - threshold)))}`,
    );
    return `M${pts.join(" L")}`;
  }, [sx, sy, k, threshold]);

  const accuracy = useMemo(() => {
    const correct = data.filter(
      (d) => (d.x > threshold ? 1 : 0) === d.cls,
    ).length;
    return correct / data.length;
  }, [data, threshold]);

  function fit() {
    // scan candidate thresholds for the one with best accuracy
    let best = threshold;
    let bestAcc = -1;
    for (const t of linspace(0, 10, 100)) {
      const acc = data.filter((d) => (d.x > t ? 1 : 0) === d.cls).length;
      if (acc > bestAcc) {
        bestAcc = acc;
        best = t;
      }
    }
    setThreshold(round(best, 2));
    setK(2.2);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_240px]">
      <div className="rounded-xl border border-border-soft bg-bg/50 p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" fill="none">
          {/* p = 0.5 line */}
          <line
            x1={PAD.l}
            x2={W - PAD.r}
            y1={sy(0.5)}
            y2={sy(0.5)}
            stroke="oklch(0.32 0.014 60)"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
          {/* decision boundary */}
          <line
            x1={sx(threshold)}
            x2={sx(threshold)}
            y1={PAD.t}
            y2={H - PAD.b}
            stroke="oklch(0.55 0.012 70)"
            strokeWidth="1.5"
            strokeDasharray="4 5"
          />
          <path d={curve} stroke="oklch(0.64 0.19 288)" strokeWidth="2.5" strokeLinecap="round" />
          {/* data points at their class level */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={sx(d.x)}
              cy={sy(d.cls === 1 ? 0.96 + d.jitter : 0.04 + d.jitter)}
              r="4.5"
              fill={d.cls === 1 ? "oklch(0.64 0.19 288)" : "oklch(0.72 0.17 35)"}
              opacity={(d.x > threshold ? 1 : 0) === d.cls ? 1 : 0.35}
            />
          ))}
        </svg>
      </div>

      <div className="flex flex-col gap-3">
        <Stat
          label="accuracy"
          value={`${round(accuracy * 100, 1)}%`}
          accent="violet"
        />
        <RangeControl
          label="threshold"
          value={threshold}
          min={0}
          max={10}
          step={0.1}
          onChange={setThreshold}
          format={(v) => v.toFixed(1)}
        />
        <RangeControl
          label="steepness (k)"
          value={k}
          min={0.2}
          max={4}
          step={0.1}
          onChange={setK}
          format={(v) => v.toFixed(1)}
        />
        <div className="flex flex-wrap gap-2">
          <LabButton onClick={fit}>
            <Sparkle size={15} weight="fill" /> Best fit
          </LabButton>
          <LabButton variant="ghost" onClick={() => setSeed((s) => s + 1)}>
            <ArrowsClockwise size={15} weight="bold" /> New data
          </LabButton>
        </div>
        <p className="text-xs leading-relaxed text-faint">
          The sigmoid turns the line into a probability. Points right of the
          boundary are predicted violet; faded points are misclassified.
        </p>
      </div>
    </div>
  );
}
