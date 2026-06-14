"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, ArrowCounterClockwise } from "@phosphor-icons/react";
import { LabButton, RangeControl, Stat } from "@/components/learn/controls";
import { makeRng, gaussian, sigmoid, scaleLinear, clamp, round } from "@/lib/ml";

const SIZE = 320;
const DOM: [number, number] = [-1.25, 1.25];
const GRID = 22;
const CORAL = "oklch(0.72 0.17 35)";
const VIOLET = "oklch(0.64 0.19 288)";

type Pt = { x: number; y: number; label: 0 | 1 };
type Net = { W1: number[][]; b1: number[]; W2: number[]; b2: number };

// XOR-style dataset: opposite quadrants share a class → needs a hidden layer
function makeData(): Pt[] {
  const rng = makeRng(42);
  const pts: Pt[] = [];
  const corners: [number, number, 0 | 1][] = [
    [0.55, 0.55, 1],
    [-0.55, -0.55, 1],
    [0.55, -0.55, 0],
    [-0.55, 0.55, 0],
  ];
  for (const [cx, cy, label] of corners) {
    for (let i = 0; i < 18; i++) {
      pts.push({
        x: clamp(gaussian(rng, cx, 0.18), -1.1, 1.1),
        y: clamp(gaussian(rng, cy, 0.18), -1.1, 1.1),
        label,
      });
    }
  }
  return pts;
}

function initNet(h: number, seed: number): Net {
  const rng = makeRng(seed);
  const r = () => (rng() - 0.5) * 2;
  return {
    W1: Array.from({ length: h }, () => [r(), r()]),
    b1: Array.from({ length: h }, () => 0),
    W2: Array.from({ length: h }, () => r()),
    b2: 0,
  };
}

function forward(net: Net, x: number, y: number) {
  const h = net.W1.map((w, j) => Math.tanh(w[0] * x + w[1] * y + net.b1[j]));
  const z = h.reduce((s, hj, j) => s + hj * net.W2[j], net.b2);
  return { h, o: sigmoid(z) };
}

function trainStep(net: Net, data: Pt[], lr: number) {
  const H = net.W1.length;
  const dW1 = net.W1.map(() => [0, 0]);
  const db1 = new Array(H).fill(0);
  const dW2 = new Array(H).fill(0);
  let db2 = 0;
  for (const p of data) {
    const { h, o } = forward(net, p.x, p.y);
    const dO = o - p.label; // BCE + sigmoid
    for (let j = 0; j < H; j++) {
      dW2[j] += dO * h[j];
      const dh = dO * net.W2[j] * (1 - h[j] * h[j]);
      dW1[j][0] += dh * p.x;
      dW1[j][1] += dh * p.y;
      db1[j] += dh;
    }
    db2 += dO;
  }
  const n = data.length;
  for (let j = 0; j < H; j++) {
    net.W2[j] -= (lr * dW2[j]) / n;
    net.W1[j][0] -= (lr * dW1[j][0]) / n;
    net.W1[j][1] -= (lr * dW1[j][1]) / n;
    net.b1[j] -= (lr * db1[j]) / n;
  }
  net.b2 -= (lr * db2) / n;
}

export function NeuralNetLab() {
  const [hidden, setHidden] = useState(6);
  const [lr, setLr] = useState(0.6);
  // remount the trainer when the hidden-layer size changes so the network
  // rebuilds cleanly (no ref writes or setState during render).
  return (
    <NeuralNetInner
      key={hidden}
      hidden={hidden}
      lr={lr}
      setHidden={setHidden}
      setLr={setLr}
    />
  );
}

function NeuralNetInner({
  hidden,
  lr,
  setHidden,
  setLr,
}: {
  hidden: number;
  lr: number;
  setHidden: (v: number) => void;
  setLr: (v: number) => void;
}) {
  const data = useMemo(() => makeData(), []);
  const [running, setRunning] = useState(false);
  const [tick, force] = useState(0);

  const reseedRef = useRef(0);
  const netRef = useRef<Net>(initNet(hidden, hidden * 13 + 1));
  const epochRef = useRef(0);
  const raf = useRef<number | undefined>(undefined);
  const lrRef = useRef(lr);
  useEffect(() => {
    lrRef.current = lr;
  }, [lr]);

  const sx = scaleLinear(DOM, [0, SIZE]);
  const sy = scaleLinear(DOM, [SIZE, 0]);

  function reset() {
    if (raf.current) cancelAnimationFrame(raf.current);
    setRunning(false);
    reseedRef.current += 1;
    netRef.current = initNet(hidden, hidden * 13 + 1 + reseedRef.current * 7);
    epochRef.current = 0;
    force((n) => n + 1);
  }

  function loop() {
    for (let i = 0; i < 6; i++) {
      trainStep(netRef.current, data, lrRef.current);
      epochRef.current += 1;
    }
    force((n) => n + 1);
    raf.current = requestAnimationFrame(loop);
  }

  function toggle() {
    if (running) {
      if (raf.current) cancelAnimationFrame(raf.current);
      setRunning(false);
    } else {
      setRunning(true);
      raf.current = requestAnimationFrame(loop);
    }
  }

  useEffect(() => () => {
    if (raf.current) cancelAnimationFrame(raf.current);
  }, []);

  const net = netRef.current;

  const { loss, acc } = useMemo(() => {
    let l = 0;
    let correct = 0;
    for (const p of data) {
      const { o } = forward(net, p.x, p.y);
      const c = clamp(o, 1e-6, 1 - 1e-6);
      l += -(p.label * Math.log(c) + (1 - p.label) * Math.log(1 - c));
      if ((o > 0.5 ? 1 : 0) === p.label) correct++;
    }
    return { loss: l / data.length, acc: correct / data.length };
    // recompute on every training tick (net is mutated in place via a ref)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, tick, net]);

  // decision-boundary heatmap
  const cells = [];
  const cell = SIZE / GRID;
  for (let gx = 0; gx < GRID; gx++) {
    for (let gy = 0; gy < GRID; gy++) {
      const dx = sx.invert((gx + 0.5) * cell);
      const dy = sy.invert((gy + 0.5) * cell);
      const { o } = forward(net, dx, dy);
      cells.push(
        <rect
          key={`${gx}-${gy}`}
          x={gx * cell}
          y={gy * cell}
          width={cell + 0.5}
          height={cell + 0.5}
          fill={o > 0.5 ? VIOLET : CORAL}
          fillOpacity={0.08 + Math.abs(o - 0.5) * 0.5}
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
              r="4.5"
              fill={p.label === 1 ? VIOLET : CORAL}
              stroke="oklch(0.17 0.012 60)"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="loss" value={round(loss, 3).toString()} accent="coral" />
          <Stat label="accuracy" value={`${round(acc * 100, 0)}%`} accent="violet" />
        </div>
        <Stat label="epochs" value={String(epochRef.current)} />
        <RangeControl label="hidden units" value={hidden} min={1} max={12} step={1} onChange={(v) => setHidden(v)} />
        <RangeControl
          label="learning rate"
          value={lr}
          min={0.05}
          max={2}
          step={0.05}
          onChange={setLr}
          format={(v) => v.toFixed(2)}
        />
        <div className="flex flex-wrap gap-2">
          <LabButton onClick={toggle}>
            {running ? <Pause size={15} weight="fill" /> : <Play size={15} weight="fill" />}
            {running ? "Pause" : "Train"}
          </LabButton>
          <LabButton variant="ghost" onClick={reset}>
            <ArrowCounterClockwise size={15} weight="bold" /> Reset
          </LabButton>
        </div>
        <p className="text-xs leading-relaxed text-faint">
          A 2→{hidden}→1 network trained with backprop on an XOR pattern. With
          too few hidden units it can’t bend the boundary enough to separate the
          classes.
        </p>
      </div>
    </div>
  );
}
