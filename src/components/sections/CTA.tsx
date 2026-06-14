"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

export function CTA() {
  const router = useRouter();
  return (
    <section className="relative px-5 py-24 sm:py-32">
      <Reveal>
        <div className="grain relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-surface/50 px-6 py-20 text-center sm:px-12">
          <div className="grid-lines absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
          <motion.div
            className="glow-coral absolute -left-20 -top-16 h-80 w-80 opacity-30 blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="glow-violet absolute -bottom-20 -right-16 h-96 w-96 opacity-30 blur-3xl"
            animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-10">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-coral">
              Ready when you are
            </span>
            <h2 className="font-display mx-auto mt-5 max-w-2xl text-[length:var(--text-display)] font-bold">
              Start seeing the math move today.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-muted">
              Free to start, no credit card. Pick a concept and watch it come
              alive in your browser.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" onClick={() => router.push("/learn")}>
                Start learning free
                <ArrowRight size={18} weight="bold" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push("/learn")}
              >
                Browse the curriculum
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
