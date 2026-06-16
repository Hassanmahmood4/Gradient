"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, ArrowsClockwise } from "@phosphor-icons/react";
import { LabButton, Stat } from "@/components/learn/controls";
import { makeRng, gaussian, sigmoid } from "@/lib/ml";

/* ----------------------------------------------------------------------------
   A miniature TensorFlow Playground. A small net — features → 4 hidden tanh
   units → 1 sigmoid output — trains on a circle dataset by gradient descent.
   Every node renders a heatmap of its activation over the input plane; every
   link is coloured by weight sign (orange +, purple −) and sized by magnitude.
---------------------------------------------------------------------------- */

const IN = 4; // x, y, x², y²
const HID = 4;
// match the app's diagram palette: coral (orange) and violet (purple)
const CORAL: RGB = [250, 120, 88];
const VIOLET: RGB = [138, 114, 247];
const WHITE: RGB = [245, 243, 240];

type RGB = [number, number, number];
type Net = { W1: number[][]; b1: number[]; w2: number[]; b2: number };
type Point = { x: number; y: number; label: number };

const feat = (x: number, y: number) => [x, y, x * x, y * y];

function initNet(rng: () => number): Net {
  return {
    W1: Array.from({ length: HID }, () => Array.from({ length: IN }, () => gaussian(rng, 0, 1))),
    b1: Array.from({ length: HID }, () => 0),
    w2: Array.from({ length: HID }, () => gaussian(rng, 0, 1)),
    b2: 0,
  };
}

function makeData(seed: number): Point[] {
  const rng = makeRng(seed);
  const pts: Point[] = [];
  while (pts.length < 140) {
    const x = rng() * 2 - 1;
    const y = rng() * 2 - 1;
    const r = Math.hypot(x, y);
    if (r > 0.42 && r < 0.58) continue; // margin between classes
    pts.push({ x, y, label: r < 0.5 ? 1 : 0 });
  }
  return pts;
}

function forward(net: Net, x: number, y: number) {
  const f = feat(x, y);
  const h: number[] = [];
  for (let j = 0; j < HID; j++) {
    let s = net.b1[j];
    for (let i = 0; i < IN; i++) s += net.W1[j][i] * f[i];
    h[j] = Math.tanh(s);
  }
  let o = net.b2;
  for (let j = 0; j < HID; j++) o += net.w2[j] * h[j];
  return { h, o: sigmoid(o) };
}

function trainStep(net: Net, data: Point[], lr: number): number {
  const gW1 = Array.from({ length: HID }, () => new Array(IN).fill(0));
  const gb1 = new Array(HID).fill(0);
  const gw2 = new Array(HID).fill(0);
  let gb2 = 0;
  let loss = 0;

  for (const p of data) {
    const f = feat(p.x, p.y);
    const h: number[] = [];
    for (let j = 0; j < HID; j++) {
      let s = net.b1[j];
      for (let i = 0; i < IN; i++) s += net.W1[j][i] * f[i];
      h[j] = Math.tanh(s);
    }
    let opre = net.b2;
    for (let j = 0; j < HID; j++) opre += net.w2[j] * h[j];
    const o = sigmoid(opre);
    loss += -(p.label * Math.log(o + 1e-9) + (1 - p.label) * Math.log(1 - o + 1e-9));

    const dOut = o - p.label; // dL/d(opre)
    gb2 += dOut;
    for (let j = 0; j < HID; j++) {
      gw2[j] += dOut * h[j];
      const dh = dOut * net.w2[j] * (1 - h[j] * h[j]);
      gb1[j] += dh;
      for (let i = 0; i < IN; i++) gW1[j][i] += dh * f[i];
    }
  }

  const n = data.length;
  for (let j = 0; j < HID; j++) {
    net.w2[j] -= (lr * gw2[j]) / n;
    net.b1[j] -= (lr * gb1[j]) / n;
    for (let i = 0; i < IN; i++) net.W1[j][i] -= (lr * gW1[j][i]) / n;
  }
  net.b2 -= (lr * gb2) / n;
  return loss / n;
}

const mix = (a: RGB, b: RGB, t: number): RGB => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];
function rgbFor(v: number): RGB {
  const t = Math.max(-1, Math.min(1, v));
  return t >= 0 ? mix(WHITE, CORAL, t) : mix(WHITE, VIOLET, -t);
}

function heatURL(fn: (x: number, y: number) => number): string {
  const G = 24;
  const c = document.createElement("canvas");
  c.width = G;
  c.height = G;
  const ctx = c.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(G, G);
  for (let j = 0; j < G; j++) {
    for (let i = 0; i < G; i++) {
      const x = -1 + (2 * i) / (G - 1);
      const y = 1 - (2 * j) / (G - 1);
      const [r, g, b] = rgbFor(fn(x, y));
      const idx = (j * G + i) * 4;
      img.data[idx] = r;
      img.data[idx + 1] = g;
      img.data[idx + 2] = b;
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

// fixed layout coordinates (SVG units)
const CY = [60, 120, 180, 240];
const IN_X = 46;
const HID_X = 210;
const OUT = { x: 384, y: 122, size: 62 };
const NODE = 36;
const IN_LABELS = ["X₁", "X₂", "X₁²", "X₂²"];

const snapshot = (n: Net): Net => ({
  W1: n.W1.map((r) => [...r]),
  b1: [...n.b1],
  w2: [...n.w2],
  b2: n.b2,
});

export function TFPlaygroundLab() {
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(0);
  // render snapshots — what the SVG draws
  const [net, setNet] = useState<Net>(() => initNet(makeRng(3)));
  const [data, setData] = useState<Point[]>(() => makeData(5));
  // refs hold the live training scratch (mutated in effects/handlers only)
  const netRef = useRef<Net>(snapshot(net));
  const dataRef = useRef<Point[]>(data);
  const [heat, setHeat] = useState<{ input: string[]; hidden: string[]; output: string }>({
    input: [],
    hidden: [],
    output: "",
  });

  const regenerate = useCallback(() => {
    const net = netRef.current;
    const input = [
      heatURL((x) => x),
      heatURL((_x, y) => y),
      heatURL((x) => x * x),
      heatURL((_x, y) => y * y),
    ];
    const hidden = net.W1.map((_wj, j) =>
      heatURL((x, y) => {
        const f = feat(x, y);
        let s = net.b1[j];
        for (let i = 0; i < IN; i++) s += net.W1[j][i] * f[i];
        return Math.tanh(s);
      }),
    );
    const output = heatURL((x, y) => 2 * forward(net, x, y).o - 1);
    setHeat({ input, hidden, output });
  }, []);

  // regenerate heatmaps whenever the throttled tick advances
  useEffect(() => {
    regenerate();
  }, [tick, regenerate]);

  // training loop
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let lastHeat = 0;
    const loop = (t: number) => {
      let l = 0;
      for (let s = 0; s < 6; s++) l = trainStep(netRef.current, dataRef.current, 0.5);
      setEpoch((e) => e + 6);
      setLoss(l);
      setNet(snapshot(netRef.current)); // re-render links from the live weights
      if (t - lastHeat > 90) {
        lastHeat = t;
        setTick((k) => k + 1);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  function reset() {
    setRunning(false);
    netRef.current = initNet(makeRng(Math.floor(Math.random() * 1e6)));
    dataRef.current = makeData(Math.floor(Math.random() * 1e6));
    setEpoch(0);
    setLoss(0);
    setNet(snapshot(netRef.current));
    setData(dataRef.current);
    setTick((k) => k + 1);
  }

  const edge = (w: number) => {
    const mag = Math.min(1, Math.abs(w) / 3);
    return {
      stroke: `rgb(${(w >= 0 ? CORAL : VIOLET).join(",")})`,
      width: 0.4 + mag * 3.4,
      opacity: 0.18 + mag * 0.6,
    };
  };
  const link = (x1: number, y1: number, x2: number, y2: number) =>
    `M${x1} ${y1} C${x1 + 46} ${y1}, ${x2 - 46} ${y2}, ${x2} ${y2}`;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
      <div className="rounded-xl border border-border-soft bg-bg/50 p-4">
        <svg viewBox="0 0 470 290" className="h-auto w-full" fill="none">
          <text x={IN_X + NODE / 2} y="22" textAnchor="middle" fontSize="9.5" className="fill-[var(--color-faint)] font-mono">
            features
          </text>
          <text x={HID_X + NODE / 2} y="22" textAnchor="middle" fontSize="9.5" className="fill-[var(--color-faint)] font-mono">
            4 neurons
          </text>
          <text x={OUT.x + OUT.size / 2} y="22" textAnchor="middle" fontSize="9.5" className="fill-[var(--color-faint)] font-mono">
            output
          </text>

          {/* links: input -> hidden */}
          {net.W1.map((wj, j) =>
            wj.map((w, i) => {
              const s = edge(w);
              return (
                <path
                  key={`i${i}h${j}`}
                  d={link(IN_X + NODE, CY[i], HID_X, CY[j])}
                  stroke={s.stroke}
                  strokeWidth={s.width}
                  strokeOpacity={s.opacity}
                  fill="none"
                />
              );
            }),
          )}
          {/* links: hidden -> output */}
          {net.w2.map((w, j) => {
            const s = edge(w);
            return (
              <path
                key={`h${j}o`}
                d={link(HID_X + NODE, CY[j], OUT.x, OUT.y + OUT.size / 2)}
                stroke={s.stroke}
                strokeWidth={s.width}
                strokeOpacity={s.opacity}
                fill="none"
              />
            );
          })}

          {/* input nodes */}
          {CY.map((cy, i) => (
            <g key={`in${i}`}>
              <text x={IN_X - 10} y={cy + 4} textAnchor="end" fontSize="11" className="fill-[var(--color-muted)] font-mono">
                {IN_LABELS[i]}
              </text>
              {heat.input[i] && (
                <image href={heat.input[i]} x={IN_X} y={cy - NODE / 2} width={NODE} height={NODE} preserveAspectRatio="none" />
              )}
              <rect x={IN_X} y={cy - NODE / 2} width={NODE} height={NODE} rx="4" stroke="var(--color-border)" />
            </g>
          ))}

          {/* hidden nodes */}
          {CY.map((cy, j) => (
            <g key={`hid${j}`}>
              {heat.hidden[j] && (
                <image href={heat.hidden[j]} x={HID_X} y={cy - NODE / 2} width={NODE} height={NODE} preserveAspectRatio="none" />
              )}
              <rect x={HID_X} y={cy - NODE / 2} width={NODE} height={NODE} rx="4" stroke="var(--color-border)" />
            </g>
          ))}

          {/* output node + dataset overlay */}
          {heat.output && (
            <image href={heat.output} x={OUT.x} y={OUT.y} width={OUT.size} height={OUT.size} preserveAspectRatio="none" />
          )}
          {data.map((p, i) => (
            <circle
              key={`d${i}`}
              cx={OUT.x + ((p.x + 1) / 2) * OUT.size}
              cy={OUT.y + ((1 - p.y) / 2) * OUT.size}
              r="1.4"
              fill={`rgb(${(p.label === 1 ? CORAL : VIOLET).join(",")})`}
              stroke="rgba(0,0,0,0.35)"
              strokeWidth="0.4"
            />
          ))}
          <rect x={OUT.x} y={OUT.y} width={OUT.size} height={OUT.size} rx="5" stroke="var(--color-border)" />
        </svg>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="epoch" value={String(epoch)} accent="violet" />
          <Stat label="loss" value={epoch ? loss.toFixed(3) : "—"} accent="coral" />
        </div>
        <LabButton onClick={() => setRunning((r) => !r)}>
          {running ? <Pause size={15} weight="fill" /> : <Play size={15} weight="fill" />}
          {running ? "Pause" : "Train"}
        </LabButton>
        <LabButton variant="ghost" onClick={reset}>
          <ArrowsClockwise size={15} weight="bold" /> Reset
        </LabButton>
        <p className="text-xs leading-relaxed text-faint">
          Each tile is a neuron’s output across the input plane; link color shows
          weight sign (orange +, purple −) and thickness its size. Press Train and
          watch the hidden units bend until the output learns the circle.
        </p>
      </div>
    </div>
  );
}
