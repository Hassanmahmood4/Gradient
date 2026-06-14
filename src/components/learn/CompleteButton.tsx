"use client";

import { Check, Circle } from "@phosphor-icons/react";
import { useProgress } from "@/components/learn/progress";
import { cn } from "@/lib/utils";

export function CompleteButton({ slug }: { slug: string }) {
  const { isDone, toggle, loaded } = useProgress();
  const done = loaded && isDone(slug);

  return (
    <button
      onClick={() => toggle(slug)}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors active:scale-95",
        done
          ? "border border-success/40 bg-success/10 text-success"
          : "bg-coral text-bg hover:bg-coral-strong",
      )}
    >
      {done ? <Check size={15} weight="bold" /> : <Circle size={15} weight="bold" />}
      {done ? "Completed" : "Mark complete"}
    </button>
  );
}
