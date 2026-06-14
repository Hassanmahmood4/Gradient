"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/motion/Reveal";

const schools = ["MIT", "Stanford", "UC Berkeley", "CMU", "Georgia Tech", "ETH Zürich"];

export function TrustBar() {
  return (
    <section className="border-y border-border-soft px-5 py-12">
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-mono text-xs uppercase tracking-[0.2em] text-faint"
        >
          Learned by students at
        </motion.p>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-14"
        >
          {schools.map((s) => (
            <motion.span
              key={s}
              variants={staggerItem}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="cursor-default font-display text-lg font-semibold text-muted/70 transition-colors hover:text-text"
            >
              {s}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
