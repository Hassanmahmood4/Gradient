"use client";

import { useEffect } from "react";
import { getMyStats } from "@/app/learn/actions";
import { useProgress } from "@/components/learn/progress";

/**
 * Seeds the local progress store from the server's authoritative completion
 * (passed quiz slugs) so the sidebar ticks reflect what's actually in the DB —
 * on first load and whenever a quiz is graded ("gradient:points" fires).
 * Renders nothing.
 */
export function ProgressSync() {
  const { mergeComplete } = useProgress();

  useEffect(() => {
    let alive = true;
    const sync = () =>
      getMyStats().then((s) => {
        if (alive && s.authed) mergeComplete(s.attemptedSlugs);
      });

    sync();
    window.addEventListener("gradient:points", sync);
    return () => {
      alive = false;
      window.removeEventListener("gradient:points", sync);
    };
  }, [mergeComplete]);

  return null;
}
