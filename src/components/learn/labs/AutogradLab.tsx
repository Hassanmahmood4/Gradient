"use client";

import { useState, type ReactNode } from "react";
import { RangeControl, Segmented, Stat } from "@/components/learn/controls";

const CORAL = "oklch(0.72 0.17 35)";
const VIOLET = "oklch(0.64 0.19 288)";

function chip(cx: number, cy: number, label: string, val: string, accent?: boolean): ReactNode {
  return (
    <g>
      <rect
        x={cx - 24}
        y={cy - 17}
        width="48"
        height="34"
        rx="9"
        fill="var(--color-surface-2)"
        stroke={accent ? CORAL : "var(--color-border)"}
      />
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="11" className="fill-[var(--color-text)] font-mono">
        {label}
      </text>
      <text x={cx} y={cy + 11} textAnchor="middle" fontSize="9" className="fill-[var(--color-faint)] font-mono">
        {val}
      </text>
    </g>
  );
}

export function AutogradLab() {
  const [x, setX] = useState(2);
  const [w, setW] = useState(1.5);
  const [mode, setMode] = useState<"forward" | "backward">("forward");
  const y = 4;

  const z = x * w;
  const e = z - y;
  const L = e * e;

  const dL_de = 2 * e;
  const dL_dz = dL_de; // de/dz = 1
  const dL_dw = dL_dz * x;
  const dL_dx = dL_dz * w;

  const back = mode === "backward";

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_240px]">
      <div className="rounded-xl border border-border-soft bg-bg/50 p-4">
        <svg viewBox="0 0 410 210" className="h-auto w-full" fill="none">
          {/* edges */}
          <line x1="76" y1="68" x2="138" y2="100" stroke="var(--color-border)" strokeWidth="1.5" />
          <line x1="76" y1="150" x2="138" y2="116" stroke="var(--color-border)" strokeWidth="1.5" />
          <line x1="184" y1="108" x2="234" y2="108" stroke="var(--color-border)" strokeWidth="1.5" />
          <line x1="282" y1="108" x2="332" y2="108" stroke="var(--color-border)" strokeWidth="1.5" />

          {/* nodes */}
          {chip(52, 68, "x", x.toFixed(1))}
          {chip(52, 150, "w", w.toFixed(2), true)}
          {chip(160, 108, "x·w", z.toFixed(1))}
          {chip(258, 108, "−y", e.toFixed(1))}
          {chip(356, 108, "(·)²", L.toFixed(1))}
          <text x="356" y="142" textAnchor="middle" fontSize="8.5" className="fill-[var(--color-coral)] font-mono">
            loss
          </text>

          {/* gradient annotations */}
          {back && (
            <g fontSize="9" fill={VIOLET} className="font-mono">
              <text x="52" y="44" textAnchor="middle">
                ∂L/∂x = {dL_dx.toFixed(1)}
              </text>
              <text x="52" y="192" textAnchor="middle">
                ∂L/∂w = {dL_dw.toFixed(1)}
              </text>
              <text x="209" y="82" textAnchor="middle">
                ∂L/∂z = {dL_dz.toFixed(1)}
              </text>
              <text x="307" y="82" textAnchor="middle">
                ∂L/∂e = {dL_de.toFixed(1)}
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="flex flex-col gap-3">
        <Segmented
          options={[
            { value: "forward", label: "Forward" },
            { value: "backward", label: "Backward" },
          ]}
          value={mode}
          onChange={setMode}
        />
        <div className="grid grid-cols-2 gap-3">
          <Stat label="loss" value={L.toFixed(2)} accent="coral" />
          <Stat label="∂L/∂w" value={back ? dL_dw.toFixed(2) : "—"} accent="violet" />
        </div>
        <RangeControl
          label="x (input)"
          value={x}
          min={0}
          max={5}
          step={0.1}
          onChange={setX}
          format={(v) => v.toFixed(1)}
        />
        <RangeControl
          label="w (param)"
          value={w}
          min={-1}
          max={4}
          step={0.05}
          onChange={setW}
          format={(v) => v.toFixed(2)}
        />
        <p className="text-xs leading-relaxed text-faint">
          {back
            ? "loss.backward() walks the graph in reverse, multiplying local derivatives (the chain rule) to fill every ∂L/∂·."
            : "The forward pass builds the graph as it runs and computes L = (x·w − y)². Flip to Backward to see autograd fill the gradients."}
        </p>
      </div>
    </div>
  );
}
