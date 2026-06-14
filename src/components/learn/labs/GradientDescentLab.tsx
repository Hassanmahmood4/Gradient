"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, ArrowCounterClockwise, SkipForward } from "@phosphor-icons/react";
import { LabButton, RangeControl, Stat } from "@/components/learn/controls";
import { linspace, scaleLinear, round } from "@/lib/ml";

const W = 480;
const H = 300;
const PAD = { l: 38, r: 16, t: 16, b: 28 };
const X_DOM: [number, number] = [-5, 5];
const Y_DOM: [number, number] = [0, 13];

// loss surface f(θ) = ½θ²  →  gradient f'(θ) = θ
const f = (t: number) => 0.5 * t * t;
const grad = (t: number) => t;
const START = -4.3;

export function GradientDescentLab() {
  const [lr, setLr] = useState(0.3);
  const [theta, setTheta] = useState(START);
  const [history, setHistory] = useState<number[]>([START]);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const lrRef = useRef(lr);
  useEffect(() => {
    lrRef.current = lr;
  }, [lr]);

  const sx = scaleLinear(X_DOM, [PAD.l, W - PAD.r]);
  const sy = scaleLinear(Y_DOM, [H - PAD.b, PAD.t]);

  const curve = useMemo(() => {
    const pts = linspace(X_DOM[0], X_DOM[1], 80).map(
      (x) => `${sx(x)},${sy(Math.min(Y_DOM[1], f(x)))}`,
    );
    return `M${pts.join(" L")}`;
  }, [sx, sy]);

  const step = () => {
    setTheta((t) => {
      const next = t - lrRef.current * grad(t);
      setHistory((h) => [...h, next]);
      return next;
    });
  };

  function stop() {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setRunning(false);
  }

  function run() {
    if (running) return stop();
    setRunning(true);
    timer.current = setInterval(() => {
      setTheta((t) => {
        // stop when converged or clearly diverging
        if (Math.abs(grad(t)) < 1e-3 || Math.abs(t) > 12) {
          stop();
          return t;
        }
        const next = t - lrRef.current * grad(t);
        setHistory((h) => [...h, next]);
        return next;
      });
    }, 140);
  }

  function reset() {
    stop();
    setTheta(START);
    setHistory([START]);
  }

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const clampedTheta = Math.max(X_DOM[0], Math.min(X_DOM[1], theta));
  const diverged = Math.abs(theta) > 6;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_240px]">
      <div className="rounded-xl border border-border-soft bg-bg/50 p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" fill="none">
          {[0, 4, 8, 12].map((g) => (
            <line
              key={g}
              x1={PAD.l}
              x2={W - PAD.r}
              y1={sy(g)}
              y2={sy(g)}
              stroke="oklch(0.32 0.014 60)"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
          ))}
          <path d={curve} stroke="oklch(0.64 0.19 288)" strokeWidth="2.5" strokeLinecap="round" />

          {/* trajectory of past steps along the curve */}
          {history.map((t, i) => {
            const x = Math.max(X_DOM[0], Math.min(X_DOM[1], t));
            return (
              <circle
                key={i}
                cx={sx(x)}
                cy={sy(Math.min(Y_DOM[1], f(x)))}
                r="3"
                fill="oklch(0.72 0.17 35)"
                opacity={0.25 + (0.6 * i) / Math.max(1, history.length - 1)}
              />
            );
          })}

          {/* current position */}
          <circle
            cx={sx(clampedTheta)}
            cy={sy(Math.min(Y_DOM[1], f(clampedTheta)))}
            r="8"
            fill="oklch(0.72 0.17 35)"
            stroke="oklch(0.17 0.012 60)"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          <Stat label="step" value={String(history.length - 1)} />
          <Stat label="θ" value={round(theta, 2).toString()} accent="coral" />
          <Stat label="loss" value={round(f(theta), 2).toString()} accent="violet" />
        </div>
        <RangeControl
          label="learning rate"
          value={lr}
          min={0.02}
          max={2.2}
          step={0.02}
          onChange={setLr}
          format={(v) => v.toFixed(2)}
        />
        <div className="flex flex-wrap gap-2">
          <LabButton onClick={run}>
            {running ? <Pause size={15} weight="fill" /> : <Play size={15} weight="fill" />}
            {running ? "Pause" : "Run"}
          </LabButton>
          <LabButton variant="ghost" onClick={step} disabled={running}>
            <SkipForward size={15} weight="fill" /> Step
          </LabButton>
          <LabButton variant="ghost" onClick={reset}>
            <ArrowCounterClockwise size={15} weight="bold" /> Reset
          </LabButton>
        </div>
        <p className="text-xs leading-relaxed text-faint">
          Each step moves θ against the gradient: θ ← θ − η·f′(θ). Small η crawls;
          near η≈2 it oscillates; above that it{" "}
          <span className={diverged ? "text-danger" : ""}>diverges</span>.
        </p>
      </div>
    </div>
  );
}
