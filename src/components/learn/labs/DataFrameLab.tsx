"use client";

import { useMemo, useState } from "react";
import { Segmented } from "@/components/learn/controls";

type Row = { city: string; product: string; price: number };
type GroupCol = "city" | "product";
type Agg = "mean" | "sum" | "count";

const DATA: Row[] = [
  { city: "Lahore", product: "Book", price: 12 },
  { city: "Lahore", product: "Pen", price: 3 },
  { city: "Karachi", product: "Book", price: 14 },
  { city: "Karachi", product: "Lamp", price: 22 },
  { city: "Lahore", product: "Lamp", price: 20 },
  { city: "Karachi", product: "Pen", price: 4 },
];

const PALETTE = [
  "oklch(0.72 0.17 35)",
  "oklch(0.64 0.19 288)",
  "oklch(0.72 0.15 150)",
  "oklch(0.80 0.13 85)",
];

export function DataFrameLab() {
  const [by, setBy] = useState<GroupCol>("city");
  const [agg, setAgg] = useState<Agg>("mean");

  const keys = useMemo(() => Array.from(new Set(DATA.map((r) => r[by]))), [by]);
  const colorFor = (k: string) => PALETTE[keys.indexOf(k) % PALETTE.length];

  const groups = useMemo(() => {
    const m = new Map<string, number[]>();
    for (const r of DATA) {
      if (!m.has(r[by])) m.set(r[by], []);
      m.get(r[by])!.push(r.price);
    }
    return Array.from(m.entries()).map(([key, prices]) => ({
      key,
      value:
        agg === "count"
          ? prices.length
          : agg === "sum"
            ? prices.reduce((a, b) => a + b, 0)
            : prices.reduce((a, b) => a + b, 0) / prices.length,
    }));
  }, [by, agg]);

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[1fr_240px]">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border-soft bg-bg/50 p-3">
          <div className="mb-2 font-mono text-[0.62rem] uppercase tracking-widest text-faint">
            df
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-faint">
                <th className="py-1 text-left font-mono font-normal">city</th>
                <th className="py-1 text-left font-mono font-normal">product</th>
                <th className="py-1 text-right font-mono font-normal">price</th>
              </tr>
            </thead>
            <tbody>
              {DATA.map((r, i) => (
                <tr key={i} className="border-t border-border-soft">
                  <td
                    className="py-1.5 font-mono"
                    style={by === "city" ? { color: colorFor(r.city) } : undefined}
                  >
                    {r.city}
                  </td>
                  <td
                    className="py-1.5 font-mono"
                    style={by === "product" ? { color: colorFor(r.product) } : undefined}
                  >
                    {r.product}
                  </td>
                  <td className="py-1.5 text-right font-mono tabular-nums text-muted">
                    {r.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-border-soft bg-bg/50 p-3">
          <div className="mb-2 font-mono text-[0.62rem] uppercase tracking-widest text-faint">
            groupby(&quot;{by}&quot;).{agg}()
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-faint">
                <th className="py-1 text-left font-mono font-normal">{by}</th>
                <th className="py-1 text-right font-mono font-normal">price</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g.key} className="border-t border-border-soft">
                  <td className="py-1.5 font-mono" style={{ color: colorFor(g.key) }}>
                    {g.key}
                  </td>
                  <td className="py-1.5 text-right font-mono tabular-nums text-text">
                    {g.value.toFixed(agg === "mean" ? 1 : 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <div className="mb-1.5 font-mono text-[0.62rem] uppercase tracking-widest text-faint">
            group by
          </div>
          <Segmented
            options={[
              { value: "city", label: "city" },
              { value: "product", label: "product" },
            ]}
            value={by}
            onChange={setBy}
          />
        </div>
        <div>
          <div className="mb-1.5 font-mono text-[0.62rem] uppercase tracking-widest text-faint">
            aggregate
          </div>
          <Segmented
            options={[
              { value: "mean", label: "mean" },
              { value: "sum", label: "sum" },
              { value: "count", label: "count" },
            ]}
            value={agg}
            onChange={setAgg}
          />
        </div>
        <p className="text-xs leading-relaxed text-faint">
          groupby splits rows by a column, then an aggregation collapses each group
          to a single number. Colors show which rows fall into which group.
        </p>
      </div>
    </div>
  );
}
