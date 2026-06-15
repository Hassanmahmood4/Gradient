"use client";

import { useEffect, useState } from "react";
import { Trophy } from "@phosphor-icons/react";
import { getMyStats } from "@/app/learn/actions";

/**
 * Shows the signed-in user's points total. Reads once on mount and then
 * updates live whenever a quiz is graded (the Quiz dispatches "gradient:points").
 */
export function PointsBadge() {
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    getMyStats().then((s) => {
      if (alive) setPoints(s.authed ? s.totalPoints : null);
    });

    const onPoints = (e: Event) => {
      setPoints((e as CustomEvent<number>).detail);
    };
    window.addEventListener("gradient:points", onPoints);
    return () => {
      alive = false;
      window.removeEventListener("gradient:points", onPoints);
    };
  }, []);

  if (points === null) return null;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-coral/30 bg-coral/5 px-3 py-1 font-mono text-xs font-medium text-coral tabular-nums"
      title="Points earned from quizzes"
    >
      <Trophy size={13} weight="fill" />
      {points} pts
    </span>
  );
}
