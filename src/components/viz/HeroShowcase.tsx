"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

const W = 480;
const H = 380;
const CORAL = "oklch(0.72 0.17 35)";
const VIOLET = "oklch(0.64 0.19 288)";
const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const SCENES = [
  { name: "gradient flow", accent: CORAL },
  { name: "loss landscape", accent: CORAL },
  { name: "neural net", accent: VIOLET },
  { name: "classification", accent: VIOLET },
];

/* deterministic PRNG so SSR and client render identically */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/* interpolate coral hue (35) -> violet hue (288) */
const hueAt = (t: number) => `oklch(0.71 0.17 ${(35 + t * 253).toFixed(0)})`;

export function HeroShowcase({ className }: { className?: string }) {
  const prefersReduced = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState(0);
  const [hover, setHover] = useState(false);

  const mxRaw = useMotionValue(0);
  const myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 110, damping: 18 });
  const my = useSpring(myRaw, { stiffness: 110, damping: 18 });
  const gx = useMotionValue(0);
  const gy = useMotionValue(0);

  const px = useTransform(mx, [-1, 1], [0, W]);
  const py = useTransform(my, [-1, 1], [0, H]);
  const groupX = useTransform(mx, [-1, 1], [16, -16]);
  const groupY = useTransform(my, [-1, 1], [12, -12]);

  useEffect(() => {
    if (prefersReduced || hover) return;
    const t = setInterval(() => setScene((s) => (s + 1) % SCENES.length), 5200);
    return () => clearInterval(t);
  }, [hover, prefersReduced]);

  function handleMove(e: React.MouseEvent) {
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    mxRaw.set(Math.max(-1, Math.min(1, nx)));
    myRaw.set(Math.max(-1, Math.min(1, ny)));
    gx.set(e.clientX - r.left);
    gy.set(e.clientY - r.top);
  }
  function handleLeave() {
    setHover(false);
    mxRaw.set(0);
    myRaw.set(0);
  }

  return (
    <div
      ref={wrap}
      onMouseMove={prefersReduced ? undefined : handleMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={handleLeave}
      className={`relative select-none ${className ?? ""}`}
    >
      {/* cursor-following glow */}
      {!prefersReduced && (
        <motion.div
          aria-hidden
          style={{ x: gx, y: gy, background: `radial-gradient(circle, ${SCENES[scene].accent} 0%, transparent 68%)` }}
          animate={{ opacity: hover ? 0.5 : 0 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none absolute -left-28 -top-28 z-10 h-56 w-56 rounded-full blur-2xl"
        />
      )}

      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" fill="none">
        <defs>
          <linearGradient id="hs-edge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={CORAL} />
            <stop offset="100%" stopColor={VIOLET} />
          </linearGradient>
          <radialGradient id="hs-coral">
            <stop offset="0%" stopColor="oklch(0.78 0.17 35)" />
            <stop offset="100%" stopColor="oklch(0.66 0.19 32)" />
          </radialGradient>
          <radialGradient id="hs-violet">
            <stop offset="0%" stopColor="oklch(0.7 0.19 288)" />
            <stop offset="100%" stopColor="oklch(0.58 0.21 286)" />
          </radialGradient>
        </defs>

        <motion.g style={prefersReduced ? undefined : { x: groupX, y: groupY }}>
          <AnimatePresence>
            <motion.g
              key={scene}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.7, ease: easeOutExpo }}
              style={{ transformOrigin: `${W / 2}px ${H / 2}px` }}
            >
              {scene === 0 && <FlowField reduced={!!prefersReduced} />}
              {scene === 1 && <LossLandscape hover={hover} reduced={!!prefersReduced} />}
              {scene === 2 && <NeuralNet hover={hover} reduced={!!prefersReduced} />}
              {scene === 3 && <DecisionBoundary px={px} py={py} reduced={!!prefersReduced} />}
            </motion.g>
          </AnimatePresence>

          {/* shared cursor target ring */}
          {!prefersReduced && (
            <motion.circle
              cx={px}
              cy={py}
              r={18}
              stroke={SCENES[scene].accent}
              strokeWidth={1.5}
              animate={{ opacity: hover ? 0.6 : 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.g>
      </svg>

      {/* scene indicator */}
      <div className="pointer-events-auto absolute -bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
        <AnimatePresence mode="wait">
          <motion.span
            key={scene}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-xs text-faint"
          >
            {SCENES[scene].name}
          </motion.span>
        </AnimatePresence>
        <span className="flex items-center gap-1.5">
          {SCENES.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setScene(i)}
              aria-label={`Show ${s.name}`}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === scene ? 22 : 8,
                background: i === scene ? s.accent : "var(--color-border)",
              }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

/* ---- scene 0: gradient flow field -------------------------------------- */
function FlowField({ reduced }: { reduced: boolean }) {
  const particles = useMemo(() => {
    const r = seeded(7);
    return Array.from({ length: 30 }, () => {
      const startX = r() * W;
      const dur = 6 + r() * 6;
      const drift = (r() - 0.5) * 140;
      const size = 1.4 + r() * 2.4;
      return {
        startX,
        dur,
        drift,
        size,
        delay: -r() * dur,
        hue: startX / W,
      };
    });
  }, []);

  if (reduced) {
    return (
      <g>
        {particles.map((p, i) => (
          <circle key={i} cx={p.startX} cy={(i / particles.length) * H} r={p.size} fill={hueAt(p.hue)} opacity={0.6} />
        ))}
      </g>
    );
  }

  return (
    <g>
      {particles.map((p, i) => (
        <motion.circle
          key={i}
          r={p.size}
          fill={hueAt(p.hue)}
          initial={{ cx: p.startX, cy: -20, opacity: 0 }}
          animate={{
            cx: [p.startX, p.startX + p.drift * 0.5, p.startX + p.drift],
            cy: [-20, H / 2, H + 20],
            opacity: [0, 0.9, 0],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </g>
  );
}

/* ---- scene 1: loss landscape (contours + spiral descent) --------------- */
function LossLandscape({ hover, reduced }: { hover: boolean; reduced: boolean }) {
  const cx = 240;
  const cy = 190;
  const rings = [150, 120, 92, 66, 42, 22];
  const spiral = useMemo(() => {
    const steps = 200;
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const ang = t * 3.2 * Math.PI * 2;
      const rad = 150 * (1 - t);
      const x = cx + Math.cos(ang) * rad * 1.3;
      const y = cy + Math.sin(ang) * rad * 0.78;
      d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
    }
    return d.trim();
  }, []);

  return (
    <g>
      {rings.map((r, i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={r * 1.3}
          ry={r * 0.78}
          stroke={hueAt(1 - i / rings.length)}
          strokeOpacity={0.28}
          strokeWidth={1}
        />
      ))}
      <circle cx={cx} cy={cy} r={4} fill={CORAL} />

      {!reduced && (
        <>
          <motion.path d={spiral} stroke={CORAL} strokeOpacity={0.18} strokeWidth={1.5} strokeDasharray="2 4" />
          <motion.circle
            r={7}
            fill="url(#hs-coral)"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: hover ? 5 : 8, repeat: Infinity, ease: "easeInOut" }}
            style={{ offsetPath: `path('${spiral}')` }}
          />
        </>
      )}
    </g>
  );
}

/* ---- scene 2: clean neural net (curved edges + traveling pulse) -------- */
function NeuralNet({ hover, reduced }: { hover: boolean; reduced: boolean }) {
  const { nodes, edges, pulsePaths } = useMemo(() => {
    const xs = [110, 240, 370];
    const counts = [4, 5, 3];
    const nodes: { x: number; y: number; layer: number }[] = [];
    counts.forEach((c, l) => {
      for (let i = 0; i < c; i++) {
        const y = 80 + (i * (H - 160)) / (c - 1);
        nodes.push({ x: xs[l], y, layer: l });
      }
    });
    const seg = (a: { x: number; y: number }, b: { x: number; y: number }) =>
      `M${a.x} ${a.y} C ${(a.x + b.x) / 2} ${a.y}, ${(a.x + b.x) / 2} ${b.y}, ${b.x} ${b.y}`;

    const edges: string[] = [];
    for (let l = 0; l < 2; l++) {
      const from = nodes.filter((n) => n.layer === l);
      const to = nodes.filter((n) => n.layer === l + 1);
      from.forEach((a) => to.forEach((b) => edges.push(seg(a, b))));
    }

    // two highlighted signal routes (one node per layer)
    const route = (i0: number, i1: number, i2: number) => {
      const l0 = nodes.filter((n) => n.layer === 0)[i0];
      const l1 = nodes.filter((n) => n.layer === 1)[i1];
      const l2 = nodes.filter((n) => n.layer === 2)[i2];
      return `${seg(l0, l1)} ${seg(l1, l2)}`;
    };
    const pulsePaths = [route(0, 2, 0), route(3, 1, 2)];
    return { nodes, edges, pulsePaths };
  }, []);

  return (
    <g>
      {edges.map((d, i) => (
        <path key={i} d={d} stroke="url(#hs-edge)" strokeOpacity={0.16} strokeWidth={1} />
      ))}

      {!reduced &&
        pulsePaths.map((d, i) => (
          <g key={`p${i}`}>
            <path d={d} stroke="url(#hs-edge)" strokeOpacity={0.45} strokeWidth={1.5} />
            <motion.circle
              r={5}
              fill={CORAL}
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
              transition={{
                duration: hover ? 1.4 : 2.6,
                delay: i * 0.7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ offsetPath: `path('${d}')` }}
            />
          </g>
        ))}

      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={n.layer === 1 ? 6 : 8}
          fill={n.layer % 2 === 0 ? "url(#hs-coral)" : "url(#hs-violet)"}
          animate={reduced ? undefined : { scale: hover ? [1, 1.18, 1] : [0.9, 1.05, 0.9] }}
          transition={{ duration: hover ? 1.2 : 3, delay: (i % 5) * 0.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `${n.x}px ${n.y}px` }}
        />
      ))}
    </g>
  );
}

/* ---- scene 3: decision boundary that bends toward the cursor ----------- */
function DecisionBoundary({
  px,
  py,
  reduced,
}: {
  px: MotionValue<number>;
  py: MotionValue<number>;
  reduced: boolean;
}) {
  const { coral, violet } = useMemo(() => {
    const r = seeded(19);
    const cluster = (cxc: number) =>
      Array.from({ length: 11 }, () => ({
        x: cxc + (r() - 0.5) * 130,
        y: 60 + r() * (H - 120),
      }));
    return { coral: cluster(140), violet: cluster(340) };
  }, []);

  const cpx = useTransform(px, [0, W], [200, 280]);
  const cpy = useTransform(py, [0, H], [120, 260]);
  const d = useMotionTemplate`M 240 20 Q ${cpx} ${cpy} 240 360`;

  return (
    <g>
      {coral.map((p, i) => (
        <circle key={`c${i}`} cx={p.x} cy={p.y} r={5} fill="url(#hs-coral)" />
      ))}
      {violet.map((p, i) => (
        <rect
          key={`v${i}`}
          x={p.x - 5}
          y={p.y - 5}
          width={10}
          height={10}
          rx={2}
          fill="url(#hs-violet)"
          transform={`rotate(45 ${p.x} ${p.y})`}
        />
      ))}
      {reduced ? (
        <path d="M 240 20 Q 240 190 240 360" stroke="url(#hs-edge)" strokeWidth={2.5} strokeLinecap="round" />
      ) : (
        <motion.path d={d} stroke="url(#hs-edge)" strokeWidth={2.5} strokeLinecap="round" />
      )}
    </g>
  );
}
