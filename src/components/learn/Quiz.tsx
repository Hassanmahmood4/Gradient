"use client";

import { useState, useTransition } from "react";
import { Check, X, Trophy, ArrowClockwise, Lock } from "@phosphor-icons/react";
import { SignInButton } from "@clerk/nextjs";
import type { ClientQuestion, GradeResult } from "@/lib/quiz-types";
import { gradeQuiz } from "@/app/learn/actions";
import { useProgress } from "@/components/learn/progress";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

export function Quiz({
  slug,
  questions,
  label = "module",
}: {
  slug: string;
  questions: ClientQuestion[];
  label?: string;
}) {
  const { markComplete, isDone, loaded } = useProgress();
  const [picked, setPicked] = useState<(number | null)[]>(
    () => questions.map(() => null),
  );
  const [result, setResult] = useState<GradeResult | null>(null);
  const [pending, startTransition] = useTransition();

  const submitted = result?.ok === true;
  const correctAnswers = result?.ok ? result.correctAnswers : null;
  const allAnswered = picked.every((p) => p !== null);

  function choose(qi: number, oi: number) {
    if (submitted) return;
    setPicked((prev) => {
      const next = [...prev];
      next[qi] = oi;
      return next;
    });
  }

  function check() {
    startTransition(async () => {
      const res = await gradeQuiz(slug, picked);
      setResult(res);
      if (res.ok) {
        // Completing the quiz (any submission) ticks the module done.
        markComplete(slug);
        // Let the points badge in the topbar update live.
        window.dispatchEvent(
          new CustomEvent("gradient:points", { detail: res.totalPoints }),
        );
      }
    });
  }

  function retry() {
    setResult(null);
    setPicked(questions.map(() => null));
  }

  const alreadyDone = loaded && isDone(slug);
  const authNeeded = result?.ok === false && result.reason === "auth";
  const errored = result?.ok === false && result.reason === "error";

  return (
    <section className="mt-12 border-t border-border-soft pt-8">
      <div className="flex items-center gap-2">
        <Trophy size={16} weight="fill" className="text-coral" />
        <h2 className="font-display text-lg font-semibold">
          Check your understanding
        </h2>
      </div>
      <p className="mt-1 text-sm text-muted">
        Answer all {questions.length} correctly to complete this {label} — worth
        10 points per correct answer.
        {alreadyDone ? (
          <span className="ml-1 text-success">You’ve already passed this one.</span>
        ) : null}
      </p>

      <div className="mt-6 space-y-5">
        {questions.map((qn, qi) => {
          const sel = picked[qi];
          return (
            <div
              key={qi}
              className="rounded-xl border border-border-soft bg-surface/40 p-4"
            >
              <p className="font-medium text-text">
                <span className="mr-2 font-mono text-sm text-faint">
                  {qi + 1}.
                </span>
                {qn.q}
              </p>
              {qn.code ? (
                <pre className="mt-3 overflow-x-auto rounded-lg border border-border-soft bg-bg/60 p-3 font-mono text-xs leading-relaxed text-text">
                  <code>{qn.code}</code>
                </pre>
              ) : null}
              <div className="mt-3 grid gap-2">
                {qn.options.map((opt, oi) => {
                  const chosen = sel === oi;
                  const isAnswer = correctAnswers?.[qi] === oi;
                  const showCorrect = submitted && isAnswer;
                  const showWrong = submitted && chosen && !isAnswer;
                  return (
                    <button
                      key={oi}
                      onClick={() => choose(qi, oi)}
                      disabled={submitted || pending}
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

      {/* auth gate */}
      {authNeeded ? (
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-coral/30 bg-coral/5 px-4 py-3 text-sm">
          <Lock size={16} className="text-coral" />
          <span className="text-text">Sign in to check your answers and earn points.</span>
          <SignInButton mode="modal">
            <button className="ml-auto rounded-full bg-coral px-4 py-2 text-sm font-semibold text-bg transition-colors hover:bg-coral-strong">
              Sign in
            </button>
          </SignInButton>
        </div>
      ) : null}

      {errored ? (
        <p className="mt-6 text-sm text-danger">
          {result?.ok === false && result.reason === "error"
            ? result.message
            : "Something went wrong."}
        </p>
      ) : null}

      {/* result + actions */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        {!submitted ? (
          <button
            onClick={check}
            disabled={!allAnswered || pending}
            className="inline-flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-coral-strong disabled:opacity-40"
          >
            {pending ? (
              <>
                <Spinner size={15} /> Checking…
              </>
            ) : (
              "Check answers"
            )}
          </button>
        ) : (
          <button
            onClick={retry}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-5 py-2.5 text-sm font-semibold text-text transition-colors hover:border-coral/50"
          >
            <ArrowClockwise size={15} weight="bold" /> Try again
          </button>
        )}

        {submitted && result?.ok ? (
          result.passed ? (
            <span className="inline-flex items-center gap-2 text-sm font-medium text-success">
              <Trophy size={16} weight="fill" /> All correct — {label} completed!
              <span className="text-muted">+{result.pointsForQuiz} pts</span>
            </span>
          ) : (
            <span className="text-sm text-muted">
              {result.correctCount}/{result.total} correct ({result.pointsForQuiz}{" "}
              pts banked). Review and try again.
            </span>
          )
        ) : null}
      </div>
    </section>
  );
}
