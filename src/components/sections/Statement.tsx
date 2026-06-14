"use client";

import { motion } from "framer-motion";
import { Reveal, staggerContainer, staggerItem } from "@/components/motion/Reveal";

const topics = [
  "Linear regression",
  "Gradient descent",
  "Logistic regression",
  "Decision trees",
  "K-means",
  "Neural networks",
  "Backpropagation",
  "CNNs",
  "Regularization",
  "Attention",
  "Transformers",
  "Embeddings",
];

export function Statement() {
  return (
    <section className="relative px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-coral">
            The problem
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display mx-auto mt-6 max-w-3xl text-[length:var(--text-display)] font-bold leading-[1.05]">
            Your textbook tells you the math.
            <br />
            It never lets you <span className="text-violet">feel</span> it.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted">
            Reading the gradient descent chapter for the fourth time won&rsquo;t
            make it click. Watching the optimizer overshoot when you crank the
            learning rate will. Every concept here is a live system you control.
          </p>
        </Reveal>
      </div>

      {/* topic chips */}
      <Reveal delay={0.15} className="mx-auto mt-16 max-w-4xl">
        <p className="mb-5 text-center font-mono text-xs uppercase tracking-widest text-faint">
          One growing library
        </p>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-wrap justify-center gap-2.5"
        >
          {topics.map((t) => (
            <motion.span
              key={t}
              variants={staggerItem}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="cursor-default rounded-full border border-border-soft bg-surface/40 px-4 py-2 text-sm text-muted transition-colors hover:border-coral/50 hover:text-text"
            >
              {t}
            </motion.span>
          ))}
        </motion.div>
      </Reveal>
    </section>
  );
}
