import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Flask } from "@phosphor-icons/react/dist/ssr";
import {
  allTopics,
  getTopic,
  topicCategory,
  adjacentTopics,
} from "@/lib/curriculum";
import { getQuiz } from "@/lib/quizzes";
import { LessonContent } from "@/components/learn/LessonContent";
import { LabPanel } from "@/components/learn/LabPanel";
import { CompleteButton } from "@/components/learn/CompleteButton";
import { Quiz } from "@/components/learn/Quiz";

export function generateStaticParams() {
  return allTopics.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/learn/[topic]">): Promise<Metadata> {
  const { topic } = await params;
  const t = getTopic(topic);
  if (!t) return { title: "Not found — Gradient" };
  return { title: `${t.title} — Gradient`, description: t.summary };
}

export default async function TopicPage({
  params,
}: PageProps<"/learn/[topic]">) {
  const { topic } = await params;
  const t = getTopic(topic);
  if (!t) notFound();

  const cat = topicCategory(topic);
  const { prev, next } = adjacentTopics(topic);
  const quiz = getQuiz(topic);

  return (
    <article className="mx-auto max-w-3xl">
      {/* header */}
      <div className="flex items-center gap-2 font-mono text-xs text-faint">
        <Link href="/learn" className="hover:text-text">
          Learn
        </Link>
        {cat ? (
          <>
            <span>/</span>
            <span className="text-muted">{cat.title}</span>
          </>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-[length:var(--text-title)] font-bold">
            {t.title}
          </h1>
          <p className="mt-2 max-w-xl text-muted">{t.summary}</p>
        </div>
        <CompleteButton slug={t.slug} />
      </div>

      {/* lab */}
      {t.lab ? (
        <section className="mt-8">
          <div className="mb-3 flex items-center gap-2">
            <Flask size={16} weight="fill" className="text-coral" />
            <h2 className="font-display text-lg font-semibold">Interactive lab</h2>
          </div>
          <LabPanel labKey={t.lab} code={t.labCode} />
        </section>
      ) : null}

      {/* written lesson */}
      <section className="mt-10">
        <LessonContent blocks={t.content} />
      </section>

      {/* quiz — passing all three auto-completes the module */}
      {quiz ? <Quiz slug={t.slug} questions={quiz} /> : null}

      {/* prev / next */}
      <nav className="mt-12 grid gap-3 border-t border-border-soft pt-6 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/learn/${prev.slug}`}
            className="group flex items-center gap-3 rounded-xl border border-border-soft bg-surface/40 p-4 transition-colors hover:border-coral/50"
          >
            <ArrowLeft size={16} className="text-faint group-hover:text-coral" />
            <span>
              <span className="block font-mono text-[0.62rem] uppercase tracking-widest text-faint">
                Previous
              </span>
              <span className="text-sm text-text">{prev.title}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/learn/${next.slug}`}
            className="group flex items-center justify-end gap-3 rounded-xl border border-border-soft bg-surface/40 p-4 text-right transition-colors hover:border-coral/50 sm:col-start-2"
          >
            <span>
              <span className="block font-mono text-[0.62rem] uppercase tracking-widest text-faint">
                Next
              </span>
              <span className="text-sm text-text">{next.title}</span>
            </span>
            <ArrowRight size={16} className="text-faint group-hover:text-coral" />
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
