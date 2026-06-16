import Link from "next/link";
import type { Metadata } from "next";
import { Terminal } from "@phosphor-icons/react/dist/ssr";
import { allTopics, topicCategory } from "@/lib/curriculum";
import { Playground, type PlaygroundItem } from "@/components/learn/Playground";

export const metadata: Metadata = {
  title: "Playground — Gradient",
  description:
    "Every interactive lab and its source in one place — run the visualizations and read the exact code behind each algorithm.",
};

export default function PlaygroundPage() {
  const items: PlaygroundItem[] = allTopics
    .filter((t) => t.lab || t.labCode)
    .map((t) => ({
      slug: t.slug,
      title: t.title,
      category: topicCategory(t.slug)?.title ?? "",
      lab: t.lab,
      code: t.labCode,
    }));

  return (
    <article className="mx-auto max-w-5xl">
      <div className="flex items-center gap-2 font-mono text-xs text-faint">
        <Link href="/learn" className="hover:text-text">
          Learn
        </Link>
        <span>/</span>
        <span className="text-muted">Playground</span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <Terminal size={28} weight="fill" className="text-coral" />
        <h1 className="font-display text-[length:var(--text-title)] font-bold">
          Playground
        </h1>
      </div>
      <p className="mt-2 max-w-xl text-muted">
        Every lab in the curriculum, together. Pick an algorithm to run its live
        visualization and read the exact code behind it — no setup, nothing to
        install.
      </p>

      <div className="mt-8">
        <Playground items={items} />
      </div>
    </article>
  );
}
