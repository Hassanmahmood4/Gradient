"use server";

import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  getQuiz,
  MODULE_QUIZ_SLUGS,
  POINTS_PER_CORRECT,
} from "@/lib/quizzes";
import type { GradeResult } from "@/lib/quiz-types";

/* ----------------------------------------------------------------------------
   Server Actions for the points system.

   Grading is authoritative on the server: answer keys live server-side, the
   action recomputes the score, and persists the user's *best* result per quiz.
   Points = SUM(best_correct) * 10, so re-taking a quiz can only ever raise a
   score, never farm extra points.
---------------------------------------------------------------------------- */

type ScoreRow = { quiz_slug: string; best_correct: number; passed: boolean };

async function sumPoints(userId: string): Promise<number> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("quiz_scores")
    .select("best_correct")
    .eq("user_id", userId);
  const totalCorrect = (data ?? []).reduce(
    (n, r) => n + (r.best_correct ?? 0),
    0,
  );
  return totalCorrect * POINTS_PER_CORRECT;
}

/** Grade a submitted quiz, persist the best score, and return the result. */
export async function gradeQuiz(
  slug: string,
  picks: (number | null)[],
): Promise<GradeResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, reason: "auth" };

  const quiz = getQuiz(slug);
  if (!quiz) return { ok: false, reason: "error", message: "Unknown quiz." };

  const total = quiz.length;
  const correctAnswers = quiz.map((q) => q.answer);
  let correctCount = 0;
  for (let i = 0; i < total; i++) {
    if (picks[i] === correctAnswers[i]) correctCount++;
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: existing } = await supabase
      .from("quiz_scores")
      .select("best_correct")
      .eq("user_id", userId)
      .eq("quiz_slug", slug)
      .maybeSingle();

    const best = Math.max(existing?.best_correct ?? 0, correctCount);
    const passed = best === total;

    const { error } = await supabase.from("quiz_scores").upsert(
      {
        user_id: userId,
        quiz_slug: slug,
        best_correct: best,
        total_questions: total,
        passed,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,quiz_slug" },
    );
    if (error) throw error;

    return {
      ok: true,
      correctCount,
      total,
      correctAnswers,
      passed,
      pointsForQuiz: best * POINTS_PER_CORRECT,
      totalPoints: await sumPoints(userId),
    };
  } catch (e) {
    return {
      ok: false,
      reason: "error",
      message: e instanceof Error ? e.message : "Could not save your score.",
    };
  }
}

export type MyStats = {
  authed: boolean;
  totalPoints: number;
  /** Modules whose quiz was answered all-correct — gates the final exam. */
  passedSlugs: string[];
  /** Modules whose quiz was submitted at all — drives the sidebar tick. */
  attemptedSlugs: string[];
  completedModules: number;
  totalModules: number;
  finalUnlocked: boolean;
};

/** Read the signed-in user's points, completion, and final-exam unlock state. */
export async function getMyStats(): Promise<MyStats> {
  const empty: MyStats = {
    authed: false,
    totalPoints: 0,
    passedSlugs: [],
    attemptedSlugs: [],
    completedModules: 0,
    totalModules: MODULE_QUIZ_SLUGS.length,
    finalUnlocked: false,
  };

  const { userId } = await auth();
  if (!userId) return empty;

  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("quiz_scores")
      .select("quiz_slug, best_correct, passed")
      .eq("user_id", userId);

    const rows = (data ?? []) as ScoreRow[];
    const totalCorrect = rows.reduce((n, r) => n + (r.best_correct ?? 0), 0);
    const passedSlugs = rows.filter((r) => r.passed).map((r) => r.quiz_slug);
    const attemptedSlugs = rows.map((r) => r.quiz_slug);
    const completedModules = MODULE_QUIZ_SLUGS.filter((s) =>
      passedSlugs.includes(s),
    ).length;

    return {
      authed: true,
      totalPoints: totalCorrect * POINTS_PER_CORRECT,
      passedSlugs,
      attemptedSlugs,
      completedModules,
      totalModules: MODULE_QUIZ_SLUGS.length,
      finalUnlocked: completedModules === MODULE_QUIZ_SLUGS.length,
    };
  } catch {
    // DB not configured yet — fail soft so the UI still renders.
    return { ...empty, authed: true };
  }
}
