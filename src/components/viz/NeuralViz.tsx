"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

const LAYERS = [3, 5, 5, 2];
const W = 720;
const H = 460;
const PAD_X = 90;
const PAD_Y = 60;

interface Node {
  id: string;
  x: number;
  y: number;
  layer: number;
}
interface Edge {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
}

function buildGraph() {
  const nodes: Node[] = [];
  const usableW = W - PAD_X * 2;
  const usableH = H - PAD_Y * 2;

  LAYERS.forEach((count, layer) => {
    const x = PAD_X + (usableW * layer) / (LAYERS.length - 1);
    for (let i = 0; i < count; i++) {
      const y =
        count === 1
          ? H / 2
          : PAD_Y + (usableH * i) / (count - 1);
      nodes.push({ id: `${layer}-${i}`, x, y, layer });
    }
  });

  const edges: Edge[] = [];
  for (let l = 0; l < LAYERS.length - 1; l++) {
    const from = nodes.filter((n) => n.layer === l);
    const to = nodes.filter((n) => n.layer === l + 1);
    from.forEach((a) =>
      to.forEach((b) => {
        edges.push({
          id: `${a.id}_${b.id}`,
          x1: a.x,
          y1: a.y,
          x2: b.x,
          y2: b.y,
          // deterministic stagger so pulses feel like signal propagation
          delay: l * 0.5 + (a.y / H) * 0.4 + (b.y / H) * 0.3,
        });
      }),
    );
  }
  return { nodes, edges };
}

export function NeuralViz({ className }: { className?: string }) {
  const { nodes, edges } = useMemo(() => buildGraph(), []);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.72 0.17 35)" />
          <stop offset="100%" stopColor="oklch(0.64 0.19 288)" />
        </linearGradient>
        <radialGradient id="nodeCoral">
          <stop offset="0%" stopColor="oklch(0.78 0.17 35)" />
          <stop offset="100%" stopColor="oklch(0.66 0.19 32)" />
        </radialGradient>
        <radialGradient id="nodeViolet">
          <stop offset="0%" stopColor="oklch(0.7 0.19 288)" />
          <stop offset="100%" stopColor="oklch(0.58 0.21 286)" />
        </radialGradient>
      </defs>

      {/* edges with flowing signal pulses */}
      {edges.map((e) => (
        <g key={e.id}>
          <line
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            stroke="url(#edgeGrad)"
            strokeOpacity={0.1}
            strokeWidth={1}
          />
          <motion.line
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            stroke="url(#edgeGrad)"
            strokeWidth={1.5}
            strokeLinecap="round"
            pathLength={1}
            initial={{ strokeDasharray: "0.18 0.82", strokeDashoffset: 1, opacity: 0 }}
            animate={{ strokeDashoffset: [1, -0.2], opacity: [0, 0.9, 0] }}
            transition={{
              duration: 2.4,
              delay: e.delay,
              repeat: Infinity,
              repeatDelay: 1.6,
              ease: "easeInOut",
            }}
          />
        </g>
      ))}

      {/* nodes */}
      {nodes.map((n, i) => {
        const isEdgeLayer = n.layer === 0 || n.layer === LAYERS.length - 1;
        return (
          <motion.circle
            key={n.id}
            cx={n.x}
            cy={n.y}
            r={isEdgeLayer ? 8 : 6}
            fill={n.layer % 2 === 0 ? "url(#nodeCoral)" : "url(#nodeViolet)"}
            initial={{ scale: 0.6, opacity: 0.5 }}
            animate={{ scale: [0.85, 1.1, 0.85], opacity: [0.6, 1, 0.6] }}
            transition={{
              duration: 3,
              delay: (i % 5) * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          />
        );
      })}
    </svg>
  );
}
