"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, ArrowLeft, ArrowRight, Quotes } from "@phosphor-icons/react";
import { Reveal } from "@/components/motion/Reveal";

interface Review {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

const reviews: Review[] = [
  {
    quote:
      "I'd read the gradient descent chapter four times and still didn't get it. Ten minutes dragging the learning rate slider here and it finally clicked. I actually watched it diverge into NaN.",
    name: "Maya Chen",
    role: "CS junior · UC Berkeley",
    initials: "MC",
  },
  {
    quote:
      "The decision boundary visualization is unreal. Adding a layer and watching the curve bend is worth more than a whole semester of slides.",
    name: "Diego Santos",
    role: "ML student · Georgia Tech",
    initials: "DS",
  },
  {
    quote:
      "Finally a tool that doesn't dumb the math down. The equations are right there, hover-explained, and now they actually mean something to me.",
    name: "Priya Nair",
    role: "EE + CS · UIUC",
    initials: "PN",
  },
  {
    quote:
      "Used it to prep for my ML midterm. Went from a shaky B to acing it, because I could finally see what backprop was doing.",
    name: "Tom Becker",
    role: "Sophomore · TU München",
    initials: "TB",
  },
  {
    quote:
      "It feels like a playground, not a textbook. I keep tweaking parameters just to see what breaks, and that's how I learn.",
    name: "Aisha Rahman",
    role: "CS major · NUS",
    initials: "AR",
  },
];

const flip = {
  enter: (dir: number) => ({
    rotateY: dir > 0 ? 72 : -72,
    opacity: 0,
    scale: 0.95,
  }),
  center: { rotateY: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({
    rotateY: dir > 0 ? -72 : 72,
    opacity: 0,
    scale: 0.95,
  }),
};

export function Reviews() {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);

  const go = (d: number) =>
    setState(([i]) => [(i + d + reviews.length) % reviews.length, d]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
  }, [paused]);

  const r = reviews[index];

  return (
    <section id="reviews" className="relative scroll-mt-24 px-5 py-24 sm:py-32">
      <div className="glow-violet absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 opacity-15 blur-3xl" />

      <div className="mx-auto max-w-4xl">
        <Reveal className="text-center">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-coral">
            Loved by learners
          </span>
          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} weight="fill" className="text-coral" />
              ))}
            </div>
            <span className="font-mono text-sm text-muted">4.9 · 2,300+ reviews</span>
          </div>
        </Reveal>

        <Reveal
          delay={0.1}
          className="relative mt-12"
        >
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{ perspective: 1400 }}
            className="relative min-h-[280px] rounded-3xl border border-border-soft bg-surface/40 p-8 sm:p-12"
          >
            <Quotes
              size={48}
              weight="fill"
              className="text-coral/20"
            />
            <AnimatePresence mode="wait" custom={dir}>
              <motion.figure
                key={index}
                custom={dir}
                variants={flip}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: "center", backfaceVisibility: "hidden" }}
              >
                <blockquote className="font-display text-xl font-medium leading-relaxed sm:text-2xl">
                  {r.quote}
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-surface-2 font-mono text-sm font-semibold text-violet">
                    {r.initials}
                  </span>
                  <span>
                    <span className="block font-semibold">{r.name}</span>
                    <span className="block text-sm text-faint">{r.role}</span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* controls */}
          <div className="mt-6 flex items-center justify-between">
            <span className="flex items-center gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setState([i, i > index ? 1 : -1])}
                  aria-label={`Review ${i + 1}`}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === index ? 24 : 8,
                    background: i === index ? "var(--color-coral)" : "var(--color-border)",
                  }}
                />
              ))}
            </span>
            <span className="flex gap-2">
              <button
                onClick={() => go(-1)}
                aria-label="Previous review"
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted transition-colors hover:border-coral/60 hover:text-text"
              >
                <ArrowLeft size={16} weight="bold" />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Next review"
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted transition-colors hover:border-coral/60 hover:text-text"
              >
                <ArrowRight size={16} weight="bold" />
              </button>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
