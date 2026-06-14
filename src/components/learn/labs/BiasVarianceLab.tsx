"use client";

import { useMemo, useState } from "react";
import { ArrowsClockwise } from "@phosphor-icons/react";
import { LabButton, RangeControl, Stat } from "@/components/learn/controls";
import { makeRng, gaussian, scaleLinear, linspace, solveLinear, round } from "@/lib/ml";

const W = 480;
const H = 300;
const PAD = { l: 38, r: 16, t: 16, b: 28 };
const X_DOM: [number, number] = [0, 1];
const Y_DOM: [number, number] = [-1.6, 1.6];

// the underlying truth the model is trying to recover
const truth = (x: number) => Math.sin(2 * Math.PI * x);
// map x∈[0,1] → u∈[-1,1] so high powers stay numerically stable
const toU = (x: number) => 2 * x - 1;

type Pt = { x: number; y: number };

function makeSet(rng: () => number, n: number, noise: number): Pt[] {
  return Array.from({ length: n }, () => {
    const x = rng();
    return { x, y: truth(x) + gaussian(rng, 0, noise) };
  });
}

/** Fit polynomial of given degree by least squares (normal equations + ridge). */
function fitPoly(pts: Pt[], degree: number): number[] {
  const d = degree + 1;
  const A = Array.from({ length: d }, () => new Array(d).fill(0));
  const b = new Array(d).fill(0);
  for (const p of pts) {
    const u = toU(p.x);
    const powers = Array.from({ length: d }, (_, k) => u ** k);
    for (let i = 0; i < d; i++) {
      b[i] += powers[i] * p.y;
      for (let j = 0; j < d; j++) A[i][j] += powers[i] * powers[j];
    }
  }
  for (let i = 0; i < d; i++) A[i][i] += 1e-6; // tiny ridge for stability
  return solveLinear(A, b);
}

const evalPoly = (w: number[], x: number) =>
  w.reduce((s, c, k) => s + c * toU(x) ** k, 0);

const mse = (w: number[], pts: Pt[]) =>
  pts.reduce((s, p) => s + (evalPoly(w, p.x) - p.y) ** 2, 0) / pts.length;

export function BiasVarianceLab() {
  const [seed, setSeed] = useState(4);
  const [degree, setDegree] = useState(3);

  const { train, test } = useMemo(() => {
    const rng = makeRng(seed);
    return {
      train: makeSet(rng, 12, 0.22),
      test: makeSet(rng, 60, 0.22),
    };
  }, [seed]);

  const w = useMemo(() => fitPoly(train, degree), [train, degree]);
  const trainErr = useMemo(() => mse(w, train), [w, train]);
  const testErr = useMemo(() => mse(w, test), [w, test]);

  const sx = scaleLinear(X_DOM, [PAD.l, W - PAD.r]);
  const sy = scaleLinear(Y_DOM, [H - PAD.b, PAD.t]);

  const fitPath = useMemo(() => {
    const pts = linspace(0, 1, 100).map((x) => {
      const y = Math.max(Y_DOM[0], Math.min(Y_DOM[1], evalPoly(w, x)));
      return `${sx(x)},${sy(y)}`;
    });
    return `M${pts.join(" L")}`;
  }, [w, sx, sy]);

  const truthPath = useMemo(() => {
    const pts = linspace(0, 1, 100).map((x) => `${sx(x)},${sy(truth(x))}`);
    return `M${pts.join(" L")}`;
  }, [sx, sy]);

  const regime =
    degree <= 1 ? "underfitting" : testErr > trainErr * 2.2 ? "overfitting" : "good fit";

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_240px]">
      <div className="rounded-xl border border-border-soft bg-bg/50 p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" fill="none">
          <line x1={PAD.l} x2={W - PAD.r} y1={sy(0)} y2={sy(0)} stroke="oklch(0.32 0.014 60)" strokeWidth="1" strokeOpacity="0.5" />
          {/* true function */}
          <path d={truthPath} stroke="oklch(0.55 0.012 70)" strokeWidth="1.5" strokeDasharray="4 5" />
          {/* fitted polynomial */}
          <path d={fitPath} stroke="oklch(0.64 0.19 288)" strokeWidth="2.5" strokeLinecap="round" />
          {/* test points (faint) */}
          {test.map((p, i) => (
            <circle key={`te${i}`} cx={sx(p.x)} cy={sy(Math.max(Y_DOM[0], Math.min(Y_DOM[1], p.y)))} r="2.5" fill="oklch(0.55 0.012 70)" fillOpacity="0.4" />
          ))}
          {/* training points */}
          {train.map((p, i) => (
            <circle key={`tr${i}`} cx={sx(p.x)} cy={sy(Math.max(Y_DOM[0], Math.min(Y_DOM[1], p.y)))} r="4.5" fill="oklch(0.72 0.17 35)" />
          ))}
        </svg>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="train MSE" value={round(trainErr, 3).toString()} accent="coral" />
          <Stat label="test MSE" value={round(testErr, 3).toString()} accent="violet" />
        </div>
        <Stat label="regime" value={regime} />
        <RangeControl
          label="model complexity (degree)"
          value={degree}
          min={1}
          max={12}
          step={1}
          onChange={setDegree}
        />
        <LabButton variant="ghost" onClick={() => setSeed((s) => s + 1)}>
          <ArrowsClockwise size={15} weight="bold" /> New data
        </LabButton>
        <p className="text-xs leading-relaxed text-faint">
          Coral = training points, faint = unseen test points, dashed = the true
          function. Low degree underfits (both errors high); high degree fits the
          noise — train error keeps dropping while test error climbs.
        </p>
      </div>
    </div>
  );
}
