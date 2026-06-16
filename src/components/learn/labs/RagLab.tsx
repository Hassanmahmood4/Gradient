"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Chunk = { id: string; text: string };

const CORPUS: Chunk[] = [
  { id: "c1", text: "Gradient descent updates weights by stepping against the gradient of the loss." },
  { id: "c2", text: "The learning rate sets the size of each gradient descent step." },
  { id: "c3", text: "Embeddings map text to vectors so similar meanings sit close together." },
  { id: "c4", text: "A vector database finds nearest embeddings with approximate nearest-neighbor search." },
  { id: "c5", text: "Overfitting means a model memorizes the training data and fails to generalize." },
  { id: "c6", text: "Regularization adds a penalty on large weights to reduce overfitting." },
];

const QUESTIONS = [
  {
    q: "What does the learning rate control?",
    a: "The learning rate controls how big each gradient-descent step is — too large overshoots, too small crawls.",
  },
  {
    q: "How does a vector database find results?",
    a: "It uses approximate nearest-neighbor search over embeddings to return the closest vectors quickly.",
  },
  {
    q: "How do we reduce overfitting?",
    a: "Regularization penalizes large weights, which curbs the memorization that causes overfitting.",
  },
];

const STOP = new Set(
  "the a an of to and is are by how do does what with on in for it its".split(" "),
);
function tokens(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z\s-]/g, "")
    .split(/\s+/)
    .filter((w) => w && !STOP.has(w));
}
function score(q: string, c: string) {
  const qt = new Set(tokens(q));
  const ct = tokens(c);
  let n = 0;
  for (const w of ct) if (qt.has(w)) n++;
  return ct.length ? n / Math.sqrt(ct.length) : 0;
}

export function RagLab() {
  const [qi, setQi] = useState(0);
  const question = QUESTIONS[qi];

  const ranked = useMemo(
    () =>
      CORPUS.map((c) => ({ c, s: score(question.q, c.text) })).sort((a, b) => b.s - a.s),
    [question.q],
  );
  const top = ranked.slice(0, 3).filter((r) => r.s > 0);
  const topIds = new Set(top.map((r) => r.c.id));
  const prompt = `Answer using only this context:\n${top
    .map((r) => "- " + r.c.text)
    .join("\n")}\n\nQ: ${question.q}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {QUESTIONS.map((q, i) => (
          <button
            key={i}
            onClick={() => setQi(i)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition-colors",
              i === qi
                ? "border-coral bg-coral/10 text-text"
                : "border-border-soft text-muted hover:text-text",
            )}
          >
            {q.q}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* 1 — retrieve */}
        <div className="rounded-xl border border-border-soft bg-bg/50 p-3">
          <div className="mb-2 font-mono text-[0.62rem] uppercase tracking-widest text-faint">
            1 · Retrieve
          </div>
          <div className="space-y-1.5">
            {ranked.map(({ c, s }) => (
              <div
                key={c.id}
                className={cn(
                  "rounded-lg border px-2.5 py-2 text-xs leading-snug transition-colors",
                  topIds.has(c.id)
                    ? "border-coral/50 bg-coral/5 text-text"
                    : "border-border-soft text-faint",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[0.6rem] text-faint">{c.id}</span>
                  <span className="font-mono text-[0.6rem] tabular-nums text-faint">
                    {s.toFixed(2)}
                  </span>
                </div>
                <p className="mt-1">{c.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2 — augment */}
        <div className="rounded-xl border border-border-soft bg-bg/50 p-3">
          <div className="mb-2 font-mono text-[0.62rem] uppercase tracking-widest text-faint">
            2 · Augment
          </div>
          <pre className="whitespace-pre-wrap rounded-lg border border-border-soft bg-bg/60 p-2.5 font-mono text-[0.66rem] leading-relaxed text-muted">
            {prompt}
          </pre>
        </div>

        {/* 3 — generate */}
        <div className="rounded-xl border border-border-soft bg-bg/50 p-3">
          <div className="mb-2 font-mono text-[0.62rem] uppercase tracking-widest text-faint">
            3 · Generate
          </div>
          <div className="rounded-lg border border-violet/40 bg-violet/5 p-2.5 text-xs leading-relaxed text-text">
            {question.a}
          </div>
          <p className="mt-2 text-[0.7rem] leading-relaxed text-faint">
            The answer is grounded in the retrieved chunks. Change the question and
            watch retrieval pull different context into the prompt.
          </p>
        </div>
      </div>
    </div>
  );
}
