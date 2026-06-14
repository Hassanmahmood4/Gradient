import type { Block } from "@/lib/curriculum";

/** Renders the structured lesson blocks defined in the curriculum registry. */
export function LessonContent({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h":
            return (
              <h3
                key={i}
                className="font-display pt-2 text-lg font-semibold text-text"
              >
                {b.text}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="leading-relaxed text-muted">
                {b.text}
              </p>
            );
          case "list":
            return (
              <ul key={i} className="space-y-2">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-3 leading-relaxed text-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                    {it}
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="space-y-2">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-3 leading-relaxed text-muted">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-2 font-mono text-xs text-coral">
                      {j + 1}
                    </span>
                    {it}
                  </li>
                ))}
              </ol>
            );
          case "math":
            return (
              <div
                key={i}
                className="rounded-xl border border-border-soft bg-bg/40 px-4 py-3 text-center font-mono text-sm text-text"
              >
                {b.text}
              </div>
            );
          case "code":
            return (
              <pre
                key={i}
                className="overflow-x-auto rounded-xl border border-border-soft bg-bg/60 p-4 font-mono text-xs text-text"
              >
                <code>{b.text}</code>
              </pre>
            );
          case "callout":
            return (
              <div
                key={i}
                className="rounded-xl border border-coral/30 bg-coral/5 px-4 py-3 text-sm leading-relaxed text-text"
              >
                {b.text}
              </div>
            );
        }
      })}
    </div>
  );
}
