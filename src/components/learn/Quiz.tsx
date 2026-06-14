"use client";

import { useState } from "react";
import { Check, X, Trophy, ArrowClockwise } from "@phosphor-icons/react";
import type { Question } from "@/lib/quizzes";
import { useProgress } from "@/components/learn/progress";
import { cn } from "@/lib/utils";

export function Quiz({
  slug,
  questions,
}: {
  slug: string;
  questions: Question[];
}) {
  const { markComplete, isDone, loaded } = useProgress();
  const [picked, setPicked] = useState<(number | null)[]>(
    () => questions.map(() => null),
  );
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = picked.every((p) => p !== null);
  const correctCount = questions.reduce(
    (n, q, i) => n + (picked[i] === q.answer ? 1 : 0),
    0,
  );
  const allCorrect = correctCount === questions.length;

  function choose(qi: number, oi: number) {
    if (submitted) return;
    setPicked((prev) => {
      const next = [...prev];
      next[qi] = oi;
      return next;
    });
  }

  function check() {
    setSubmitted(true);
    if (correctCount === questions.length) markComplete(slug);
  }

  function retry() {
    setSubmitted(false);
    setPicked(questions.map(() => null));
  }

  const alreadyDone = loaded && isDone(slug);

  return (
    <section className="mt-12 border-t border-border-soft pt-8">
      <div className="flex items-center gap-2">
        <Trophy size={16} weight="fill" className="text-coral" />
        <h2 className="font-display text-lg font-semibold">Check your understanding</h2>
      </div>
      <p className="mt-1 text-sm text-muted">
        Answer all {questions.length} correctly to complete this module.
        {alreadyDone ? (
          <span className="ml-1 text-success">You’ve already passed this one.</span>
        ) : null}
      </p>

      <div className="mt-6 space-y-5">
        {questions.map((q, qi) => {
          const sel = picked[qi];
          return (
            <div
              key={qi}
              className="rounded-xl border border-border-soft bg-surface/40 p-4"
            >
              <p className="font-medium text-text">
                <span className="mr-2 font-mono text-sm text-faint">{qi + 1}.</span>
                {q.q}
              </p>
              {q.code ? (
                <pre className="mt-3 overflow-x-auto rounded-lg border border-border-soft bg-bg/60 p-3 font-mono text-xs leading-relaxed text-text">
                  <code>{q.code}</code>
                </pre>
              ) : null}
              <div className="mt-3 grid gap-2">
                {q.options.map((opt, oi) => {
                  const chosen = sel === oi;
                  const isAnswer = oi === q.answer;
                  const showCorrect = submitted && isAnswer;
                  const showWrong = submitted && chosen && !isAnswer;
                  return (
                    <button
                      key={oi}
                      onClick={() => choose(qi, oi)}
                      disabled={submitted}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                        showCorrect
                          ? "border-success/50 bg-success/10 text-text"
                          : showWrong
                            ? "border-danger/50 bg-danger/10 text-text"
                            : chosen
                              ? "border-coral/60 bg-coral/5 text-text"
                              : "border-border-soft text-muted hover:border-coral/40 hover:text-text",
                        submitted && "cursor-default",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[0.7rem]",
                          showCorrect
                            ? "border-success bg-success/20 text-success"
                            : showWrong
                              ? "border-danger bg-danger/20 text-danger"
                              : chosen
                                ? "border-coral text-coral"
                                : "border-border text-faint",
                        )}
                      >
                        {showCorrect ? (
                          <Check size={11} weight="bold" />
                        ) : showWrong ? (
                          <X size={11} weight="bold" />
                        ) : (
                          String.fromCharCode(65 + oi)
                        )}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* result + actions */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        {!submitted ? (
          <button
            onClick={check}
            disabled={!allAnswered}
            className="inline-flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-coral-strong disabled:opacity-40"
          >
            Check answers
          </button>
        ) : (
          <button
            onClick={retry}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-5 py-2.5 text-sm font-semibold text-text transition-colors hover:border-coral/50"
          >
            <ArrowClockwise size={15} weight="bold" /> Try again
          </button>
        )}

        {submitted ? (
          allCorrect ? (
            <span className="inline-flex items-center gap-2 text-sm font-medium text-success">
              <Trophy size={16} weight="fill" /> All correct — module completed!
            </span>
          ) : (
            <span className="text-sm text-muted">
              {correctCount}/{questions.length} correct. Review and try again.
            </span>
          )
        ) : null}
      </div>
    </section>
  );
}
