"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const CORAL = "oklch(0.72 0.17 35)";
const W = 410;

export function ChainLab() {
  const [retriever, setRetriever] = useState(false);
  const [memory, setMemory] = useState(false);

  const nodes = ["Prompt", ...(retriever ? ["Retriever"] : []), "Model", "Parser"];
  const expr = ["prompt", ...(retriever ? ["retriever"] : []), "model", "parser"].join(" | ");

  const n = nodes.length;
  const margin = 46;
  const span = W - margin * 2;
  const xs = nodes.map((_, i) => margin + (n === 1 ? 0 : (span * i) / (n - 1)));
  const cy = 70;
  const path = `M${xs[0]} ${cy} L${xs[n - 1]} ${cy}`;

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[1fr_240px]">
      <div className="rounded-xl border border-border-soft bg-bg/50 p-4">
        <svg viewBox="0 0 410 150" className="h-auto w-full" fill="none">
          {/* base line */}
          <line x1={xs[0]} y1={cy} x2={xs[n - 1]} y2={cy} stroke="var(--color-border)" strokeWidth="2" />

          {/* memory feed into the model */}
          {memory && (
            <g>
              <rect x={W / 2 - 34} y={116} width="68" height="22" rx="6" fill="none" stroke="var(--color-violet)" strokeOpacity="0.6" />
              <text x={W / 2} y={131} textAnchor="middle" fontSize="9" className="fill-[var(--color-violet)] font-mono">
                memory
              </text>
              <line x1={W / 2} y1={116} x2={W / 2} y2={cy + 18} stroke="var(--color-violet)" strokeOpacity="0.4" strokeDasharray="3 3" />
            </g>
          )}

          {/* flowing token */}
          <motion.circle
            r="5"
            fill={CORAL}
            style={{ offsetPath: `path('${path}')` }}
            animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* nodes */}
          {nodes.map((label, i) => (
            <g key={label}>
              <rect x={xs[i] - 38} y={cy - 16} width="76" height="32" rx="9" fill="var(--color-surface-2)" stroke="var(--color-border)" />
              <text x={xs[i]} y={cy + 4} textAnchor="middle" fontSize="11" className="fill-[var(--color-text)] font-mono">
                {label}
              </text>
            </g>
          ))}
        </svg>

        <div className="mt-3 rounded-lg border border-border-soft bg-bg/60 px-3 py-2 font-mono text-xs text-text">
          chain = {expr}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Toggle label="Add retriever (RAG)" on={retriever} onClick={() => setRetriever((v) => !v)} />
        <Toggle label="Add memory" on={memory} onClick={() => setMemory((v) => !v)} />
        <p className="text-xs leading-relaxed text-faint">
          LCEL pipes pieces together with the | operator. Add a retriever to ground
          answers in your data, or memory to carry context across turns — the token
          flows through whatever you compose.
        </p>
      </div>
    </div>
  );
}

function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition-colors",
        on
          ? "border-coral/50 bg-coral/5 text-text"
          : "border-border-soft text-muted hover:text-text",
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors",
          on ? "bg-coral" : "bg-surface-2",
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform",
            on ? "translate-x-4" : "translate-x-0",
          )}
        />
      </span>
    </button>
  );
}
