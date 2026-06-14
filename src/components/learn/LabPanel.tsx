"use client";

import { useState } from "react";
import { ChartLine, Code } from "@phosphor-icons/react";
import { LabMount } from "@/components/learn/LabMount";
import type { LabCode, LabKey } from "@/lib/curriculum";
import { cn } from "@/lib/utils";

/**
 * Wraps a lab with an optional Visualize / Code toggle so learners can see the
 * exact algorithm the visualization animates. Falls back to the bare lab when a
 * topic has no `labCode`.
 */
export function LabPanel({ labKey, code }: { labKey: LabKey; code?: LabCode }) {
  const [tab, setTab] = useState<"viz" | "code">("viz");

  if (!code) return <LabMount labKey={labKey} />;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Lab view"
        className="mb-3 inline-flex gap-1 rounded-lg border border-border-soft p-1"
      >
        {(["viz", "code"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              tab === t
                ? "bg-surface-2 text-text"
                : "text-muted hover:text-text",
            )}
          >
            {t === "viz" ? <ChartLine size={14} /> : <Code size={14} />}
            {t === "viz" ? "Visualize" : "Code"}
          </button>
        ))}
      </div>

      {/* Keep the lab mounted so its state survives a tab switch; just hide it. */}
      <div className={tab === "viz" ? "" : "hidden"}>
        <LabMount labKey={labKey} />
      </div>

      {tab === "code" ? (
        <figure>
          <pre className="overflow-x-auto rounded-xl border border-border-soft bg-bg/60 p-4 font-mono text-xs leading-relaxed text-text">
            <code>{code.source}</code>
          </pre>
          {code.caption ? (
            <figcaption className="mt-2 text-xs text-faint">
              {code.caption}
            </figcaption>
          ) : null}
        </figure>
      ) : null}
    </div>
  );
}
