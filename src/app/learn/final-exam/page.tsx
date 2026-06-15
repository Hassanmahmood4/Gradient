import Link from "next/link";
import type { Metadata } from "next";
import { Trophy, Lock, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { getMyStats } from "@/app/learn/actions";
import { getQuizForClient, FINAL_EXAM_SLUG } from "@/lib/quizzes";
import { Quiz } from "@/components/learn/Quiz";

export const metadata: Metadata = {
  title: "Final Exam — Gradient",
  description:
    "A 15-question capstone covering the whole machine learning curriculum.",
};

export default async function FinalExamPage() {
  const { userId } = await auth();
  const questions = getQuizForClient(FINAL_EXAM_SLUG) ?? [];

  return (
    <article className="mx-auto max-w-3xl">
      <div className="flex items-center gap-2 font-mono text-xs text-faint">
        <Link href="/learn" className="hover:text-text">
          Learn
        </Link>
        <span>/</span>
        <span className="text-muted">Final Exam</span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <Trophy size={28} weight="fill" className="text-coral" />
        <h1 className="font-display text-[length:var(--text-title)] font-bold">
          Final Exam
        </h1>
      </div>
      <p className="mt-2 max-w-xl text-muted">
        Fifteen questions spanning the entire curriculum. Ten points per correct
        answer — 150 on the line.
      </p>

      <div className="mt-8">
        {!userId ? (
          <SignedOutGate />
        ) : (
          <UnlockedOrLocked questions={questions} />
        )}
      </div>
    </article>
  );
}

function SignedOutGate() {
  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl border border-border-soft bg-surface/40 p-6">
      <div className="flex items-center gap-2 text-text">
        <Lock size={18} className="text-coral" />
        <span className="font-medium">Sign in to take the final exam</span>
      </div>
      <p className="text-sm text-muted">
        Your progress and points are tied to your account. Sign in to track
        completion and unlock the exam.
      </p>
      <SignInButton mode="modal">
        <button className="rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-coral-strong">
          Sign in
        </button>
      </SignInButton>
    </div>
  );
}

async function UnlockedOrLocked({
  questions,
}: {
  questions: Awaited<ReturnType<typeof getQuizForClient>>;
}) {
  const stats = await getMyStats();

  if (!stats.finalUnlocked) {
    const pct = Math.round(
      (stats.completedModules / Math.max(1, stats.totalModules)) * 100,
    );
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-border-soft bg-surface/40 p-6">
        <div className="flex items-center gap-2 text-text">
          <Lock size={18} className="text-coral" />
          <span className="font-medium">Locked</span>
        </div>
        <p className="text-sm text-muted">
          Complete every module first. The final exam unlocks once all modules
          are passed.
        </p>
        <div>
          <div className="flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-widest text-faint">
            <span>Modules completed</span>
            <span className="tabular-nums">
              {stats.completedModules}/{stats.totalModules}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-coral transition-[width] duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-coral hover:underline"
        >
          Keep learning <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <Quiz slug={FINAL_EXAM_SLUG} questions={questions ?? []} label="final exam" />
  );
}
