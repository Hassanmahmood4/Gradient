"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MagnifyingGlass, Check, Flask, Trophy, Terminal } from "@phosphor-icons/react";
import { curriculum, allTopics } from "@/lib/curriculum";
import { useProgress } from "@/components/learn/progress";
import { cn } from "@/lib/utils";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { isDone, done, loaded } = useProgress();
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return curriculum;
    return curriculum
      .map((c) => ({
        ...c,
        topics: c.topics.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.summary.toLowerCase().includes(q),
        ),
      }))
      .filter((c) => c.topics.length > 0);
  }, [q]);

  const completed = loaded ? done.size : 0;
  const pct = Math.round((completed / allTopics.length) * 100);

  return (
    <div className="flex h-full flex-col">
      {/* progress header */}
      <div className="px-4 pb-3 pt-4">
        <div className="flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-widest text-faint">
          <span>Progress</span>
          <span className="tabular-nums">
            {completed}/{allTopics.length}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-coral transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* search */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-2 rounded-lg border border-border-soft bg-bg/40 px-3 py-2">
          <MagnifyingGlass size={14} className="text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics…"
            className="w-full bg-transparent text-sm text-text placeholder:text-faint focus:outline-none"
          />
        </div>
      </div>

      {/* nav */}
      <nav className="flex-1 overflow-y-auto px-2 pb-6">
        {filtered.map((cat) => (
          <div key={cat.id} className="mt-3">
            <p className="px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-widest text-faint">
              {cat.title}
            </p>
            {cat.topics.map((t) => {
              const href = `/learn/${t.slug}`;
              const active = pathname === href;
              const complete = isDone(t.slug);
              return (
                <Link
                  key={t.slug}
                  href={href}
                  onClick={onNavigate}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-surface-2 text-text"
                      : "text-muted hover:bg-surface-2/50 hover:text-text",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                      complete
                        ? "border-success bg-success/20 text-success"
                        : active
                          ? "border-coral text-coral"
                          : "border-border text-transparent",
                    )}
                  >
                    {complete ? <Check size={10} weight="bold" /> : null}
                  </span>
                  <span className="flex-1 leading-tight">{t.title}</span>
                  {t.lab ? (
                    <Flask
                      size={13}
                      className={cn(
                        "shrink-0",
                        active ? "text-coral" : "text-faint group-hover:text-coral",
                      )}
                    />
                  ) : null}
                </Link>
              );
            })}
          </div>
        ))}
        {filtered.length === 0 ? (
          <p className="px-3 py-6 text-sm text-faint">No topics match “{query}”.</p>
        ) : null}

        {!q ? (
          <div className="mt-4 border-t border-border-soft pt-3">
            <Link
              href="/learn/playground"
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === "/learn/playground"
                  ? "bg-surface-2 text-text"
                  : "text-muted hover:bg-surface-2/50 hover:text-text",
              )}
            >
              <Terminal
                size={16}
                weight="fill"
                className={cn(
                  "shrink-0",
                  pathname === "/learn/playground"
                    ? "text-coral"
                    : "text-faint group-hover:text-coral",
                )}
              />
              <span className="flex-1 leading-tight font-medium">Playground</span>
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-faint">
                Labs
              </span>
            </Link>
            <Link
              href="/learn/final-exam"
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === "/learn/final-exam"
                  ? "bg-surface-2 text-text"
                  : "text-muted hover:bg-surface-2/50 hover:text-text",
              )}
            >
              <Trophy
                size={16}
                weight="fill"
                className={cn(
                  "shrink-0",
                  pathname === "/learn/final-exam"
                    ? "text-coral"
                    : "text-faint group-hover:text-coral",
                )}
              />
              <span className="flex-1 leading-tight font-medium">Final Exam</span>
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-faint">
                15 Q
              </span>
            </Link>
          </div>
        ) : null}
      </nav>
    </div>
  );
}
