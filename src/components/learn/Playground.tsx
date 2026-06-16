"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChartLine, Code, ArrowSquareOut, Flask } from "@phosphor-icons/react";
import { LabMount } from "@/components/learn/LabMount";
import { CodeBlock } from "@/components/learn/CodeBlock";
import type { LabCode, LabKey } from "@/lib/curriculum";
import { cn } from "@/lib/utils";

export type PlaygroundItem = {
  slug: string;
  title: string;
  category: string;
  lab?: LabKey;
  code?: LabCode;
};

const LANG_EXT: Record<string, string> = {
  python: "py",
  py: "py",
  javascript: "js",
  typescript: "ts",
};

function filename(item: PlaygroundItem): string {
  const ext = item.code ? (LANG_EXT[item.code.lang] ?? item.code.lang) : "py";
  return `${item.slug.replace(/-/g, "_")}.${ext}`;
}

/**
 * Curriculum-wide playground: an explorer of every lab on the left, with the
 * selected lab's live visualization and its source side by side. Think of it
 * as one console where every moving idea in the course lives together.
 */
export function Playground({ items }: { items: PlaygroundItem[] }) {
  const [activeSlug, setActiveSlug] = useState(items[0]?.slug ?? "");
  const active =
    items.find((i) => i.slug === activeSlug) ?? items[0];

  // Group items by category for the explorer, preserving curriculum order.
  const groups = useMemo(() => {
    const order: string[] = [];
    const byCat = new Map<string, PlaygroundItem[]>();
    for (const it of items) {
      if (!byCat.has(it.category)) {
        byCat.set(it.category, []);
        order.push(it.category);
      }
      byCat.get(it.category)!.push(it);
    }
    return order.map((category) => ({ category, items: byCat.get(category)! }));
  }, [items]);

  if (!active) return null;

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
      {/* explorer */}
      <aside className="rounded-2xl border border-border-soft bg-surface/30 p-2 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto">
        <p className="px-3 py-2 font-mono text-[0.62rem] uppercase tracking-widest text-faint">
          {items.length} labs
        </p>
        {groups.map((g) => (
          <div key={g.category} className="mt-1">
            <p className="px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-widest text-faint">
              {g.category}
            </p>
            {g.items.map((it) => {
              const selected = it.slug === active.slug;
              return (
                <button
                  key={it.slug}
                  onClick={() => setActiveSlug(it.slug)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    selected
                      ? "bg-surface-2 text-text"
                      : "text-muted hover:bg-surface-2/50 hover:text-text",
                  )}
                >
                  {it.lab ? (
                    <ChartLine
                      size={14}
                      className={cn("shrink-0", selected ? "text-coral" : "text-faint")}
                    />
                  ) : (
                    <Code
                      size={14}
                      className={cn("shrink-0", selected ? "text-coral" : "text-faint")}
                    />
                  )}
                  <span className="leading-tight">{it.title}</span>
                </button>
              );
            })}
          </div>
        ))}
      </aside>

      {/* main: visualization + source */}
      <div className="min-w-0 space-y-4">
        {/* visualization / output */}
        {active.lab ? (
          <section className="overflow-hidden rounded-2xl border border-border-soft bg-surface/30">
            <header className="flex items-center justify-between gap-3 border-b border-border-soft bg-surface-2/40 px-4 py-2.5">
              <span className="inline-flex items-center gap-2 font-mono text-xs text-muted">
                <ChartLine size={14} className="text-coral" />
                Visualization
              </span>
              <Link
                href={`/learn/${active.slug}`}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted transition-colors hover:bg-surface-2 hover:text-text"
              >
                Open lesson <ArrowSquareOut size={13} />
              </Link>
            </header>
            <div className="p-4 sm:p-5">
              {/* key remounts the lab on switch so each starts fresh */}
              <LabMount key={active.slug} labKey={active.lab} />
            </div>
          </section>
        ) : null}

        {/* source */}
        {active.code ? (
          <section className="overflow-hidden rounded-2xl border border-border bg-surface">
            <header className="flex items-center gap-1 border-b border-border-soft bg-surface-2/40 px-2 pt-2">
              <span className="inline-flex items-center gap-2 rounded-t-lg border border-b-0 border-border-soft bg-bg/60 px-3 py-2 font-mono text-xs text-text">
                <Code size={13} className="text-coral" />
                {filename(active)}
              </span>
            </header>
            <CodeBlock source={active.code.source} className="px-4 py-4" />
            {active.code.caption ? (
              <figcaption className="border-t border-border-soft px-5 py-3 text-xs text-faint">
                {active.code.caption}
              </figcaption>
            ) : null}
          </section>
        ) : (
          <section className="flex items-center gap-2 rounded-2xl border border-border-soft bg-surface/30 px-5 py-4 text-sm text-muted">
            <Flask size={16} className="text-faint" />
            This lab is interactive only — open the lesson for the full write-up.
          </section>
        )}
      </div>
    </div>
  );
}
