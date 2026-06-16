"use client";

import { useState } from "react";
import { Segmented } from "@/components/learn/controls";

type Task = "sentiment" | "ner" | "summarize";

const TASK_PIPE: Record<Task, string> = {
  sentiment: "sentiment-analysis",
  ner: "ner",
  summarize: "summarization",
};

function Sentiment() {
  const score = 0.991;
  return (
    <div className="space-y-3">
      <p className="rounded-lg border border-border-soft bg-bg/60 p-3 text-sm text-text">
        “I love how visual this course is!”
      </p>
      <div className="rounded-lg border border-success/40 bg-success/5 p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono font-semibold text-success">POSITIVE</span>
          <span className="font-mono tabular-nums text-faint">{score.toFixed(3)}</span>
        </div>
        <span className="mt-2 block h-2 overflow-hidden rounded-full bg-surface-2">
          <span
            className="block h-full rounded-full bg-success"
            style={{ width: `${score * 100}%` }}
          />
        </span>
      </div>
    </div>
  );
}

function Ner() {
  // [text, entity-label | null]
  const spans: [string, string | null][] = [
    ["", null],
    ["Hugging Face", "ORG"],
    [" was founded in ", null],
    ["New York", "LOC"],
    [" by ", null],
    ["Clément Delangue", "PER"],
    [".", null],
  ];
  const color: Record<string, string> = {
    ORG: "text-coral border-coral/40 bg-coral/10",
    LOC: "text-violet border-violet/40 bg-violet/10",
    PER: "text-success border-success/40 bg-success/10",
  };
  return (
    <p className="rounded-lg border border-border-soft bg-bg/60 p-3 text-sm leading-relaxed text-muted">
      {spans.map(([t, label], i) =>
        label ? (
          <span
            key={i}
            className={`mx-0.5 rounded border px-1 py-0.5 text-xs font-medium ${color[label]}`}
          >
            {t}
            <span className="ml-1 font-mono text-[0.6rem] opacity-70">{label}</span>
          </span>
        ) : (
          <span key={i}>{t}</span>
        ),
      )}
    </p>
  );
}

function Summarize() {
  return (
    <div className="space-y-3">
      <p className="rounded-lg border border-border-soft bg-bg/60 p-3 text-xs leading-relaxed text-faint">
        Gradient descent is an optimization algorithm that iteratively adjusts a
        model’s parameters in the direction that most reduces the loss. The size of
        each step is set by the learning rate, the single most important
        hyperparameter to tune.
      </p>
      <div className="rounded-lg border border-coral/40 bg-coral/5 p-3 text-sm leading-relaxed text-text">
        Gradient descent tunes parameters step by step to minimize loss; the
        learning rate controls the step size.
      </div>
    </div>
  );
}

export function HuggingFaceLab() {
  const [task, setTask] = useState<Task>("sentiment");

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[1fr_240px]">
      <div className="space-y-3 rounded-xl border border-border-soft bg-bg/50 p-4">
        <div className="font-mono text-[0.72rem] text-faint">
          pipeline(&quot;{TASK_PIPE[task]}&quot;)
        </div>
        {task === "sentiment" && <Sentiment />}
        {task === "ner" && <Ner />}
        {task === "summarize" && <Summarize />}
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <div className="mb-1.5 font-mono text-[0.62rem] uppercase tracking-widest text-faint">
            task
          </div>
          <Segmented
            options={[
              { value: "sentiment", label: "Sentiment" },
              { value: "ner", label: "NER" },
              { value: "summarize", label: "Summarize" },
            ]}
            value={task}
            onChange={setTask}
          />
        </div>
        <p className="text-xs leading-relaxed text-faint">
          One pipeline() call loads a pretrained model for a task and runs it. These
          outputs are illustrative — in code you’d get the real model’s prediction.
        </p>
      </div>
    </div>
  );
}
