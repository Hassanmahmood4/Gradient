/* ----------------------------------------------------------------------------
   Quiz types shared between server and client.

   The full `Question` (with its `answer`) is server-only — it lives in
   `quizzes.ts`, which imports `server-only` so answer keys never reach the
   browser. The client only ever receives `ClientQuestion` (no answer), and
   grading happens in a Server Action that returns a `GradeResult`.
---------------------------------------------------------------------------- */

export type Question = {
  q: string;
  code?: string; // optional snippet rendered above the options
  options: string[];
  answer: number; // index into options — NEVER sent to the client
};

/** What the browser is allowed to see: the question without its answer. */
export type ClientQuestion = Omit<Question, "answer">;

export type GradeResult =
  | { ok: false; reason: "auth" }
  | { ok: false; reason: "error"; message: string }
  | {
      ok: true;
      correctCount: number;
      total: number;
      /** Per-question correct option index, returned only after submission. */
      correctAnswers: number[];
      passed: boolean;
      pointsForQuiz: number;
      totalPoints: number;
    };
