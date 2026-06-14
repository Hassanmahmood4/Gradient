"use client";

import { useMemo, useState } from "react";
import { ArrowsClockwise } from "@phosphor-icons/react";
import { LabButton, RangeControl, Stat } from "@/components/learn/controls";
import { makeRng, gaussian, scaleLinear, clamp, round } from "@/lib/ml";

const SIZE = 300;
const PAD = { l: 36, r: 14, t: 14, b: 30 };
const CORAL = "oklch(0.72 0.17 35)";
const VIOLET = "oklch(0.64 0.19 288)";
const SUCCESS = "oklch(0.74 0.15 150)";

type Scored = { score: number; label: 0 | 1 };

function makeData(seed: number): Scored[] {
  const rng = makeRng(seed);
  const pos = Array.from({ length: 24 }, () => ({
    score: clamp(gaussian(rng, 0.66, 0.17), 0, 1),
    label: 1 as const,
  }));
  const neg = Array.from({ length: 26 }, () => ({
    score: clamp(gaussian(rng, 0.36, 0.17), 0, 1),
    label: 0 as const,
  }));
  return [...pos, ...neg];
}

function Cell({ label, value, kind }: { label: string; value: number; kind: "ok" | "err" }) {
  return (
    <div
      className="rounded-lg border px-3 py-2.5 text-center"
      style={{
        borderColor: kind === "ok" ? `${SUCCESS}55` : `${CORAL}55`,
        background: kind === "ok" ? `${SUCCESS}14` : `${CORAL}14`,
      }}
    >
      <div className="font-display text-lg font-semibold tabular-nums">{value}</div>
      <div className="font-mono text-[0.58rem] uppercase tracking-wide text-faint">{label}</div>
    </div>
  );
}

function confusion(data: Scored[], t: number) {
  let tp = 0, fp = 0, fn = 0, tn = 0;
  for (const d of data) {
    const pred = d.score >= t ? 1 : 0;
    if (d.label === 1) {
      if (pred === 1) tp++;
      else fn++;
    } else if (pred === 1) fp++;
    else tn++;
  }
  return { tp, fp, fn, tn };
}

export function ThresholdLab() {
  const [seed, setSeed] = useState(2);
  const [threshold, setThreshold] = useState(0.5);
  const data = useMemo(() => makeData(seed), [seed]);

  const { tp, fp, fn, tn } = confusion(data, threshold);
  const n = data.length;
  const accuracy = (tp + tn) / n;
  const precision = tp + fp ? tp / (tp + fp) : 0;
  const recall = tp + fn ? tp / (tp + fn) : 0;
  const f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : 0;

  const sx = scaleLinear([0, 1], [PAD.l, SIZE - PAD.r]);
  const sy = scaleLinear([0, 1], [SIZE - PAD.b, PAD.t]);

  // ROC curve: sweep threshold from high → low
  const { rocPath, auc } = useMemo(() => {
    const P = data.filter((d) => d.label === 1).length;
    const N = data.length - P;
    const ts = [1.01, ...data.map((d) => d.score).sort((a, b) => b - a), -0.01];
    const pts = ts.map((t) => {
      const { tp, fp } = confusion(data, t);
      return { fpr: N ? fp / N : 0, tpr: P ? tp / P : 0 };
    });
    // trapezoidal AUC over points sorted by FPR
    const sorted = [...pts].sort((a, b) => a.fpr - b.fpr);
    let area = 0;
    for (let i = 1; i < sorted.length; i++) {
      area += ((sorted[i].fpr - sorted[i - 1].fpr) * (sorted[i].tpr + sorted[i - 1].tpr)) / 2;
    }
    const path = `M${pts.map((p) => `${sx(p.fpr)},${sy(p.tpr)}`).join(" L")}`;
    return { rocPath: path, auc: area };
  }, [data, sx, sy]);

  const cur = useMemo(() => {
    const P = data.filter((d) => d.label === 1).length;
    const N = data.length - P;
    return { fpr: N ? fp / N : 0, tpr: P ? tp / P : 0 };
  }, [data, fp, tp]);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_240px]">
      <div className="rounded-xl border border-border-soft bg-bg/50 p-4">
        <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-widest text-faint">
          ROC curve · AUC {round(auc, 3)}
        </p>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto h-auto w-full max-w-[320px]" fill="none">
          {/* axes box */}
          <rect x={PAD.l} y={PAD.t} width={SIZE - PAD.l - PAD.r} height={SIZE - PAD.t - PAD.b} stroke="oklch(0.32 0.014 60)" strokeWidth="1" />
          {/* chance diagonal */}
          <line x1={sx(0)} y1={sy(0)} x2={sx(1)} y2={sy(1)} stroke="oklch(0.55 0.012 70)" strokeWidth="1" strokeDasharray="4 5" />
          {/* roc */}
          <path d={rocPath} stroke={VIOLET} strokeWidth="2.5" strokeLinejoin="round" />
          {/* current operating point */}
          <circle cx={sx(cur.fpr)} cy={sy(cur.tpr)} r="6" fill={CORAL} stroke="oklch(0.17 0.012 60)" strokeWidth="2" />
          <text x={(SIZE) / 2} y={SIZE - 6} textAnchor="middle" className="fill-faint" style={{ font: "10px var(--font-mono)" }}>
            false positive rate
          </text>
        </svg>
      </div>

      <div className="flex flex-col gap-3">
        {/* confusion matrix */}
        <div className="grid grid-cols-2 gap-2">
          <Cell label="True Pos" value={tp} kind="ok" />
          <Cell label="False Neg" value={fn} kind="err" />
          <Cell label="False Pos" value={fp} kind="err" />
          <Cell label="True Neg" value={tn} kind="ok" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="precision" value={round(precision, 2).toString()} accent="coral" />
          <Stat label="recall" value={round(recall, 2).toString()} accent="violet" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="F1" value={round(f1, 2).toString()} />
          <Stat label="accuracy" value={`${round(accuracy * 100, 0)}%`} />
        </div>
        <RangeControl
          label="threshold"
          value={threshold}
          min={0}
          max={1}
          step={0.01}
          onChange={setThreshold}
          format={(v) => v.toFixed(2)}
        />
        <LabButton variant="ghost" onClick={() => setSeed((s) => s + 1)}>
          <ArrowsClockwise size={15} weight="bold" /> New data
        </LabButton>
        <p className="text-xs leading-relaxed text-faint">
          Slide the threshold: lower it to catch more positives (higher recall,
          more false alarms), raise it to be stricter (higher precision). The ROC
          point traces every choice; AUC summarises them all.
        </p>
      </div>
    </div>
  );
}
