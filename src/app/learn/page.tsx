import Link from "next/link";
import { ArrowRight, Flask } from "@phosphor-icons/react/dist/ssr";
import { curriculum, allTopics, FIRST_TOPIC } from "@/lib/curriculum";

const labCount = allTopics.filter((t) => t.lab).length;

export default function LearnHome() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="border-b border-border-soft pb-8">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-violet">
          The curriculum
        </span>
        <h1 className="font-display mt-3 text-[length:var(--text-title)] font-bold">
          Machine learning, one moving idea at a time.
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          {allTopics.length} topics across {curriculum.length} areas, with{" "}
          {labCount} hands-on labs where you tune the model and watch it respond.
          Read the concept, then make it move.
        </p>
        <Link
          href={`/learn/${FIRST_TOPIC}`}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-coral-strong"
        >
          Start from the beginning <ArrowRight size={16} weight="bold" />
        </Link>
      </div>

      <div className="mt-10 space-y-10">
        {curriculum.map((cat) => (
          <section key={cat.id}>
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-lg font-semibold">{cat.title}</h2>
              <span className="font-mono text-xs text-faint">{cat.blurb}</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {cat.topics.map((t) => (
                <Link
                  key={t.slug}
                  href={`/learn/${t.slug}`}
                  className="group rounded-xl border border-border-soft bg-surface/40 p-4 transition-colors hover:border-coral/50 hover:bg-surface"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-text group-hover:text-text">
                      {t.title}
                    </h3>
                    {t.lab ? (
                      <span className="flex shrink-0 items-center gap-1 rounded-full border border-coral/30 bg-coral/5 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wide text-coral">
                        <Flask size={11} /> Lab
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {t.summary}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
