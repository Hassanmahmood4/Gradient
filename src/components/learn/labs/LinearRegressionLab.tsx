"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkle, ArrowsClockwise } from "@phosphor-icons/react";
import { LabButton, RangeControl, Stat } from "@/components/learn/controls";
import { makeRng, gaussian, mean, scaleLinear, round } from "@/lib/ml";

const W = 480;
const H = 300;
const PAD = { l: 38, r: 16, t: 16, b: 28 };
const X_DOM: [number, number] = [0, 10];
const Y_DOM: [number, number] = [0, 12];

const TRUE_W = 0.72;
const TRUE_B = 1.6;

function makeData(seed: number) {
  const rng = makeRng(seed);
  return Array.from({ length: 16 }, () => {
    const x = rng() * 10;
    const y = TRUE_W * x + TRUE_B + gaussian(rng, 0, 1.1);
    return { x, y };
  });
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

export function LinearRegressionLab() {
  const [seed, setSeed] = useState(7);
  const data = useMemo(() => makeData(seed), [seed]);

  const [w, setW] = useState(0.2);
  const [b, setB] = useState(0.5);
  const raf = useRef<number | undefined>(undefined);

  const sx = scaleLinear(X_DOM, [PAD.l, W - PAD.r]);
  const sy = scaleLinear(Y_DOM, [H - PAD.b, PAD.t]);

  // ordinary least squares (closed form)
  const ols = useMemo(() => {
    const mx = mean(data.map((d) => d.x));
    const my = mean(data.map((d) => d.y));
    let num = 0;
    let den = 0;
    for (const d of data) {
      num += (d.x - mx) * (d.y - my);
      den += (d.x - mx) ** 2;
    }
    const wHat = den === 0 ? 0 : num / den;
    return { w: wHat, b: my - wHat * mx };
  }, [data]);

  const mse = useMemo(
    () => mean(data.map((d) => (w * d.x + b - d.y) ** 2)),
    [data, w, b],
  );

  // R² relative to the variance of y
  const r2 = useMemo(() => {
    const my = mean(data.map((d) => d.y));
    const ssTot = data.reduce((s, d) => s + (d.y - my) ** 2, 0);
    const ssRes = data.reduce((s, d) => s + (w * d.x + b - d.y) ** 2, 0);
    return ssTot === 0 ? 0 : 1 - ssRes / ssTot;
  }, [data, w, b]);

  function animateTo(tw: number, tb: number) {
    const sw = w;
    const sb = b;
    const t0 = performance.now();
    const dur = 750;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = easeOutCubic(t);
      setW(sw + (tw - sw) * e);
      setB(sb + (tb - sb) * e);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
  }

  useEffect(() => () => {
    if (raf.current) cancelAnimationFrame(raf.current);
  }, []);

  const lineY1 = sy(w * X_DOM[0] + b);
  const lineY2 = sy(w * X_DOM[1] + b);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_240px]">
      <div className="rounded-xl border border-border-soft bg-bg/50 p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" fill="none">
          {/* gridlines */}
          {[0, 3, 6, 9, 12].map((g) => (
            <line
              key={`gy${g}`}
              x1={PAD.l}
              x2={W - PAD.r}
              y1={sy(g)}
              y2={sy(g)}
              stroke="oklch(0.32 0.014 60)"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
          ))}
          {/* residuals */}
          {data.map((d, i) => (
            <line
              key={`r${i}`}
              x1={sx(d.x)}
              y1={sy(d.y)}
              x2={sx(d.x)}
              y2={sy(w * d.x + b)}
              stroke="oklch(0.72 0.17 35)"
              strokeWidth="1.25"
              strokeOpacity="0.35"
            />
          ))}
          {/* regression line */}
          <line
            x1={sx(X_DOM[0])}
            y1={lineY1}
            x2={sx(X_DOM[1])}
            y2={lineY2}
            stroke="oklch(0.64 0.19 288)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* points */}
          {data.map((d, i) => (
            <circle
              key={`p${i}`}
              cx={sx(d.x)}
              cy={sy(d.y)}
              r="4.5"
              fill="oklch(0.72 0.17 35)"
            />
          ))}
        </svg>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="MSE" value={round(mse, 2).toString()} accent="coral" />
          <Stat label="R²" value={round(r2, 3).toString()} accent="violet" />
        </div>
        <RangeControl
          label="slope (w)"
          value={round(w, 2)}
          min={-1}
          max={2}
          step={0.01}
          onChange={setW}
          format={(v) => v.toFixed(2)}
        />
        <RangeControl
          label="intercept (b)"
          value={round(b, 2)}
          min={-2}
          max={6}
          step={0.01}
          onChange={setB}
          format={(v) => v.toFixed(2)}
        />
        <div className="flex flex-wrap gap-2">
          <LabButton onClick={() => animateTo(ols.w, ols.b)}>
            <Sparkle size={15} weight="fill" /> Fit (least squares)
          </LabButton>
          <LabButton variant="ghost" onClick={() => setSeed((s) => s + 1)}>
            <ArrowsClockwise size={15} weight="bold" /> New data
          </LabButton>
        </div>
        <p className="text-xs leading-relaxed text-faint">
          Drag the sliders to move the line. The coral whiskers are residuals —
          “Fit” jumps to the slope and intercept that minimise their squared sum.
        </p>
      </div>
    </div>
  );
}
