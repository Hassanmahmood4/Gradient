"use client";

import { cn } from "@/lib/utils";

/** A real, draggable slider styled to the coral theme. */
export function RangeControl({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  unit,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  unit?: string;
}) {
  const display = format ? format(value) : String(value);
  return (
    <label className="block rounded-xl border border-border-soft bg-surface/50 p-3">
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="text-muted">{label}</span>
        <span className="tabular-nums text-text">
          {display}
          {unit ? <span className="text-faint"> {unit}</span> : null}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-2 accent-coral
          [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-coral [&::-webkit-slider-thumb]:shadow
          [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-coral"
      />
    </label>
  );
}

/** A small labelled metric readout. */
export function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "coral" | "violet";
}) {
  return (
    <div className="rounded-xl border border-border-soft bg-bg/40 px-3 py-2.5">
      <div className="font-mono text-[0.65rem] uppercase tracking-widest text-faint">
        {label}
      </div>
      <div
        className={cn(
          "mt-1 font-display text-lg font-semibold tabular-nums",
          accent === "coral" && "text-coral",
          accent === "violet" && "text-violet",
        )}
      >
        {value}
      </div>
    </div>
  );
}

/** A segmented control for picking between a few options. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-border-soft bg-bg/40 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
            value === o.value
              ? "bg-coral text-bg"
              : "text-muted hover:text-text",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Coral pill action button used inside labs (Run / Fit / Step …). */
export function LabButton({
  children,
  onClick,
  variant = "primary",
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-transform active:scale-95 disabled:opacity-40 disabled:active:scale-100",
        variant === "primary"
          ? "bg-coral text-bg hover:bg-coral-strong"
          : "border border-border bg-surface-2 text-text hover:border-coral/50",
      )}
    >
      {children}
    </button>
  );
}
